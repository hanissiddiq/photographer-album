import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";

import {
    getPublicAlbumAccess,
} from "@/lib/security/public-album";

interface Props {
    params: Promise<{
        token: string;
    }>;
}

function normalizeWhatsAppNumber(
    phone: string
) {
    let number =
        phone.replace(
            /\D/g,
            ""
        );

    if (
        number.startsWith("0")
    ) {
        number =
            "62" +
            number.slice(1);
    }

    if (
        number.startsWith("62")
    ) {
        return number;
    }

    return number;
}

export async function GET(
    request: Request,
    { params }: Props
) {
    try {
        const { token } =
            await params;

        /*
        |--------------------------------------------------------------------------
        | Validate album access
        |--------------------------------------------------------------------------
        */

        const {
            accessTokenId,
            album,
        } =
            await getPublicAlbumAccess(
                token
            );

        const admin =
            createAdminClient();

        /*
        |--------------------------------------------------------------------------
        | Get selection
        |--------------------------------------------------------------------------
        */

        const {
            data: selection,
            error: selectionError,
        } = await admin
            .from(
                "album_selections"
            )
            .select(`
                id,
                selected_count,
                status,
                submitted_at
            `)
            .eq(
                "album_id",
                album.id
            )
            .eq(
                "access_token_id",
                accessTokenId
            )
            .maybeSingle();

        if (selectionError) {
            throw selectionError;
        }

        if (!selection) {
            return NextResponse.json(
                {
                    error:
                        "Pilihan foto belum dibuat.",
                },
                {
                    status: 422,
                }
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Must be submitted
        |--------------------------------------------------------------------------
        */

        if (
            selection.status !==
            "submitted"
        ) {
            return NextResponse.json(
                {
                    error:
                        "Pilihan foto belum dikirim.",
                },
                {
                    status: 422,
                }
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Get selected photos
        |--------------------------------------------------------------------------
        */

        const {
            data: selectedPhotos,
            error:
                selectedPhotosError,
        } = await admin
            .from(
                "album_selected_photos"
            )
            .select(`
                album_photo_id,
                album_photos (
                    id,
                    file_name
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

        /*
        |--------------------------------------------------------------------------
        | Get photographer
        |--------------------------------------------------------------------------
        */

        const {
            data: photographer,
            error:
                photographerError,
        } = await admin
            .from("profiles")
            .select(`
                id,
                full_name,
                phone
            `)
            .eq(
                "id",
                album.photographer_id
            )
            .single();

        if (photographerError) {
            throw photographerError;
        }

        if (
            !photographer?.phone
        ) {
            return NextResponse.json(
                {
                    error:
                        "Nomor WhatsApp fotografer belum diatur.",
                },
                {
                    status: 422,
                }
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Extract file names
        |--------------------------------------------------------------------------
        */

        const fileNames =
            (
                selectedPhotos ??
                []
            )
                .map(
                    (item: any) =>
                        item.album_photos
                            ?.file_name
                )
                .filter(
                    Boolean
                );

        if (
            fileNames.length ===
            0
        ) {
            return NextResponse.json(
                {
                    error:
                        "Tidak ada foto yang dipilih.",
                },
                {
                    status: 422,
                }
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Validate count
        |--------------------------------------------------------------------------
        */

        if (
            fileNames.length !==
            album.quota
        ) {
            return NextResponse.json(
                {
                    error:
                        `Jumlah foto yang dipilih (${fileNames.length}) tidak sesuai quota (${album.quota}).`,
                },
                {
                    status: 422,
                }
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Generate WhatsApp message
        |--------------------------------------------------------------------------
        */

        const photographerName =
            photographer.full_name ??
            "Fotografer";

        const message = [
            `Halo ${photographerName},`,
            ``,
            `Saya sudah selesai memilih foto untuk album "${album.title}".`,
            ``,
            `Jumlah foto: ${fileNames.length} foto`,
            `Quota: ${album.quota} foto`,
            ``,
            `Daftar foto yang saya pilih:`,
            ``,
            ...fileNames.map(
                (
                    fileName,
                    index
                ) =>
                    `${index + 1}. ${fileName}`
            ),
            ``,
            `Status: Foto sudah dipilih sesuai kuota.`,
            ``,
            `Terima kasih.`,
        ].join("\n");

        /*
        |--------------------------------------------------------------------------
        | WhatsApp URL
        |--------------------------------------------------------------------------
        */

        const phone =
            normalizeWhatsAppNumber(
                photographer.phone
            );

        const whatsappUrl =
            `https://wa.me/${phone}?text=${encodeURIComponent(
                message
            )}`;

        return NextResponse.json({
            success: true,

            whatsapp_url:
                whatsappUrl,

            phone,

            message,

            file_names:
                fileNames,

            count:
                fileNames.length,
        });

    } catch (error) {
        console.error(
            "WHATSAPP SELECTION ERROR:",
            error
        );

        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Gagal membuat pesan WhatsApp.",
            },
            {
                status: 500,
            }
        );
    }
}