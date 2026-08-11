"use client";

import {
    useEffect,
    useState,
} from "react";

import PhotoLightbox from "./PhotoLightbox";

interface Photo {
    id: string;
    file_name: string;
    image_url: string;
    mime_type: string | null;
    file_size: number | null;
    sort_order: number;
}

interface Props {
    token: string;

    photos: Photo[];

    quota: number;
}

export default function PhotoSelectionGallery({
    token,
    photos,
    quota,
}: Props) {
    const [
        selectedIds,
        setSelectedIds,
    ] = useState<Set<string>>(
        new Set()
    );

    const [
        lightboxIndex,
        setLightboxIndex,
    ] = useState<number | null>(
        null
    );

    const [
        saving,
        setSaving,
    ] = useState(false);

    const [
        saved,
        setSaved,
    ] = useState(true);

    const [
        error,
        setError,
    ] = useState("");

    const [
        selectionStatus,
        setSelectionStatus,
    ] = useState<
        "draft" | "submitted"
    >("draft");

    const [
        submitting,
        setSubmitting,
    ] = useState(false);

    const [
        submitSuccess,
        setSubmitSuccess,
    ] = useState(false);

    const [
    whatsappUrl,
    setWhatsappUrl,
] = useState<string | null>(
    null
);

    /*
    |--------------------------------------------------------------------------
    | Load existing selection
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        async function loadSelection() {
            try {
                const response =
                    await fetch(
                        `/api/public/albums/${token}/selection`,
                        {
                            cache: "no-store",
                        }
                    );

                const data =
                    await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.error
                    );
                }

                setSelectedIds(
                    new Set(
                        data.selection
                            .photo_ids
                    )
                );

                setSelectionStatus(
                    data.selection.status
                );

            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : "Gagal mengambil pilihan."
                );
            }
        }

        loadSelection();
    }, [token]);

    /*
    |--------------------------------------------------------------------------
    | Toggle photo
    |--------------------------------------------------------------------------
    */

    function togglePhoto(
        photoId: string
    ) {
        if (
        selectionStatus !==
        "draft"
    ) {
        return;
    }

        setSelectedIds(
            (previous) => {
                const next =
                    new Set(
                        previous
                    );

                if (
                    next.has(
                        photoId
                    )
                ) {
                    next.delete(
                        photoId
                    );
                } else {
                    if (
                        next.size >=
                        quota
                    ) {
                        return previous;
                    }

                    next.add(
                        photoId
                    );
                }

                return next;
            }
        );

        setSaved(false);
        setError("");
    }

    /*
    |--------------------------------------------------------------------------
    | Save selection
    |--------------------------------------------------------------------------
    */

    async function saveSelection() {
        setSaving(true);
        setError("");

        try {
            const response =
                await fetch(
                    `/api/public/albums/${token}/selection`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body: JSON.stringify(
                            {
                                photoIds:
                                    Array.from(
                                        selectedIds
                                    ),
                            }
                        ),
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error ??
                        "Gagal menyimpan pilihan."
                );
            }

            setSelectedIds(
                new Set(
                    data.selection
                        .photo_ids
                )
            );

            setSaved(true);

        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Gagal menyimpan pilihan."
            );
        } finally {
            setSaving(false);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Submit selection
    |--------------------------------------------------------------------------
    */

    async function submitSelection() {
    if (
        selectedIds.size !== quota
    ) {
        setError(
            `Anda harus memilih tepat ${quota} foto. Saat ini ${selectedIds.size} foto.`
        );

        return;
    }

    const confirmed =
        window.confirm(
            `Anda sudah memilih ${selectedIds.size} foto. Setelah dikirim, pilihan tidak dapat diubah lagi. Lanjutkan?`
        );

    if (!confirmed) {
        return;
    }

    setSubmitting(true);
    setError("");

    try {
        /*
        |--------------------------------------------------------------------------
        | Make sure latest selection is saved
        |--------------------------------------------------------------------------
        */

        if (!saved) {
            const saveResponse =
                await fetch(
                    `/api/public/albums/${token}/selection`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body: JSON.stringify({
                            photoIds:
                                Array.from(
                                    selectedIds
                                ),
                        }),
                    }
                );

            const saveData =
                await saveResponse.json();

            if (
                !saveResponse.ok
            ) {
                throw new Error(
                    saveData.error ??
                        "Gagal menyimpan pilihan."
                );
            }

            setSaved(true);
        }

        /*
        |--------------------------------------------------------------------------
        | Final submit
        |--------------------------------------------------------------------------
        */

        const response =
            await fetch(
                `/api/public/albums/${token}/selection/submit`,
                {
                    method: "POST",
                }
            );

        const data =
            await response.json();

        if (!response.ok) {
            throw new Error(
                data.error ??
                    "Gagal mengirim pilihan."
            );
        }

        setSelectionStatus(
            "submitted"
        );

        setSubmitSuccess(true);

        setWhatsappUrl(
            data.whatsapp_url ??
                null
        );

    } catch (error) {
        setError(
            error instanceof Error
                ? error.message
                : "Gagal mengirim pilihan."
        );
    } finally {
        setSubmitting(false);
    }
}

    return (
        <div>

            {/* Selection header */}

            <div className="sticky top-0 z-30 mb-6 rounded-xl border bg-white/95 p-4 shadow-sm backdrop-blur">

                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                    <div>

                        <p className="text-sm text-gray-500">
                            Foto yang dipilih
                        </p>

                        <p className="text-xl font-bold">

                            {selectedIds.size}

                            <span className="font-normal text-gray-400">
                                {" / "}
                                {quota}
                            </span>

                        </p>

                    </div>

                    {/* <button
                        type="button"
                        onClick={
                            saveSelection
                        }
                        disabled={
                            saving ||
                            saved
                        }
                        className="rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        {saving
                            ? "Menyimpan..."
                            : saved
                            ? "Tersimpan"
                            : "Simpan Pilihan"}
                    </button> */}

                    <div className="flex flex-col gap-2 sm:flex-row">

                        {selectionStatus ===
                            "draft" && (
                            <>
                                <button
                                    type="button"
                                    onClick={
                                        saveSelection
                                    }
                                    disabled={
                                        saving ||
                                        saved
                                    }
                                    className="rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-900 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    {saving
                                        ? "Menyimpan..."
                                        : saved
                                        ? "✓ Tersimpan"
                                        : "Simpan Pilihan"}
                                </button>

                                <button
                                    type="button"
                                    onClick={
                                        submitSelection
                                    }
                                    disabled={
                                        submitting ||
                                        selectedIds.size !==
                                            quota
                                    }
                                    className="rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    {submitting
                                        ? "Mengirim..."
                                        : "Kirim Pilihan"}
                                </button>
                            </>
                        )}

                        {selectionStatus ===
                            "submitted" && (
                            <div className="rounded-lg bg-green-50 px-5 py-3 text-sm font-semibold text-green-700">
                                ✓ Pilihan Sudah Dikirim
                            </div>
                        )}

                    </div>

                </div>

                {selectedIds.size >=
                    quota && (
                    <p className="mt-3 text-sm font-medium text-green-600">
                        Kuota pilihan sudah
                        terpenuhi.
                    </p>
                )}

                {error && (
                    <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                        {error}
                    </p>
                )}

            </div>
            {/* Status Final */}
                {selectionStatus ===
                    "submitted" && (
                    <div className="mt-4 rounded-xl border border-green-200 mb-4 bg-green-50 p-4">

                        <div className="flex items-start gap-3">

                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-600 text-sm font-bold text-white">
                                ✓
                            </div>

                            <div>

                                <p className="font-semibold text-green-900">
                                    Foto sudah dipilih
                                    sesuai kuota
                                </p>

                                <p className="mt-1 text-sm text-green-700">
                                    Anda telah memilih{" "}
                                    {selectedIds.size}{" "}
                                    foto. Pilihan sudah
                                    dikirim kepada
                                    fotografer.
                                </p>

                            </div>

                            {whatsappUrl && (
                                    <a
                                        href={
                                            whatsappUrl
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center rounded-lg bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700"
                                    >
                                        Kirim ke WhatsApp
                                    </a>
                                )}


                        </div>

                    </div>
                )}

            {/* Gallery */}

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">

                {photos.map(
                    (
                        photo,
                        index
                    ) => {
                        const selected =
                            selectedIds.has(
                                photo.id
                            );

                        return (
                            <button
                                key={
                                    photo.id
                                }
                                type="button"
                                onClick={() =>
                                    setLightboxIndex(
                                        index
                                    )
                                }
                                className="group relative aspect-square overflow-hidden rounded-xl bg-gray-100"
                            >

                                <img
                                    src={
                                        photo.image_url
                                    }
                                    alt={
                                        photo.file_name
                                    }
                                    loading="lazy"
                                    className={`h-full w-full object-cover transition duration-300 group-hover:scale-105 ${
                                        selected
                                            ? "brightness-75"
                                            : ""
                                    }`}
                                />

                                {/* Selection indicator */}

                                <span
                                    className={`absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-bold ${
                                        selected
                                            ? "border-white bg-black text-white"
                                            : "border-white/80 bg-black/20 text-transparent"
                                    }`}
                                >
                                    ✓
                                </span>

                                {/* File name */}

                                <span className="absolute bottom-0 left-0 right-0 truncate bg-gradient-to-t from-black/70 to-transparent px-3 pb-3 pt-8 text-left text-xs text-white">
                                    {
                                        photo.file_name
                                    }
                                </span>

                            </button>
                        );
                    }
                )}

            </div>

            {/* Lightbox */}

            {lightboxIndex !==
                null && (
                <PhotoLightbox
                    photos={photos}
                    activeIndex={
                        lightboxIndex
                    }
                    selectedIds={
                        selectedIds
                    }
                    quota={quota}
                    selectionStatus={
                        selectionStatus
                    }
                    onClose={() =>
                        setLightboxIndex(
                            null
                        )
                    }
                    onChange={
                        setLightboxIndex
                    }
                    onToggle={
                        togglePhoto
                    }
                />
            )}

        </div>
    );
}