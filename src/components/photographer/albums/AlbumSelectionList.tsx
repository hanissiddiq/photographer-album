"use client";

import {
    useState,
} from "react";

interface Photo {
    id: string;
    file_name: string;
    image_url?: string;
    sort_order?: number;
    selected_at?: string;
}

interface Props {
    albumId: string;
    albumTitle: string;
    quota: number;
    status: string;
    selectedCount: number;
    submittedAt: string | null;
    photos: Photo[];
}

export default function AlbumSelectionList({
    albumId,
    albumTitle,
    quota,
    status,
    selectedCount,
    submittedAt,
    photos,
}: Props) {
    const [
        copied,
        setCopied,
    ] = useState(false);

    const fileNames =
        photos
            .map(
                (photo) =>
                    photo.file_name
            )
            .join("\n");

    async function copyFileNames() {
        await navigator.clipboard.writeText(
            fileNames
        );

        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 2000);
    }

    return (
        <div className="space-y-6">

            {/* Header */}

            <div className="rounded-xl border bg-white p-6 shadow-sm">

                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                    <div>

                        <p className="text-sm text-gray-500">
                            Pilihan Client
                        </p>

                        <h2 className="mt-1 text-xl font-bold">
                            {albumTitle}
                        </h2>

                    </div>

                    <div
                        className={`inline-flex w-fit rounded-full px-4 py-2 text-sm font-semibold ${
                            status ===
                            "submitted"
                                ? "bg-green-100 text-green-700"
                                : status ===
                                  "editing"
                                ? "bg-blue-100 text-blue-700"
                                : status ===
                                  "printing"
                                ? "bg-yellow-100 text-yellow-700"
                                : status ===
                                  "done"
                                ? "bg-gray-900 text-white"
                                : "bg-gray-100 text-gray-600"
                        }`}
                    >
                        {status ===
                        "submitted"
                            ? "Foto Sudah Dipilih"
                            : status ===
                              "editing"
                            ? "Progress Editing"
                            : status ===
                              "printing"
                            ? "Proses Cetak"
                            : status ===
                              "done"
                            ? "DONE"
                            : "Menunggu Pilihan"}
                    </div>

                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">

                    <div className="rounded-lg bg-gray-50 p-4">

                        <p className="text-sm text-gray-500">
                            Kuota
                        </p>

                        <p className="mt-1 text-2xl font-bold">
                            {quota}
                        </p>

                    </div>

                    <div className="rounded-lg bg-gray-50 p-4">

                        <p className="text-sm text-gray-500">
                            Foto Dipilih
                        </p>

                        <p className="mt-1 text-2xl font-bold">
                            {selectedCount}
                        </p>

                    </div>

                    <div className="rounded-lg bg-gray-50 p-4">

                        <p className="text-sm text-gray-500">
                            Submit
                        </p>

                        <p className="mt-1 text-sm font-semibold">
                            {submittedAt
                                ? new Date(
                                      submittedAt
                                  ).toLocaleString(
                                      "id-ID"
                                  )
                                : "-"}
                        </p>

                    </div>

                </div>

            </div>

            {/* Actions */}

            {photos.length >
                0 && (
                <div className="flex flex-wrap gap-3">

                    <button
                        type="button"
                        onClick={
                            copyFileNames
                        }
                        className="rounded-lg border bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-50"
                    >
                        {copied
                            ? "✓ Berhasil Disalin"
                            : "Salin Nama File"}
                    </button>

                </div>
            )}

            {/* File list */}

            <div className="rounded-xl border bg-white shadow-sm">

                <div className="border-b p-5">

                    <h3 className="font-semibold">
                        Daftar Foto Terpilih
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                        {photos.length} foto
                    </p>

                </div>

                {photos.length ===
                0 ? (
                    <div className="p-10 text-center">

                        <p className="text-gray-500">
                            Client belum memilih
                            foto.
                        </p>

                    </div>
                ) : (
                    <div className="divide-y">

                        {photos.map(
                            (
                                photo,
                                index
                            ) => (
                                <div
                                    key={
                                        photo.id
                                    }
                                    className="flex items-center gap-4 p-4"
                                >

                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold">
                                        {index +
                                            1}
                                    </div>

                                    <div className="min-w-0 flex-1">

                                        <p className="truncate font-medium">
                                            {
                                                photo.file_name
                                            }
                                        </p>

                                        {photo.selected_at && (
                                            <p className="mt-1 text-xs text-gray-400">
                                                Dipilih{" "}
                                                {new Date(
                                                    photo.selected_at
                                                ).toLocaleString(
                                                    "id-ID"
                                                )}
                                            </p>
                                        )}

                                    </div>

                                </div>
                            )
                        )}

                    </div>
                )}

            </div>

        </div>
    );
}