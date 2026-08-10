import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import AlbumCard from "@/components/photographer/AlbumCard";
import DeleteAlbumButton
    from "@/components/photographer/DeleteAlbumButton";

export default async function AlbumsPage() {
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

    const { data: albums, error } = await supabase
        .from("albums")
        .select("*")
        .eq("photographer_id", user.id)
        .order("created_at", {
            ascending: false,
        });

    if (error) {
        throw new Error(error.message);
    }

    return (
        <main className="min-h-screen bg-gray-50 p-8">

            <div className="mx-auto max-w-7xl">

                <div className="mb-8 flex items-center justify-between">

                    <div>
                        <h1 className="text-3xl font-bold">
                            Albums
                        </h1>

                        <p className="mt-2 text-gray-500">
                            Kelola album foto client.
                        </p>
                    </div>

                    <Link
                        href="/photographer/albums/create"
                        className="rounded-lg bg-black px-5 py-3 text-sm font-medium text-white"
                    >
                        + Create Album
                    </Link>

                </div>

                {albums?.length === 0 ? (

                    <div className="rounded-xl border bg-white p-12 text-center">

                        <h2 className="text-lg font-semibold">
                            Belum ada album
                        </h2>

                        <p className="mt-2 text-gray-500">
                            Buat album pertama Anda.
                        </p>

                        <Link
                            href="/photographer/albums/create"
                            className="mt-5 inline-block rounded-lg bg-black px-5 py-3 text-sm text-white"
                        >
                            Buat Album
                        </Link>

                    </div>

                ) : (

                    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

                        {albums?.map((album) => (
                            <AlbumCard
                                key={album.id}
                                album={album}
                                />
                            ))}
                            {/* <DeleteAlbumButton albumId={album.id} /> */}

                    </div>


                )}

            </div>

        </main>
    );
}