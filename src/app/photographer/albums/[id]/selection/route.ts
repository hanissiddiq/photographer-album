import {
    NextResponse,
} from "next/server";

import {
    createServerClient,
} from "@/lib/supabase/server";

import {
    getAlbumSelection,
} from "@/lib/photographer/album-selection";

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

        /*
        |--------------------------------------------------------------------------
        | Auth
        |--------------------------------------------------------------------------
        */

        const supabase =
            await createServerClient();

        const {
            data: {
                user,
            },
        } =
            await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json(
                {
                    error:
                        "Unauthenticated.",
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

        const data =
            await getAlbumSelection(
                id
            );

        /*
        |--------------------------------------------------------------------------
        | Photographer ownership
        |--------------------------------------------------------------------------
        */

        if (
            data.album
                .photographer_id !==
            user.id
        ) {
            return NextResponse.json(
                {
                    error:
                        "Anda tidak memiliki akses ke album ini.",
                },
                {
                    status: 403,
                }
            );
        }

        return NextResponse.json({
            success: true,
            ...data,
        });

    } catch (error) {
        console.error(
            "GET PHOTOGRAPHER SELECTION ERROR:",
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