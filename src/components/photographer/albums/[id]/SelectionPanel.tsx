"use client";

import Image from "next/image";

interface SelectedPhoto {
    id: string;

    album_photo_id: string;

    selected_at: string;

    album_photos: {
        id: string;
        file_name: string;
        file_url?: string | null;
        thumbnail_url?: string | null;
        position?: number | null;
    };
}

interface Props {
    photos: SelectedPhoto[];

    quota: number;
}

export default function SelectionPanel({
    photos,
    quota,
}: Props) {
    return (
        <section className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">

            <div className="mb-6 flex items-center justify-between">

                <div>
                    <h2 className="text-xl font-bold text-gray-900">
                        Foto Pilihan Client
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Foto yang dipilih client
                        untuk diproses.
                    </p>
                </div>

                <div className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                    {photos.length} / {quota}
                </div>

            </div>

            {photos.length === 0 ? (
                <div className="rounded-xl border border-dashed p-10 text-center">

                    <p className="font-medium text-gray-700">
                        Belum ada foto yang
                        dipilih client.
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                        Foto akan muncul di sini
                        setelah client melakukan
                        final submission.
                    </p>

                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">

                    {photos.map(
                        (
                            photo,
                            index
                        ) => {
                            const image =
                                photo.album_photos;

                            return (
                                <div
                                    key={
                                        photo.id
                                    }
                                    className="group overflow-hidden rounded-xl border bg-gray-50"
                                >

                                    <div className="relative aspect-square">

                                        {image.thumbnail_url ||
                                        image.file_url ? (
                                            <Image
                                                src={
                                                    image.thumbnail_url ||
                                                    image.file_url ||
                                                    ""
                                                }
                                                alt={
                                                    image.file_name
                                                }
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 768px) 50vw, 20vw"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-sm text-gray-400">
                                                No Preview
                                            </div>
                                        )}

                                        <div className="absolute left-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white shadow">
                                            {index +
                                                1}
                                        </div>

                                    </div>

                                    <div className="p-3">

                                        <p
                                            className="truncate text-xs font-medium text-gray-900"
                                            title={
                                                image.file_name
                                            }
                                        >
                                            {
                                                image.file_name
                                            }
                                        </p>

                                    </div>

                                </div>
                            );
                        }
                    )}

                </div>
            )}

        </section>
    );
}