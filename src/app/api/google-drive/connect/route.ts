import { NextResponse } from "next/server";
import crypto from "crypto";

import { createClient } from "@/lib/supabase/server";
import { createGoogleOAuthClient } from "@/lib/google-drive/client";
import { GOOGLE_DRIVE_SCOPES } from "@/lib/google-drive/config";

export async function GET() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.redirect(
            new URL("/login", process.env.NEXT_PUBLIC_SITE_URL)
        );
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role !== "photographer") {
        return NextResponse.json(
            {
                error: "Unauthorized",
            },
            {
                status: 403,
            }
        );
    }

    const oauthClient =
        createGoogleOAuthClient();

    const state = crypto.randomBytes(32).toString("hex");

    const authUrl =
        oauthClient.generateAuthUrl({
            access_type: "offline",

            prompt: "consent",

            scope: GOOGLE_DRIVE_SCOPES,

            include_granted_scopes: true,

            state,
        });

    const response = NextResponse.redirect(
        authUrl
    );

    response.cookies.set(
        "google_drive_oauth_state",
        state,
        {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 600,
            path: "/",
        }
    );

    return response;
}