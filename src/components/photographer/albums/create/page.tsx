import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AlbumForm from "@/components/photographer/AlbumForm";

export default async function CreateAlbumPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role !== "photographer") {
        redirect("/login");
    }

    return (
        <main className="min-h-screen bg-gray-50 p-8">

            <div className="mx-auto max-w-3xl">

                <div className="mb-8">
                    <h1 className="text-3xl font-bold">
                        Create Album
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Buat album baru untuk client.
                    </p>
                </div>

                <div className="rounded-xl bg-white p-8 shadow-sm">

                    <AlbumForm />

                </div>

            </div>

        </main>
    );
}