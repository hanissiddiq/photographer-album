import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

import {
    generateAlbumToken,
    hashAlbumToken,
} from "@/lib/security/album-token";

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
        | 1. Validasi login
        |--------------------------------------------------------------------------
        */

        const supabase = await createClient();

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
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
        | 2. Admin client
        |--------------------------------------------------------------------------
        */

        const admin = createAdminClient();

        /*
        |--------------------------------------------------------------------------
        | 3. Pastikan album milik photographer
        |--------------------------------------------------------------------------
        */

        const { data: album, error: albumError } =
            await admin
                .from("albums")
                .select(`
                    id,
                    title,
                    photographer_id,
                    is_active,
                    expires_at
                `)
                .eq("id", id)
                .eq("photographer_id", user.id)
                .single();

        if (albumError || !album) {
            return NextResponse.json(
                {
                    error: "Album tidak ditemukan.",
                },
                {
                    status: 404,
                }
            );
        }

        /*
        |--------------------------------------------------------------------------
        | 4. Generate token
        |--------------------------------------------------------------------------
        */

        const token = generateAlbumToken();

        const tokenHash =
            hashAlbumToken(token);

        /*
        |--------------------------------------------------------------------------
        | 5. Nonaktifkan token lama
        |--------------------------------------------------------------------------
        */

        await admin
            .from("album_access_tokens")
            .update({
                is_active: false,
                updated_at:
                    new Date().toISOString(),
            })
            .eq("album_id", album.id)
            .eq("is_active", true);

        /*
        |--------------------------------------------------------------------------
        | 6. Buat token baru
        |--------------------------------------------------------------------------
        */

        const { error: tokenError } =
            await admin
                .from("album_access_tokens")
                .insert({
                    album_id: album.id,

                    token_hash: tokenHash,

                    expires_at:
                        album.expires_at ??
                        null,

                    is_active: true,
                });

        if (tokenError) {
            console.error(
                "Token error:",
                tokenError
            );

            return NextResponse.json(
                {
                    error:
                        "Gagal membuat public link.",
                },
                {
                    status: 500,
                }
            );
        }

        /*
        |--------------------------------------------------------------------------
        | 7. Buat URL
        |--------------------------------------------------------------------------
        */

        const baseUrl =
            process.env.NEXT_PUBLIC_SITE_URL;

        if (!baseUrl) {
            throw new Error(
                "NEXT_PUBLIC_SITE_URL belum dikonfigurasi."
            );
        }

        const publicUrl =
            `${baseUrl}/a/${token}`;

        return NextResponse.json({
            success: true,

            url: publicUrl,

            token,
        });

    } catch (error) {
        console.error(
            "PUBLIC LINK ERROR:",
            error
        );

        return NextResponse.json(
            {
                error:
                    "Gagal membuat public album link.",
            },
            {
                status: 500,
            }
        );
    }
}