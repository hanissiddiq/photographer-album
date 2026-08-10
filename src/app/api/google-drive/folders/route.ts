import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import {
    getGoogleDriveForPhotographer,
} from "@/lib/google-drive/service";

export async function GET() {
    try {
        const supabase =
            await createClient();

        const {
            data: { user },
        } =
            await supabase.auth.getUser();

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

        const { data: profile } =
            await supabase
                .from("profiles")
                .select("role")
                .eq("id", user.id)
                .single();

        if (
            profile?.role !==
            "photographer"
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

        const drive =
            await getGoogleDriveForPhotographer(
                user.id
            );

        const result =
            await drive.files.list({
                q: [
                    "mimeType = 'application/vnd.google-apps.folder'",
                    "trashed = false",
                ].join(" and "),

                fields:
                    "files(id,name,mimeType,modifiedTime,webViewLink)",

                orderBy: "name",

                pageSize: 100,
            });

        return NextResponse.json({
            folders:
                result.data.files ?? [],
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                error:
                    "Gagal membaca Google Drive.",
            },
            {
                status: 500,
            }
        );
    }
}