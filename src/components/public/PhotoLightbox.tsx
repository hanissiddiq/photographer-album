"use client";

import {
    useEffect,
    useState,
    TouchEvent,
} from "react";

interface Photo {
    id: string;
    file_name: string;
    image_url: string;
}

interface Props {
    photos: Photo[];

    activeIndex: number;

    selectedIds: Set<string>;

    quota: number;

    selectionStatus:
        | "draft"
        | "submitted";

    onClose: () => void;

    onChange: (
        index: number
    ) => void;

    onToggle: (
        photoId: string
    ) => void;
}

export default function PhotoLightbox({
    photos,
    activeIndex,
    selectedIds,
    quota,
    selectionStatus,
    onClose,
    onChange,
    onToggle,
}: Props) {
    const [touchStartX, setTouchStartX] =
        useState<number | null>(null);

    const photo =
        photos[activeIndex];

    if (!photo) {
        return null;
    }

    const isSelected =
        selectedIds.has(
            photo.id
        );

    function previous() {
        if (
            activeIndex === 0
        ) {
            onChange(
                photos.length - 1
            );

            return;
        }

        onChange(
            activeIndex - 1
        );
    }

    function next() {
        if (
            activeIndex ===
            photos.length - 1
        ) {
            onChange(0);

            return;
        }

        onChange(
            activeIndex + 1
        );
    }

    function handleTouchStart(
        event: TouchEvent
    ) {
        setTouchStartX(
            event.touches[0].clientX
        );
    }

    function handleTouchEnd(
        event: TouchEvent
    ) {
        if (
            touchStartX === null
        ) {
            return;
        }

        const endX =
            event.changedTouches[0]
                .clientX;

        const difference =
            touchStartX - endX;

        const threshold = 50;

        if (
            Math.abs(difference) >=
            threshold
        ) {
            if (
                difference > 0
            ) {
                next();
            } else {
                previous();
            }
        }

        setTouchStartX(null);
    }

    useEffect(() => {
        function handleKeyboard(
            event: KeyboardEvent
        ) {
            if (
                event.key ===
                "Escape"
            ) {
                onClose();
            }

            if (
                event.key ===
                "ArrowLeft"
            ) {
                previous();
            }

            if (
                event.key ===
                "ArrowRight"
            ) {
                next();
            }
        }

        window.addEventListener(
            "keydown",
            handleKeyboard
        );

        return () => {
            window.removeEventListener(
                "keydown",
                handleKeyboard
            );
        };
    });

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
            onClick={onClose}
        >

            <div
                className="relative flex h-full w-full items-center justify-center p-4 md:p-10"
                onClick={(event) =>
                    event.stopPropagation()
                }
                onTouchStart={
                    handleTouchStart
                }
                onTouchEnd={
                    handleTouchEnd
                }
            >

                {/* Close */}

                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl text-white backdrop-blur hover:bg-white/20"
                >
                    ×
                </button>

                {/* Counter */}

                <div className="absolute left-4 top-4 z-20 rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur">
                    {activeIndex + 1}
                    {" / "}
                    {photos.length}
                </div>

                {/* Previous */}

                <button
                    type="button"
                    onClick={previous}
                    className="absolute left-3 z-20 hidden h-12 w-12 items-center justify-center rounded-full bg-white/10 text-3xl text-white backdrop-blur hover:bg-white/20 md:flex"
                >
                    ‹
                </button>

                {/* Image */}

                <div className="flex h-full w-full items-center justify-center">

                    <img
                        src={photo.image_url}
                        alt={photo.file_name}
                        draggable={false}
                        className="max-h-[80vh] max-w-full select-none object-contain"
                    />

                </div>

                {/* Next */}

                <button
                    type="button"
                    onClick={next}
                    className="absolute right-3 z-20 hidden h-12 w-12 items-center justify-center rounded-full bg-white/10 text-3xl text-white backdrop-blur hover:bg-white/20 md:flex"
                >
                    ›
                </button>

                {/* Bottom toolbar */}

                <div className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2">

                    {/* <button
                        type="button"
                        onClick={() =>
                            onToggle(
                                photo.id
                            )
                        }
                        disabled={
                            !isSelected &&
                            selectedIds.size >=
                                quota
                        }
                        className={`rounded-full px-6 py-3 text-sm font-semibold shadow-lg transition ${
                            isSelected
                                ? "bg-white text-black"
                                : "bg-black/60 text-white ring-1 ring-white/30"
                        } disabled:cursor-not-allowed disabled:opacity-50`}
                    >
                        {isSelected
                            ? "✓ Foto Dipilih"
                            : "Pilih Foto"}
                    </button> */}

                    <button
                        type="button"
                        onClick={() =>
                            onToggle(photo.id)
                        }
                        disabled={
                            selectionStatus ===
                                "submitted" ||
                            (!isSelected &&
                                selectedIds.size >=
                                    quota)
                        }
                        className={`rounded-full px-6 py-3 text-sm font-semibold shadow-lg transition ${
                            isSelected
                                ? "bg-white text-black"
                                : "bg-black/60 text-white ring-1 ring-white/30"
                        } disabled:cursor-not-allowed disabled:opacity-50`}
                    >
                        {selectionStatus ===
                        "submitted"
                            ? isSelected
                                ? "✓ Foto Dipilih"
                                : "Pilihan Sudah Dikirim"
                            : isSelected
                            ? "✓ Foto Dipilih"
                            : "Pilih Foto"}
                    </button>

                </div>

            </div>

        </div>
    );
}