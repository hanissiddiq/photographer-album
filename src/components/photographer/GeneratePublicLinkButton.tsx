"use client";

import { useState } from "react";

interface Props {
    albumId: string;
}

export default function GeneratePublicLinkButton({
    albumId,
}: Props) {
    const [loading, setLoading] =
        useState(false);

    const [url, setUrl] =
        useState("");

    const [error, setError] =
        useState("");

    async function generateLink() {
        setLoading(true);
        setError("");
        setUrl("");

        try {
            const response =
                await fetch(
                    `/api/albums/${albumId}/public-link`,
                    {
                        method: "POST",
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error ??
                    "Gagal membuat public link."
                );
            }

            setUrl(data.url);

        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Gagal membuat public link."
            );
        } finally {
            setLoading(false);
        }
    }

    async function copyLink() {
        if (!url) {
            return;
        }

        await navigator.clipboard.writeText(
            url
        );

        alert(
            "Link album berhasil disalin."
        );
    }

    return (
        <div className="space-y-4">

            <button
                type="button"
                onClick={generateLink}
                disabled={loading}
                className="rounded-lg bg-black px-5 py-3 text-sm font-medium text-white disabled:opacity-50"
            >
                {loading
                    ? "Generating..."
                    : "Generate Public Album Link"}
            </button>

            {url && (
                <div className="rounded-lg border bg-gray-50 p-4">

                    <p className="mb-2 text-sm font-medium">
                        Public Album Link
                    </p>

                    <div className="flex gap-2">

                        <input
                            type="text"
                            value={url}
                            readOnly
                            className="min-w-0 flex-1 rounded-lg border bg-white px-3 py-2 text-sm"
                        />

                        <button
                            type="button"
                            onClick={copyLink}
                            className="rounded-lg border bg-white px-4 py-2 text-sm font-medium"
                        >
                            Copy
                        </button>

                    </div>

                </div>
            )}

            {error && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                    {error}
                </div>
            )}

        </div>
    );
}