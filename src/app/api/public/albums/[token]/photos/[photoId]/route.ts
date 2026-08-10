import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";

import {
    hashAlbumToken,
} from "@/lib/security/album-token";

import {
    getGoogleDriveForPhotographer,
} from "@/lib/google-drive/service";

interface Props {
    params: Promise<{
        token: string;
        photoId: string;
    }>;
}

export async function GET(
    request: Request,
    { params }: Props
) {
    try {
        const {
            token,
            photoId,
        } = await params;

        if (
            !token ||
            !photoId
        ) {
            return new NextResponse(
                "Not Found",
                {
                    status: 404,
                }
            );
        }

        const admin =
            createAdminClient();

        /*
        |--------------------------------------------------------------------------
        | 1. Validate token
        |--------------------------------------------------------------------------
        */

        const tokenHash =
            hashAlbumToken(token);

        const {
            data: accessToken,
        } = await admin
            .from("album_access_tokens")
            .select(`
                id,
                album_id,
                expires_at,
                is_active
            `)
            .eq(
                "token_hash",
                tokenHash
            )
            .eq(
                "is_active",
                true
            )
            .single();

        if (!accessToken) {
            return new NextResponse(
                "Not Found",
                {
                    status: 404,
                }
            );
        }

        /*
        |--------------------------------------------------------------------------
        | 2. Check token expiration
        |--------------------------------------------------------------------------
        */

        if (
            accessToken.expires_at &&
            new Date(
                accessToken.expires_at
            ).getTime() < Date.now()
        ) {
            return new NextResponse(
                "Album Expired",
                {
                    status: 410,
                }
            );
        }

        /*
        |--------------------------------------------------------------------------
        | 3. Get album
        |--------------------------------------------------------------------------
        */

        const {
            data: album,
        } = await admin
            .from("albums")
            .select(`
                id,
                photographer_id,
                is_active,
                expires_at
            `)
            .eq(
                "id",
                accessToken.album_id
            )
            .eq(
                "is_active",
                true
            )
            .single();

        if (!album) {
            return new NextResponse(
                "Not Found",
                {
                    status: 404,
                }
            );
        }

        /*
        |--------------------------------------------------------------------------
        | 4. Check album expiration
        |--------------------------------------------------------------------------
        */

        if (
            album.expires_at &&
            new Date(
                album.expires_at
            ).getTime() < Date.now()
        ) {
            return new NextResponse(
                "Album Expired",
                {
                    status: 410,
                }
            );
        }

        /*
        |--------------------------------------------------------------------------
        | 5. IMPORTANT
        |    Photo MUST belong to this album
        |--------------------------------------------------------------------------
        */

        const {
            data: photo,
        } = await admin
            .from("album_photos")
            .select(`
                id,
                album_id,
                drive_file_id,
                file_name,
                mime_type
            `)
            .eq(
                "id",
                photoId
            )
            .eq(
                "album_id",
                album.id
            )
            .single();

        if (!photo) {
            return new NextResponse(
                "Not Found",
                {
                    status: 404,
                }
            );
        }

        /*
        |--------------------------------------------------------------------------
        | 6. Get photographer Google Drive
        |--------------------------------------------------------------------------
        */

        const drive =
            await getGoogleDriveForPhotographer(
                album.photographer_id
            );

        /*
        |--------------------------------------------------------------------------
        | 7. Download file from Google Drive
        |--------------------------------------------------------------------------
        */

        const response =
            await drive.files.get({
                fileId:
                    photo.drive_file_id,

                alt: "media",
            }, {
                responseType: "arraybuffer",
            });

        const body =
            Buffer.from(
                response.data as ArrayBuffer
            );

        /*
        |--------------------------------------------------------------------------
        | 8. Return image
        |--------------------------------------------------------------------------
        */

        return new NextResponse(
            body,
            {
                status: 200,

                headers: {
                    "Content-Type":
                        photo.mime_type ??
                        "image/jpeg",

                    "Content-Length":
                        body.length.toString(),

                    "Cache-Control":
                        "private, max-age=3600",

                    "Content-Disposition":
                        `inline; filename="${encodeURIComponent(
                            photo.file_name
                        )}"`,
                },
            }
        );

    } catch (error) {
        console.error(
            "PUBLIC PHOTO ERROR:",
            error
        );

        return new NextResponse(
            "Failed to load image",
            {
                status: 500,
            }
        );
    }
}