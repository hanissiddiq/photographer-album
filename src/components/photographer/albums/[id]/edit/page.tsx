import { notFound, redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import AlbumForm from "@/components/photographer/AlbumForm";

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditAlbumPage({
    params,
}: Props) {
    const { id } = await params;

    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: album } = await supabase
        .from("albums")
        .select("*")
        .eq("id", id)
        .eq("photographer_id", user.id)
        .single();

    if (!album) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-gray-50 p-8">

            <div className="mx-auto max-w-3xl">

                <div className="mb-8">
                    <h1 className="text-3xl font-bold">
                        Edit Album
                    </h1>

                    <p className="mt-2 text-gray-500">
                        {album.title}
                    </p>
                </div>

                <div className="rounded-xl bg-white p-8 shadow-sm">

                    <AlbumForm
                        mode="edit"
                        album={album}
                    />

                </div>

            </div>

        </main>
    );
}