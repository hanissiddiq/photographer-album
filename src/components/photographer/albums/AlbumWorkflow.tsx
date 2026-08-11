"use client";

import {
    useState,
} from "react";

type SelectionStatus =
    | "draft"
    | "submitted"
    | "editing"
    | "printing"
    | "done";

interface Props {
    albumId: string;

    initialStatus: SelectionStatus;
}

const statuses: {
    key: SelectionStatus;
    label: string;
    description: string;
}[] = [
    {
        key: "submitted",
        label: "Foto Sudah Dipilih",
        description:
            "Client telah mengirim pilihan foto.",
    },
    {
        key: "editing",
        label: "Progress Editing",
        description:
            "Foto sedang dalam proses editing.",
    },
    {
        key: "printing",
        label: "Proses Cetak",
        description:
            "Foto sedang dalam proses cetak.",
    },
    {
        key: "done",
        label: "DONE",
        description:
            "Pesanan telah selesai.",
    },
];

export default function AlbumWorkflow({
    albumId,
    initialStatus,
}: Props) {
    const [
        status,
        setStatus,
    ] = useState<SelectionStatus>(
        initialStatus
    );

    const [
        loading,
        setLoading,
    ] = useState(false);

    const [
        error,
        setError,
    ] = useState("");

    async function updateStatus(
        nextStatus: SelectionStatus
    ) {
        setLoading(true);
        setError("");

        try {
            const response =
                await fetch(
                    `/api/photographer/albums/${albumId}/status`,
                    {
                        method: "PATCH",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body: JSON.stringify({
                            status:
                                nextStatus,
                        }),
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error ??
                        "Gagal mengubah status."
                );
            }

            setStatus(
                nextStatus
            );

        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Gagal mengubah status."
            );
        } finally {
            setLoading(false);
        }
    }

    const currentIndex =
        statuses.findIndex(
            (item) =>
                item.key ===
                status
        );

    const nextStatus =
        statuses[
            currentIndex + 1
        ];

    return (
        <section className="rounded-2xl border bg-white p-6 shadow-sm">

            <div className="mb-6">

                <h2 className="text-xl font-bold text-gray-900">
                    Status Pesanan
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    Kelola progress pengerjaan
                    album ini.
                </p>

            </div>

            <div className="relative">

                <div className="absolute left-4 right-4 top-4 h-1 bg-gray-200" />

                <div
                    className="absolute left-4 top-4 h-1 bg-green-600 transition-all"
                    style={{
                        width:
                            currentIndex <=
                            0
                                ? "0%"
                                : `${Math.min(
                                      100,
                                      (currentIndex /
                                          (statuses.length -
                                              1)) *
                                          100
                                  )}%`,
                    }}
                />

                <div className="relative grid grid-cols-4 gap-2">

                    {statuses.map(
                        (
                            item,
                            index
                        ) => {

                            const completed =
                                index <=
                                currentIndex;

                            const active =
                                item.key ===
                                status;

                            return (
                                <div
                                    key={
                                        item.key
                                    }
                                    className="flex flex-col items-center text-center"
                                >

                                    <div
                                        className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-bold ${
                                            completed
                                                ? "border-green-600 bg-green-600 text-white"
                                                : "border-gray-300 bg-white text-gray-400"
                                        }`}
                                    >
                                        {completed
                                            ? "✓"
                                            : index +
                                              1}
                                    </div>

                                    <p
                                        className={`mt-3 text-xs font-semibold ${
                                            active
                                                ? "text-green-700"
                                                : "text-gray-500"
                                        }`}
                                    >
                                        {
                                            item.label
                                        }
                                    </p>

                                </div>
                            );
                        }
                    )}

                </div>

            </div>

            <div className="mt-8 rounded-xl bg-gray-50 p-4">

                <p className="font-semibold text-gray-900">
                    {
                        statuses.find(
                            (item) =>
                                item.key ===
                                status
                        )?.label
                    }
                </p>

                <p className="mt-1 text-sm text-gray-500">
                    {
                        statuses.find(
                            (item) =>
                                item.key ===
                                status
                        )?.description
                    }
                </p>

            </div>

            {nextStatus && (
                <div className="mt-5">

                    <button
                        type="button"
                        onClick={() =>
                            updateStatus(
                                nextStatus.key
                            )
                        }
                        disabled={
                            loading
                        }
                        className="rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading
                            ? "Menyimpan..."
                            : `Lanjut ke ${nextStatus.label}`}
                    </button>

                </div>
            )}

            {error && (
                <p className="mt-4 text-sm text-red-600">
                    {error}
                </p>
            )}

        </section>
    );
}