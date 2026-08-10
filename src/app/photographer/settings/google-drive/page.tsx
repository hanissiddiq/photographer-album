import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function GoogleDriveSettingsPage() {
    const supabase =
        await createClient();

    const {
        data: { user },
    } =
        await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
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
        redirect("/login");
    }

    const admin =
        createAdminClient();

    const { data: connection } =
        await admin
            .from(
                "google_drive_connections"
            )
            .select(
                "google_email, created_at, updated_at"
            )
            .eq(
                "photographer_id",
                user.id
            )
            .single();

    return (
        <main className="min-h-screen bg-gray-50 p-8">

            <div className="mx-auto max-w-3xl">

                <h1 className="text-3xl font-bold">
                    Google Drive
                </h1>

                <p className="mt-2 text-gray-500">
                    Hubungkan Google Drive
                    untuk mengambil foto album.
                </p>

                <div className="mt-8 rounded-xl border bg-white p-6">

                    {connection ? (
                        <>

                            <div className="rounded-lg bg-green-50 p-4">

                                <p className="font-medium text-green-700">
                                    Google Drive Connected
                                </p>

                                <p className="mt-1 text-sm text-green-600">
                                    {connection.google_email}
                                </p>

                            </div>

                            <div className="mt-6">

                                <Link
                                    href="/api/google-drive/connect"
                                    className="rounded-lg border px-5 py-3 text-sm"
                                >
                                    Reconnect Google Drive
                                </Link>

                            </div>

                        </>
                    ) : (

                        <div>

                            <p className="mb-5 text-sm text-gray-600">
                                Hubungkan akun Google
                                yang digunakan untuk
                                menyimpan foto.
                            </p>

                            <Link
                                href="/api/google-drive/connect"
                                className="inline-flex rounded-lg bg-black px-5 py-3 text-sm text-white"
                            >
                                Connect Google Drive
                            </Link>

                        </div>

                    )}

                </div>

            </div>

        </main>
    );
}