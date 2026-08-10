"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface AlbumFormProps {
    mode?: "create" | "edit";
    album?: {
        id: string;
        title: string;
        description: string | null;
        quota: number;
        whatsapp_number: string | null;
        expires_at: string | null;
        is_active: boolean;
    };
}

export default function AlbumForm({
    mode = "create",
    album,
}: AlbumFormProps) {
    const supabase = createClient();
    const router = useRouter();

    const [title, setTitle] = useState(
        album?.title ?? ""
    );

    const [description, setDescription] = useState(
        album?.description ?? ""
    );

    const [quota, setQuota] = useState(
        album?.quota ?? 40
    );

    const [whatsapp, setWhatsapp] = useState(
        album?.whatsapp_number ?? ""
    );

    const [expiresAt, setExpiresAt] = useState(
        album?.expires_at
            ? album.expires_at.substring(0, 16)
            : ""
    );

    const [isActive, setIsActive] = useState(
        album?.is_active ?? true
    );

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setLoading(true);
        setError("");

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            setError("Anda belum login.");
            setLoading(false);
            return;
        }

        if (!title.trim()) {
            setError("Nama album wajib diisi.");
            setLoading(false);
            return;
        }

        if (quota < 1) {
            setError("Quota minimal 1 foto.");
            setLoading(false);
            return;
        }

        if (mode === "create") {
            const slugBase = title
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9\s-]/g, "")
                .replace(/\s+/g, "-")
                .replace(/-+/g, "-");

            const uniqueSlug =
                `${slugBase}-${crypto.randomUUID().slice(0, 8)}`;

            const { error } = await supabase
                .from("albums")
                .insert({
                    photographer_id: user.id,
                    title: title.trim(),
                    slug: uniqueSlug,
                    description:
                        description.trim() || null,
                    quota,
                    whatsapp_number:
                        whatsapp.trim() || null,
                    expires_at:
                        expiresAt || null,
                    is_active: isActive,
                });

            if (error) {
                setError(error.message);
                setLoading(false);
                return;
            }
        } else {
            const { error } = await supabase
                .from("albums")
                .update({
                    title: title.trim(),
                    description:
                        description.trim() || null,
                    quota,
                    whatsapp_number:
                        whatsapp.trim() || null,
                    expires_at:
                        expiresAt || null,
                    is_active: isActive,
                })
                .eq("id", album!.id);

            if (error) {
                setError(error.message);
                setLoading(false);
                return;
            }
        }

        router.push("/photographer/albums");
        router.refresh();
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6"
        >

            <div>
                <label className="mb-2 block text-sm font-medium">
                    Nama Album
                </label>

                <input
                    type="text"
                    value={title}
                    onChange={(e) =>
                        setTitle(e.target.value)
                    }
                    placeholder="Wedding Andi & Sarah"
                    className="w-full rounded-lg border p-3"
                    required
                />
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium">
                    Deskripsi
                </label>

                <textarea
                    value={description}
                    onChange={(e) =>
                        setDescription(e.target.value)
                    }
                    placeholder="Album foto wedding..."
                    rows={4}
                    className="w-full rounded-lg border p-3"
                />
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium">
                    Kuota Foto
                </label>

                <input
                    type="number"
                    min={1}
                    value={quota}
                    onChange={(e) =>
                        setQuota(Number(e.target.value))
                    }
                    className="w-full rounded-lg border p-3"
                    required
                />

                <p className="mt-1 text-sm text-gray-500">
                    Contoh: client mendapat kuota 40 foto.
                </p>
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium">
                    WhatsApp Photographer
                </label>

                <input
                    type="text"
                    value={whatsapp}
                    onChange={(e) =>
                        setWhatsapp(e.target.value)
                    }
                    placeholder="628123456789"
                    className="w-full rounded-lg border p-3"
                />
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium">
                    Album Expired
                </label>

                <input
                    type="datetime-local"
                    value={expiresAt}
                    onChange={(e) =>
                        setExpiresAt(e.target.value)
                    }
                    className="w-full rounded-lg border p-3"
                />
            </div>

            <label className="flex items-center gap-3">
                <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) =>
                        setIsActive(e.target.checked)
                    }
                />

                <span className="text-sm">
                    Album aktif
                </span>
            </label>

            {error && (
                <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-black px-5 py-3 text-white disabled:opacity-50"
            >
                {loading
                    ? "Menyimpan..."
                    : mode === "create"
                        ? "Buat Album"
                        : "Simpan Perubahan"}
            </button>

        </form>
    );
}