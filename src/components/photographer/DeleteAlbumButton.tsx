"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface Props {
    albumId: string;
}

export default function DeleteAlbumButton({
    albumId,
}: Props) {
    const supabase = createClient();
    const router = useRouter();

    const [loading, setLoading] = useState(false);

    async function handleDelete() {
        const confirmed = window.confirm(
            "Yakin ingin menghapus album ini?"
        );

        if (!confirmed) {
            return;
        }

        setLoading(true);

        const { error } = await supabase
            .from("albums")
            .delete()
            .eq("id", albumId);

        if (error) {
            alert(error.message);
            setLoading(false);
            return;
        }

        router.push("/photographer/albums");
        router.refresh();
    }

    return (
        <button
            onClick={handleDelete}
            disabled={loading}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white disabled:opacity-50"
        >
            {loading
                ? "Menghapus..."
                : "Hapus Album"}
        </button>
    );
}