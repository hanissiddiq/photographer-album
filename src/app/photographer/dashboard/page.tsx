import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import AlbumStatusBadge from "@/components/photographer/AlbumStatusBadge";


export default async function PhotographerDashboard() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    if (!profile || profile.role !== "photographer") {
        redirect("/login");
    }

    const { data: albums } = await supabase
        .from("albums")
        .select("*")
        .eq("photographer_id", user.id)
        .order("created_at", {
            ascending: false,
        });

    const totalAlbums = albums?.length ?? 0;

    const activeAlbums =
        albums?.filter(
            (album) => album.is_active
        ).length ?? 0;

    const editingAlbums =
        albums?.filter(
            (album) => album.status === "editing"
        ).length ?? 0;

    const printingAlbums =
        albums?.filter(
            (album) => album.status === "printing"
        ).length ?? 0;

    const doneAlbums =
        albums?.filter(
            (album) => album.status === "done"
        ).length ?? 0;

    return (
        <main className="min-h-screen bg-gray-50">

            <div className="mx-auto max-w-7xl p-8">

                <div className="mb-8 flex items-center justify-between">

                    <div>
                        <h1 className="text-3xl font-bold">
                            Dashboard
                        </h1>

                        <p className="mt-2 text-gray-500">
                            Selamat datang,{" "}
                            {profile.full_name}
                        </p>
                    </div>

                    <Link
                        href="/photographer/albums/create"
                        className="rounded-lg bg-black px-5 py-3 text-sm font-medium text-white"
                    >
                        + Create Album
                    </Link>

                </div>

                {/* STATISTICS */}

                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-5">

                    <StatCard
                        label="Total Album"
                        value={totalAlbums}
                    />

                    <StatCard
                        label="Active"
                        value={activeAlbums}
                    />

                    <StatCard
                        label="Editing"
                        value={editingAlbums}
                    />

                    <StatCard
                        label="Printing"
                        value={printingAlbums}
                    />

                    <StatCard
                        label="Done"
                        value={doneAlbums}
                    />

                </div>

                {/* RECENT ALBUMS */}

                <div className="mt-10">

                    <div className="mb-5 flex items-center justify-between">

                        <h2 className="text-xl font-semibold">
                            Recent Albums
                        </h2>

                        <Link
                            href="/photographer/albums"
                            className="text-sm font-medium"
                        >
                            View All
                        </Link>

                    </div>

                    <div className="overflow-hidden rounded-xl border bg-white">

                        {albums?.slice(0, 5).map(
                            (album) => (
                                <div
                                    key={album.id}
                                    className="flex items-center justify-between border-b p-5 last:border-b-0"
                                >

                                    <div>
                                        <Link
                                            href={`/photographer/albums/${album.id}`}
                                            className="font-medium hover:underline"
                                        >
                                            {album.title}
                                        </Link>

                                        <p className="mt-1 text-sm text-gray-500">
                                            Quota{" "}
                                            {album.quota} foto
                                        </p>
                                    </div>

                                    <AlbumStatusBadge
                                        status={album.status}
                                    />

                                </div>
                            )
                        )}

                        {albums?.length === 0 && (
                            <div className="p-10 text-center">

                                <p className="text-gray-500">
                                    Belum ada album.
                                </p>

                                <Link
                                    href="/photographer/albums/create"
                                    className="mt-4 inline-block rounded-lg bg-black px-5 py-3 text-sm text-white"
                                >
                                    Buat Album
                                </Link>

                            </div>
                        )}

                    </div>

                </div>

            </div>

        </main>
    );
}

function StatCard({
    label,
    value,
}: {
    label: string;
    value: number;
}) {
    return (
        <div className="rounded-xl border bg-white p-5">

            <p className="text-sm text-gray-500">
                {label}
            </p>

            <p className="mt-2 text-3xl font-bold">
                {value}
            </p>

        </div>
    );
}