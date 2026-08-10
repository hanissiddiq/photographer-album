export type AlbumStatus =
    | "selection"
    | "editing"
    | "printing"
    | "done";

export interface Album {
    id: string;

    photographer_id: string;

    client_id: string | null;

    title: string;

    slug: string;

    description: string | null;

    drive_url: string | null;

    quota: number;

    whatsapp_number: string | null;

    status: AlbumStatus;

    is_active: boolean;

    expires_at: string | null;

    created_at: string;

    updated_at: string;
}