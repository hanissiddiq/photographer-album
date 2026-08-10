import { notFound } from "next/navigation";

import { createAdminClient } from "@/lib/supabase/admin";
import { getPublicAlbumByToken } from "@/lib/security/public-album";

interface Props {
    params: Promise<{
        token: string;
    }>;
}

export default async function PublicAlbumPage({
    params,
}: Props) {
    const { token } = await params;

    if (!token) {
        notFound();
    }

    const album = await getPublicAlbumByToken(token);

    const admin = createAdminClient();

    const {
        data: photos,
        error: photosError,
    } = await admin
        .from("album_photos")
        .select(`
            id,
            file_name,
            mime_type,
            file_size,
            sort_order
        `)
        .eq("album_id", album.id)
        .order("sort_order", {
            ascending: true,
        });

    if (photosError) {
        console.error(
            "PUBLIC ALBUM PHOTOS ERROR:",
            photosError
        );

        notFound();
    }

    const publicPhotos = (photos ?? []).map(
        (photo) => ({
            id: photo.id,

            file_name: photo.file_name,

            mime_type: photo.mime_type,

            file_size: photo.file_size,

            sort_order: photo.sort_order,

            image_url:
                `/api/public/albums/${token}/photos/${photo.id}`,
        })
    );

    return (
        <main className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-7xl px-6 py-10">

                {/* HEADER */}
                <header>
                    <h1 className="text-3xl font-bold text-gray-900">
                        {album.title}
                    </h1>

                    {album.description && (
                        <p className="mt-2 text-gray-600">
                            {album.description}
                        </p>
                    )}
                </header>

                {/* ALBUM INFO */}
                <div className="mt-6 rounded-xl border bg-white p-5">

                    <div className="flex flex-wrap gap-8">

                        <div>
                            <p className="text-sm text-gray-500">
                                Kuota pilihan
                            </p>

                            <p className="mt-1 text-2xl font-bold">
                                {album.quota} foto
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Total foto
                            </p>

                            <p className="mt-1 text-2xl font-bold">
                                {publicPhotos.length}
                            </p>
                        </div>

                    </div>

                </div>

                {/* GALLERY */}
                <section className="mt-8">

                    {publicPhotos.length === 0 ? (
                        <div className="rounded-xl border bg-white p-10 text-center">
                            <p className="text-gray-500">
                                Belum ada foto dalam album.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">

                            {publicPhotos.map(
                                (photo) => (
                                    <div
                                        key={photo.id}
                                        className="overflow-hidden rounded-xl border bg-white"
                                    >
                                        <img
                                            src={
                                                photo.image_url
                                            }
                                            alt={
                                                photo.file_name
                                            }
                                            loading="lazy"
                                            className="aspect-square w-full object-cover"
                                        />
                                    </div>
                                )
                            )}

                        </div>
                    )}

                </section>

            </div>
        </main>
    );
}