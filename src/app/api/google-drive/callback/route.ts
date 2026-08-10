import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

import { createGoogleOAuthClient } from "@/lib/google-drive/client";
import { encrypt } from "@/lib/security/encryption";

export async function GET(request: NextRequest) {
    try {
        console.log("[Google OAuth] Callback started");

        // =====================================================
        // 1. CEK USER SUPABASE
        // =====================================================

        const supabase = await createClient();

        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        console.log("[Google OAuth] Supabase user:", {
            id: user?.id,
            email: user?.email,
            error: userError,
        });

        if (userError || !user) {
            console.error(
                "[Google OAuth] User tidak ditemukan:",
                userError
            );

            return NextResponse.redirect(
                new URL(
                    "/login?error=unauthorized",
                    process.env.NEXT_PUBLIC_SITE_URL
                )
            );
        }

        // =====================================================
        // 2. AMBIL PARAMETER GOOGLE
        // =====================================================

        const searchParams =
            request.nextUrl.searchParams;

        const code =
            searchParams.get("code");

        const state =
            searchParams.get("state");

        const oauthError =
            searchParams.get("error");

        console.log("[Google OAuth] Parameters:", {
            hasCode: !!code,
            hasState: !!state,
            oauthError,
        });

        if (oauthError) {
            console.error(
                "[Google OAuth] Google returned error:",
                oauthError
            );

            return NextResponse.redirect(
                new URL(
                    `/photographer/settings/google-drive?error=${encodeURIComponent(
                        oauthError
                    )}`,
                    process.env.NEXT_PUBLIC_SITE_URL
                )
            );
        }

        // =====================================================
        // 3. VALIDASI STATE
        // =====================================================

        const savedState =
            request.cookies.get(
                "google_drive_oauth_state"
            )?.value;

        console.log("[Google OAuth] State validation:", {
            received: !!state,
            saved: !!savedState,
            matched:
                state === savedState,
        });

        if (
            !code ||
            !state ||
            !savedState ||
            state !== savedState
        ) {
            console.error(
                "[Google OAuth] Invalid OAuth state"
            );

            return NextResponse.redirect(
                new URL(
                    "/photographer/settings/google-drive?error=invalid_state",
                    process.env.NEXT_PUBLIC_SITE_URL
                )
            );
        }

        // =====================================================
        // 4. CREATE GOOGLE OAUTH CLIENT
        // =====================================================

        const oauthClient =
            createGoogleOAuthClient();

        // =====================================================
        // 5. EXCHANGE CODE → TOKEN
        // =====================================================

        console.log(
            "[Google OAuth] Exchanging authorization code..."
        );

        const { tokens } =
            await oauthClient.getToken(code);

        console.log("[Google OAuth] Token result:", {
            hasAccessToken:
                !!tokens.access_token,

            hasRefreshToken:
                !!tokens.refresh_token,

            scope:
                tokens.scope,

            tokenType:
                tokens.token_type,

            expiryDate:
                tokens.expiry_date,
        });

        // =====================================================
        // 6. REFRESH TOKEN WAJIB
        // =====================================================

        if (!tokens.refresh_token) {
            console.error(
                "[Google OAuth] Refresh token tidak tersedia"
            );

            return NextResponse.redirect(
                new URL(
                    "/photographer/settings/google-drive?error=no_refresh_token",
                    process.env.NEXT_PUBLIC_SITE_URL
                )
            );
        }

        // =====================================================
        // 7. ENCRYPT REFRESH TOKEN
        // =====================================================

        const encryptedRefreshToken =
            encrypt(
                tokens.refresh_token
            );

        // =====================================================
        // 8. SIMPAN KE SUPABASE
        // =====================================================

        const admin =
            createAdminClient();

        console.log(
            "[Google OAuth] Saving Google Drive connection..."
        );

        const {
            data: connection,
            error: saveError,
        } = await admin
            .from(
                "google_drive_connections"
            )
            .upsert(
                {
                    photographer_id:
                        user.id,

                    // Email Google tidak wajib
                    // untuk koneksi Drive.
                    google_email:
                        null,

                    refresh_token_encrypted:
                        encryptedRefreshToken,

                    scope:
                        tokens.scope ??
                        "https://www.googleapis.com/auth/drive.readonly",

                    updated_at:
                        new Date().toISOString(),
                },
                {
                    onConflict:
                        "photographer_id",
                }
            )
            .select()
            .single();

        if (saveError) {
            console.error(
                "[Google OAuth] Supabase error:",
                saveError
            );

            return NextResponse.redirect(
                new URL(
                    "/photographer/settings/google-drive?error=database",
                    process.env.NEXT_PUBLIC_SITE_URL
                )
            );
        }

        console.log(
            "[Google OAuth] Connection saved:",
            {
                id:
                    connection?.id,

                photographer_id:
                    connection?.photographer_id,

                scope:
                    connection?.scope,
            }
        );

        // =====================================================
        // 9. REDIRECT SUCCESS
        // =====================================================

        const response =
            NextResponse.redirect(
                new URL(
                    "/photographer/settings/google-drive?connected=1",
                    process.env.NEXT_PUBLIC_SITE_URL
                )
            );

        // Hapus OAuth state cookie
        response.cookies.delete(
            "google_drive_oauth_state"
        );

        return response;

    } catch (error) {
        console.error(
            "[Google OAuth] Fatal error:",
            error
        );

        return NextResponse.redirect(
            new URL(
                "/photographer/settings/google-drive?error=oauth_failed",
                process.env.NEXT_PUBLIC_SITE_URL
            )
        );
    }
}