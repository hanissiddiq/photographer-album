import { NextRequest } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";
import {
    getGoogleDriveForPhotographer,
} from "@/lib/google-drive/service";

interface Params {
    params: Promise<{
        id: string;
    }>;
}

export async function GET(
    request: NextRequest,
    { params }: Params
) {
    try {
        const { id } = await params;

        const admin =
            createAdminClient();

        const { data: photo, error } =
            await admin
                .from("album_photos")
                .select(`
                    id,
                    drive_file_id,
                    file_name,
                    mime_type,
                    album_id,
                    albums (
                        photographer_id,
                        is_active,
                        expires_at
                    )
                `)
                .eq("id", id)
                .single();

        if (error || !photo) {
            return new Response(
                "Photo not found",
                {
                    status: 404,
                }
            );
        }

        const album =
            Array.isArray(photo.albums)
                ? photo.albums[0]
                : photo.albums;

        if (!album) {
            return new Response(
                "Album not found",
                {
                    status: 404,
                }
            );
        }

        if (!album.is_active) {
            return new Response(
                "Album inactive",
                {
                    status: 403,
                }
            );
        }

        if (
            album.expires_at &&
            new Date(
                album.expires_at
            ) < new Date()
        ) {
            return new Response(
                "Album expired",
                {
                    status: 403,
                }
            );
        }

        const drive =
            await getGoogleDriveForPhotographer(
                album.photographer_id
            );

        const result =
            await drive.files.get(
                {
                    fileId:
                        photo.drive_file_id,

                    alt: "media",
                },
                {
                    responseType: "arraybuffer",
                }
            );

        const contentType =
            photo.mime_type ??
            "application/octet-stream";

        return new Response(
            result.data as ArrayBuffer,
            {
                headers: {
                    "Content-Type":
                        contentType,

                    "Cache-Control":
                        "public, max-age=3600",
                },
            }
        );

    } catch (error) {
        console.error(error);

        return new Response(
            "Failed to load photo",
            {
                status: 500,
            }
        );
    }
}