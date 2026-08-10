import Link from "next/link";
import { Album } from "@/types/album";
import AlbumStatusBadge from "./AlbumStatusBadge";

interface Props {
    album: Album;
}

export default function AlbumCard({
    album,
}: Props) {
    return (
        <div className="rounded-xl border bg-white p-5 shadow-sm">

            <div className="flex items-start justify-between gap-4">

                <div>
                    <h2 className="text-lg font-semibold">
                        {album.title}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Quota {album.quota} foto
                    </p>
                </div>

                <AlbumStatusBadge
                    status={album.status}
                />

            </div>

            {album.description && (
                <p className="mt-4 line-clamp-2 text-sm text-gray-600">
                    {album.description}
                </p>
            )}

            <div className="mt-5 flex gap-2">

                <Link
                    href={`/photographer/albums/${album.id}`}
                    className="rounded-lg bg-black px-4 py-2 text-sm text-white"
                >
                    Detail
                </Link>

                <Link
                    href={`/photographer/albums/${album.id}/edit`}
                    className="rounded-lg border px-4 py-2 text-sm"
                >
                    Edit
                </Link>

            </div>

        </div>
    );
}