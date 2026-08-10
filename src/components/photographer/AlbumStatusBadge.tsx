import { AlbumStatus } from "@/types/album";

interface Props {
    status: AlbumStatus;
}

const statusMap = {
    selection: {
        label: "Foto Dipilih",
        className:
            "bg-yellow-100 text-yellow-700",
    },

    editing: {
        label: "Progress Editing",
        className:
            "bg-blue-100 text-blue-700",
    },

    printing: {
        label: "Proses Cetak",
        className:
            "bg-purple-100 text-purple-700",
    },

    done: {
        label: "DONE",
        className:
            "bg-green-100 text-green-700",
    },
};

export default function AlbumStatusBadge({
    status,
}: Props) {
    const item = statusMap[status];

    return (
        <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${item.className}`}
        >
            {item.label}
        </span>
    );
}