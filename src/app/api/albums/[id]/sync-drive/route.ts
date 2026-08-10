import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

import {
    getGoogleDriveForPhotographer,
} from "@/lib/google-drive/service";

interface Params {
    params: Promise<{
        id: string;
    }>;
}

export async function POST(
    request: Request,
    { params }: Params
) {
    try {
        const { id } = await params;

        /*
        |--------------------------------------------------------------------------
        | 1. Validasi user login
        |--------------------------------------------------------------------------
        */

        const supabase = await createClient();

        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                {
                    error: "Unauthorized",
                },
                {
                    status: 401,
                }
            );
        }

        /*
        |--------------------------------------------------------------------------
        | 2. Validasi photographer
        |--------------------------------------------------------------------------
        */

        const { data: profile, error: profileError } =
            await supabase
                .from("profiles")
                .select("id, role")
                .eq("id", user.id)
                .single();

        if (
            profileError ||
            !profile ||
            profile.role !== "photographer"
        ) {
            return NextResponse.json(
                {
                    error: "Forbidden",
                },
                {
                    status: 403,
                }
            );
        }

        /*
        |--------------------------------------------------------------------------
        | 3. Gunakan Admin Client untuk proses sync
        |--------------------------------------------------------------------------
        |
        | Service role digunakan HANYA di server.
        | Ini diperlukan karena INSERT/UPSERT album_photos
        | tidak diberikan kepada browser/user biasa.
        |
        */

        const admin = createAdminClient();

        /*
        |--------------------------------------------------------------------------
        | 4. Ambil album dan pastikan milik photographer
        |--------------------------------------------------------------------------
        */

        const { data: album, error: albumError } =
            await admin
                .from("albums")
                .select(`
                    id,
                    photographer_id,
                    title,
                    drive_folder_id,
                    drive_folder_name
                `)
                .eq("id", id)
                .eq("photographer_id", user.id)
                .single();

        if (albumError || !album) {
            console.error(
                "Album error:",
                albumError
            );

            return NextResponse.json(
                {
                    error:
                        "Album tidak ditemukan atau bukan milik photographer.",
                },
                {
                    status: 404,
                }
            );
        }

        /*
        |--------------------------------------------------------------------------
        | 5. Pastikan Google Drive folder sudah dipilih
        |--------------------------------------------------------------------------
        */

        if (!album.drive_folder_id) {
            return NextResponse.json(
                {
                    error:
                        "Google Drive folder belum dipilih.",
                },
                {
                    status: 422,
                }
            );
        }

        /*
        |--------------------------------------------------------------------------
        | 6. Connect Google Drive
        |--------------------------------------------------------------------------
        */

        const drive =
            await getGoogleDriveForPhotographer(
                user.id
            );

        /*
        |--------------------------------------------------------------------------
        | 7. Ambil semua foto dari folder
        |--------------------------------------------------------------------------
        */

        const files: Array<{
            id?: string | null;
            name?: string | null;
            mimeType?: string | null;
            size?: string | null;
            modifiedTime?: string | null;
            thumbnailLink?: string | null;
            webViewLink?: string | null;
        }> = [];

        let pageToken: string | undefined;

        do {
            const result =
                await drive.files.list({
                    q: [
                        `'${album.drive_folder_id}' in parents`,
                        "trashed = false",
                        "mimeType contains 'image/'",
                    ].join(" and "),

                    fields:
                        "nextPageToken,files(id,name,mimeType,size,modifiedTime,thumbnailLink,webViewLink)",

                    pageSize: 1000,

                    pageToken,
                });

            if (result.data.files) {
                files.push(
                    ...result.data.files
                );
            }

            pageToken =
                result.data.nextPageToken ??
                undefined;

        } while (pageToken);

        console.log(
            `Google Drive: ditemukan ${files.length} foto`
        );

        /*
        |--------------------------------------------------------------------------
        | 8. Jika tidak ada foto
        |--------------------------------------------------------------------------
        */

        if (files.length === 0) {
            await admin
                .from("albums")
                .update({
                    photos_synced_at:
                        new Date().toISOString(),
                })
                .eq("id", album.id);

            return NextResponse.json({
                success: true,
                total: 0,
                message:
                    "Tidak ada foto ditemukan di folder Google Drive.",
            });
        }

        /*
        |--------------------------------------------------------------------------
        | 9. Mapping Google Drive → album_photos
        |--------------------------------------------------------------------------
        */

        const rows = files
            .filter((file) => file.id)
            .map((file, index) => ({
                album_id: album.id,

                drive_file_id:
                    file.id!,

                file_name:
                    file.name ??
                    `photo-${index + 1}`,

                mime_type:
                    file.mimeType ??
                    null,

                file_size:
                    file.size
                        ? Number(file.size)
                        : null,

                drive_modified_time:
                    file.modifiedTime ??
                    null,

                thumbnail_url:
                    file.thumbnailLink ??
                    null,

                web_view_link:
                    file.webViewLink ??
                    null,

                sort_order: index,
            }));

        /*
        |--------------------------------------------------------------------------
        | 10. UPSERT menggunakan Admin Client
        |--------------------------------------------------------------------------
        */

        const { error: photoError } =
            await admin
                .from("album_photos")
                .upsert(
                    rows,
                    {
                        onConflict:
                            "album_id,drive_file_id",
                    }
                );

        if (photoError) {
            console.error(
                "album_photos error:",
                photoError
            );

            return NextResponse.json(
                {
                    error:
                        "Gagal menyimpan foto ke database.",
                    details:
                        photoError.message,
                },
                {
                    status: 500,
                }
            );
        }

        /*
        |--------------------------------------------------------------------------
        | 11. Update waktu sync album
        |--------------------------------------------------------------------------
        */

        const { error: updateAlbumError } =
            await admin
                .from("albums")
                .update({
                    photos_synced_at:
                        new Date().toISOString(),
                })
                .eq("id", album.id);

        if (updateAlbumError) {
            console.error(
                "Album update error:",
                updateAlbumError
            );
        }

        /*
        |--------------------------------------------------------------------------
        | 12. Response
        |--------------------------------------------------------------------------
        */

        return NextResponse.json({
            success: true,

            total: rows.length,

            album_id: album.id,

            folder_name:
                album.drive_folder_name,

            message:
                `Berhasil sinkronisasi ${rows.length} foto.`,
        });

    } catch (error) {
        console.error(
            "SYNC DRIVE ERROR:",
            error
        );

        return NextResponse.json(
            {
                error:
                    "Gagal melakukan sinkronisasi foto.",
                details:
                    error instanceof Error
                        ? error.message
                        : "Unknown error",
            },
            {
                status: 500,
            }
        );
    }
}