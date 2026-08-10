"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
    albumId: string;
}

export default function SyncDriveButton({
    albumId,
}: Props) {
    const router = useRouter();

    const [loading, setLoading] =
        useState(false);

    async function handleSync() {
        setLoading(true);

        try {
            const response =
                await fetch(
                    `/api/albums/${albumId}/sync-drive`,
                    {
                        method: "POST",
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error ??
                    "Sync gagal."
                );
            }

            alert(
                `Berhasil sinkronisasi ${data.total} foto.`
            );

            router.refresh();

        } catch (error) {
            alert(
                error instanceof Error
                    ? error.message
                    : "Sync gagal."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            onClick={handleSync}
            disabled={loading}
            className="rounded-lg bg-black px-5 py-3 text-sm text-white disabled:opacity-50"
        >
            {loading
                ? "Syncing Photos..."
                : "Sync Photos from Google Drive"}
        </button>
    );
}