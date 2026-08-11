import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";

import {
    getPublicAlbumAccess,
} from "@/lib/security/public-album";

interface RouteContext {
    params: Promise<{
        token: string;
    }>;
}

export async function POST(
    request: Request,
    context: RouteContext
) {
    try {
        const { token } = await context.params;

        if (!token) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Token album tidak valid.",
                },
                {
                    status: 400,
                }
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Validate public album access
        |--------------------------------------------------------------------------
        */

        const {
            accessTokenId,
            album,
        } = await getPublicAlbumAccess(token);

        /*
        |--------------------------------------------------------------------------
        | Supabase Admin
        |--------------------------------------------------------------------------
        */

        const supabase =
            createAdminClient();

        /*
        |--------------------------------------------------------------------------
        | Get current selection
        |--------------------------------------------------------------------------
        */

        const {
            data: selection,
            error: selectionError,
        } = await supabase
            .from("album_selections")
            .select(`
                id,
                album_id,
                access_token_id,
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
            console.error(
                "GET SELECTION ERROR:",
                selectionError
            );

            return NextResponse.json(
                {
                    success: false,
                    error:
                        "Gagal mengambil data pilihan foto.",
                },
                {
                    status: 500,
                }
            );
        }

        if (!selection) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        "Belum ada pilihan foto.",
                },
                {
                    status: 422,
                }
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Already submitted
        |--------------------------------------------------------------------------
        */

        if (
            selection.status !==
            "draft"
        ) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        "Pilihan foto sudah dikirim dan tidak dapat diubah.",
                    status:
                        selection.status,
                },
                {
                    status: 409,
                }
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Submit through PostgreSQL RPC
        |--------------------------------------------------------------------------
        */

        const {
            data: result,
            error: rpcError,
        } = await supabase.rpc(
            "submit_album_selection",
            {
                p_selection_id:
                    selection.id,

                p_album_id:
                    album.id,

                p_access_token_id:
                    accessTokenId,
            }
        );

        if (rpcError) {
            console.error(
                "SUBMIT ALBUM SELECTION RPC ERROR:",
                rpcError
            );

            return NextResponse.json(
                {
                    success: false,
                    error:
                        rpcError.message ||
                        "Gagal mengirim pilihan foto.",
                },
                {
                    status: 422,
                }
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Success
        |--------------------------------------------------------------------------
        */

        return NextResponse.json(
            {
                success: true,

                message:
                    "Pilihan foto berhasil dikirim.",

                selection: result,
            },
            {
                status: 200,
            }
        );

    } catch (error) {
        console.error(
            "SUBMIT SELECTION ERROR:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Gagal mengirim pilihan foto.",
            },
            {
                status: 500,
            }
        );
    }
}