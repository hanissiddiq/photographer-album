"use client";

import {
    useState,
} from "react";

interface Props {
    token: string;

    disabled?: boolean;
}

export default function SendWhatsAppButton({
    token,
    disabled = false,
}: Props) {
    const [
        loading,
        setLoading,
    ] = useState(false);

    const [
        error,
        setError,
    ] = useState("");

    async function handleSend() {
        setLoading(true);
        setError("");

        try {
            const response =
                await fetch(
                    `/api/public/albums/${token}/selection/whatsapp`,
                    {
                        method: "GET",
                        cache: "no-store",
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error ??
                        "Gagal membuat pesan WhatsApp."
                );
            }

            /*
            |--------------------------------------------------------------------------
            | Open WhatsApp
            |--------------------------------------------------------------------------
            */

            window.location.href =
                data.whatsapp_url;

        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Gagal membuka WhatsApp."
            );

        } finally {
            setLoading(false);
        }
    }

    return (
        <div>

            <button
                type="button"
                onClick={
                    handleSend
                }
                disabled={
                    disabled ||
                    loading
                }
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >

                {loading ? (
                    <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />

                        Menyiapkan...
                    </>
                ) : (
                    <>
                        <span>
                            💬
                        </span>

                        Kirim ke WhatsApp
                    </>
                )}

            </button>

            {error && (
                <p className="mt-2 text-sm text-red-600">
                    {error}
                </p>
            )}

        </div>
    );
}