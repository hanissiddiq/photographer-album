import { createAdminClient } from "@/lib/supabase/admin";

export async function getAlbumSelection(
    albumId: string
) {
    const supabase =
        createAdminClient();

    const {
        data: album,
        error: albumError,
    } = await supabase
        .from("albums")
        .select(`
            id,
            title,
            quota,
            status,
            photographer_id
        `)
        .eq("id", albumId)
        .single();

    if (
        albumError ||
        !album
    ) {
        throw new Error(
            "Album tidak ditemukan."
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Selection
    |--------------------------------------------------------------------------
    */

    const {
        data: selection,
        error: selectionError,
    } = await supabase
        .from("album_selections")
        .select(`
            id,
            selected_count,
            status,
            submitted_at,
            created_at,
            updated_at
        `)
        .eq(
            "album_id",
            albumId
        )
        .order(
            "created_at",
            {
                ascending: false,
            }
        )
        .limit(1)
        .maybeSingle();

    if (selectionError) {
        throw selectionError;
    }

    if (!selection) {
        return {
            album,
            selection: null,
            photos: [],
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Selected photos
    |--------------------------------------------------------------------------
    */

    const {
        data: selectedPhotos,
        error: photosError,
    } = await supabase
        .from(
            "album_selected_photos"
        )
        .select(`
            id,
            selected_at,
            album_photo_id,
            album_photos (
                id,
                file_name,
                
                sort_order
            )
        `)
        .eq(
            "selection_id",
            selection.id
        )
        .order(
            "selected_at",
            {
                ascending: true,
            }
        );

    if (photosError) {
        throw photosError;
    }

    const photos =
        (
            selectedPhotos ??
            []
        ).map((item: any) => ({
            id:
                item.album_photos
                    ?.id,

            file_name:
                item.album_photos
                    ?.file_name,

            

            sort_order:
                item.album_photos
                    ?.sort_order,

            selected_at:
                item.selected_at,
        }))
        .filter(
            (photo) =>
                photo.id
        );

    return {
        album,
        selection,
        photos,
    };
}