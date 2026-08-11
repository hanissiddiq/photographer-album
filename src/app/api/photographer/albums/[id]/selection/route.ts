import { NextResponse } from "next/server";

import { createServerSupabaseClient } from "@/lib/supabase/server";

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export async function GET(
    request: Request,
    { params }: Props
) {
    try {
        const { id } =
            await params;

        const supabase =
            await createServerSupabaseClient();

        /*
        |--------------------------------------------------------------------------
        | Authentication
        |--------------------------------------------------------------------------
        */

        const {
            data: {
                user,
            },
            error: authError,
        } = await supabase.auth.getUser();

        if (
            authError ||
            !user
        ) {
            return NextResponse.json(
                {
                    error:
                        "Unauthorized",
                },
                {
                    status: 401,
                }
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Album
        |--------------------------------------------------------------------------
        */

        const {
            data: album,
            error: albumError,
        } = await supabase
            .from("albums")
            .select(`
                id,
                photographer_id,
                title,
                quota,
                status,
                created_at,
                updated_at
            `)
            .eq("id", id)
            .eq(
                "photographer_id",
                user.id
            )
            .single();

        if (albumError) {
            return NextResponse.json(
                {
                    error:
                        "Album tidak ditemukan.",
                },
                {
                    status: 404,
                }
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Selection
        |--------------------------------------------------------------------------
        */

        const {
            data: selection,
            error: selectionError,
        } = await supabase
            .from(
                "album_selections"
            )
            .select(`
                id,
                access_token_id,
                selected_count,
                status,
                submitted_at,
                created_at,
                updated_at
            `)
            .eq(
                "album_id",
                id
            )
            .eq(
                "status",
                "submitted"
            )
            .order(
                "submitted_at",
                {
                    ascending: false,
                }
            )
            .limit(1)
            .maybeSingle();

        if (selectionError) {
            throw selectionError;
        }

        if (!selection) {
            return NextResponse.json({
                success: true,
                album,
                selection: null,
                photos: [],
            });
        }

        /*
        |--------------------------------------------------------------------------
        | Selected photos
        |--------------------------------------------------------------------------
        */

        const {
            data: selectedPhotos,
            error:
                selectedPhotosError,
        } = await supabase
            .from(
                "album_selected_photos"
            )
            .select(`
                id,
                album_photo_id,
                selected_at,
                album_photos (
                    id,
                    file_name,
                    file_url,
                    thumbnail_url,
                    position
                )
            `)
            .eq(
                "selection_id",
                selection.id
            )
            .order(
                "selected_at",
                {
                    ascending: true,
                }
            );

        if (
            selectedPhotosError
        ) {
            throw selectedPhotosError;
        }

        return NextResponse.json({
            success: true,

            album,

            selection,

            photos:
                selectedPhotos ?? [],
        });

    } catch (error) {
        console.error(
            "PHOTOGRAPHER SELECTION ERROR:",
            error
        );

        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Gagal mengambil pilihan foto.",
            },
            {
                status: 500,
            }
        );
    }
}