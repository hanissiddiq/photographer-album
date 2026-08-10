"use client";

import { useEffect, useState } from "react";

interface DriveFolder {
    id: string;
    name: string;
}

interface Props {
    value?: string | null;
    onChange: (
        folder: DriveFolder | null
    ) => void;
}

export default function GoogleDriveFolderPicker({
    value,
    onChange,
}: Props) {
    const [folders, setFolders] =
        useState<DriveFolder[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    useEffect(() => {
        async function loadFolders() {
            try {
                const response =
                    await fetch(
                        "/api/google-drive/folders"
                    );

                const data =
                    await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.error ??
                        "Gagal mengambil folder."
                    );
                }

                setFolders(
                    data.folders ?? []
                );
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : "Gagal mengambil folder."
                );
            } finally {
                setLoading(false);
            }
        }

        loadFolders();
    }, []);

    if (loading) {
        return (
            <div className="rounded-lg border p-4">
                Loading Google Drive...
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
                {error}
            </div>
        );
    }

    return (
        <div>
            <label className="mb-2 block text-sm font-medium">
                Google Drive Folder
            </label>

            <select
                value={value ?? ""}
                onChange={(event) => {
                    const folder =
                        folders.find(
                            (item) =>
                                item.id ===
                                event.target.value
                        );

                    onChange(
                        folder ?? null
                    );
                }}
                className="w-full rounded-lg border p-3"
            >
                <option value="">
                    Pilih folder
                </option>

                {folders.map((folder) => (
                    <option
                        key={folder.id}
                        value={folder.id}
                    >
                        {folder.name}
                    </option>
                ))}
            </select>
        </div>
    );
}