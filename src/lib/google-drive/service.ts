import { google } from "googleapis";

import { createAdminClient } from "@/lib/supabase/admin";
import { decrypt } from "@/lib/security/encryption";
import { createGoogleOAuthClient } from "./client";

export async function getGoogleDriveForPhotographer(
    photographerId: string
) {
    const admin =
        createAdminClient();

    const { data: connection, error } =
        await admin
            .from("google_drive_connections")
            .select("*")
            .eq(
                "photographer_id",
                photographerId
            )
            .single();

    if (error || !connection) {
        throw new Error(
            "Google Drive belum terhubung."
        );
    }

    const refreshToken =
        decrypt(
            connection.refresh_token_encrypted
        );

    const oauthClient =
        createGoogleOAuthClient();

    oauthClient.setCredentials({
        refresh_token: refreshToken,
    });

    return google.drive({
        version: "v3",
        auth: oauthClient,
    });
}