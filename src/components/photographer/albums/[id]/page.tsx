import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import AlbumStatusBadge from "@/components/photographer/AlbumStatusBadge";
import GeneratePublicLinkButton
    from "@/components/photographer/GeneratePublicLinkButton";

import SyncDriveButton
    from "@/components/photographer/SyncDriveButton";

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default async function AlbumDetailPage({
    params,
}: Props) {
    const { id } = await params;

    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: album } = await supabase
        .from("albums")
        .select("*")
        .eq("id", id)
        .eq("photographer_id", user.id)
        .single();

    if (!album) {
        notFound();
    }

    const { count: photoCount } =
    await supabase
        .from("album_photos")
        .select("*", {
            count: "exact",
            head: true,
        })
        .eq(
            "album_id",
            album.id
        );

    const albumUrl =
        `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/album/${album.slug}`;

    return (
        <main className="min-h-screen bg-gray-50 p-8">

            <div className="mx-auto max-w-4xl">

                <div className="mb-8 flex items-center justify-between">

                    <div>
                        <h1 className="text-3xl font-bold">
                            {album.title}
                        </h1>

                        <p className="mt-2 text-gray-500">
                            Album Detail
                        </p>
                    </div>

                    <Link
                        href={`/photographer/albums/${album.id}/edit`}
                        className="rounded-lg border bg-white px-4 py-2 text-sm"
                    >
                        Edit
                    </Link>

                </div>

                <div className="space-y-6">

                    <section className="rounded-xl border bg-white p-6">

                        <div className="flex items-center justify-between">

                            <h2 className="font-semibold">
                                Status
                            </h2>

                            <AlbumStatusBadge
                                status={album.status}
                            />

                        </div>

                    </section>

                    <section className="rounded-xl border bg-white p-6">

                        <h2 className="mb-5 text-lg font-semibold">
                            Album Information
                        </h2>

                        <div className="grid gap-5 md:grid-cols-2">

                            <div>
                                <p className="text-sm text-gray-500">
                                    Album
                                </p>

                                <p className="font-medium">
                                    {album.title}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Quota
                                </p>

                                <p className="font-medium">
                                    {album.quota} foto
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    WhatsApp
                                </p>

                                <p className="font-medium">
                                    {album.whatsapp_number || "-"}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Active
                                </p>

                                <p className="font-medium">
                                    {album.is_active
                                        ? "Yes"
                                        : "No"}
                                </p>
                            </div>

                        </div>

                    </section>


                    <section className="rounded-xl border bg-white p-6">

                        <h2 className="mb-5 text-lg font-semibold">
                            Google Drive
                        </h2>

                        <div className="space-y-4">

                            <div>
                                <p className="text-sm text-gray-500">
                                    Folder
                                </p>

                                <p className="font-medium">
                                    {album.drive_folder_name || "-"}
                                </p>

                                <p className="text-sm text-gray-500">
                                    Photos
                                </p>

                                <p className="font-medium">{photoCount ?? 0} foto</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Last Sync
                                </p>

                                <p className="font-medium">
                                    {album.photos_synced_at
                                        ? new Date(
                                            album.photos_synced_at
                                        ).toLocaleString("id-ID")
                                        : "Belum pernah sync"}
                                </p>
                            </div>

                            <SyncDriveButton
                                albumId={album.id}
                            />

                        </div>

                    </section>

                    <section className="rounded-xl border bg-white p-6">

                        <h2 className="mb-4 text-lg font-semibold">
                            Client Album Link
                        </h2>

                        <div className="rounded-lg bg-gray-50 p-4">

                            <p className="break-all text-sm">
                                {albumUrl}
                            </p>

                        </div>

                        <div className="mt-4 flex gap-3">

                            <Link
                                href={`/album/${album.slug}`}
                                target="_blank"
                                className="rounded-lg bg-black px-4 py-2 text-sm text-white"
                            >
                                Open Album
                            </Link>

                        </div>

                    </section>

                    <section className="rounded-xl border bg-white p-6">

                        <h2 className="mb-2 text-lg font-semibold">
                            Public Album
                        </h2>

                        <p className="mb-5 text-sm text-gray-500">
                            Buat link yang dapat dibagikan
                            kepada client untuk melihat album.
                        </p>

                        <GeneratePublicLinkButton
                            albumId={album.id}
                        />

                    </section>

                </div>

            </div>

        </main>
    );
}