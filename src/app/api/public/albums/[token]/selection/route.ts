// import { NextResponse } from "next/server";

// import { createAdminClient } from "@/lib/supabase/admin";

// import {
//     getPublicAlbumAccess,
// } from "@/lib/security/public-album";

// interface Props {
//     params: Promise<{
//         token: string;
//     }>;
// }

// export async function GET(
//     request: Request,
//     { params }: Props
// ) {
//     try {
//         const { token } = await params;

//         const {
//             accessTokenId,
//             album,
//         } = await getPublicAlbumAccess(
//             token
//         );

//         const admin =
//             createAdminClient();

//         /*
//         |--------------------------------------------------------------------------
//         | Get selection
//         |--------------------------------------------------------------------------
//         */

//         let { data: selection } =
//             await admin
//                 .from("album_selections")
//                 .select(`
//                     id,
//                     selected_count,
//                     status,
//                     submitted_at
//                 `)
//                 .eq(
//                     "access_token_id",
//                     accessTokenId
//                 )
//                 .maybeSingle();

//         /*
//         |--------------------------------------------------------------------------
//         | Create selection if not exists
//         |--------------------------------------------------------------------------
//         */

//         if (!selection) {
//             const {
//                 data: newSelection,
//                 error,
//             } = await admin
//                 .from("album_selections")
//                 .insert({
//                     album_id:
//                         album.id,

//                     access_token_id:
//                         accessTokenId,

//                     selected_count:
//                         0,

//                     status:
//                         "draft",
//                 })
//                 .select(`
//                     id,
//                     selected_count,
//                     status,
//                     submitted_at
//                 `)
//                 .single();

//             if (error) {
//                 throw error;
//             }

//             selection =
//                 newSelection;
//         }

//         /*
//         |--------------------------------------------------------------------------
//         | Get selected photos
//         |--------------------------------------------------------------------------
//         */

//         const {
//             data: selectedPhotos,
//             error: selectedError,
//         } = await admin
//             .from("album_selected_photos")
//             .select(`
//                 album_photo_id
//             `)
//             .eq(
//                 "selection_id",
//                 selection.id
//             );

//         if (selectedError) {
//             throw selectedError;
//         }

//         return NextResponse.json({
//             success: true,

//             selection: {
//                 id:
//                     selection.id,

//                 selected_count:
//                     selection.selected_count,

//                 status:
//                     selection.status,

//                 submitted_at:
//                     selection.submitted_at,

//                 photo_ids:
//                     (
//                         selectedPhotos ??
//                         []
//                     ).map(
//                         (item) =>
//                             item.album_photo_id
//                     ),
//             },

//             quota:
//                 album.quota,
//         });

//     } catch (error) {
//         console.error(
//             "GET SELECTION ERROR:",
//             error
//         );

//         return NextResponse.json(
//             {
//                 error:
//                     error instanceof Error
//                         ? error.message
//                         : "Gagal mengambil selection.",
//             },
//             {
//                 status: 404,
//             }
//         );
//     }
// }

// export async function PUT(
//     request: Request,
//     { params }: Props
// ) {
//     try {
//         const { token } = await params;

//         const {
//             accessTokenId,
//             album,
//         } = await getPublicAlbumAccess(
//             token
//         );

//         const body =
//             await request.json();

//         const photoIds =
//             Array.isArray(body.photoIds)
//                 ? body.photoIds
//                 : [];

//         /*
//         |--------------------------------------------------------------------------
//         | Unique photo IDs
//         |--------------------------------------------------------------------------
//         */

//         const uniquePhotoIds =
//             Array.from(
//                 new Set(
//                     photoIds.filter(
//                         (id) =>
//                             typeof id ===
//                             "string"
//                     )
//                 )
//             );

//         /*
//         |--------------------------------------------------------------------------
//         | Check quota
//         |--------------------------------------------------------------------------
//         */

//         if (
//             uniquePhotoIds.length >
//             album.quota
//         ) {
//             return NextResponse.json(
//                 {
//                     error:
//                         `Maksimal ${album.quota} foto.`,
//                 },
//                 {
//                     status: 422,
//                 }
//             );
//         }

//         const admin =
//             createAdminClient();

//         /*
//         |--------------------------------------------------------------------------
//         | Find selection
//         |--------------------------------------------------------------------------
//         */

//         let { data: selection } =
//             await admin
//                 .from("album_selections")
//                 .select(`
//                     id,
//                     status
//                 `)
//                 .eq(
//                     "access_token_id",
//                     accessTokenId
//                 )
//                 .maybeSingle();

//         /*
//         |--------------------------------------------------------------------------
//         | Create selection
//         |--------------------------------------------------------------------------
//         */

//         if (!selection) {
//             const {
//                 data: newSelection,
//                 error,
//             } = await admin
//                 .from("album_selections")
//                 .insert({
//                     album_id:
//                         album.id,

//                     access_token_id:
//                         accessTokenId,

//                     selected_count:
//                         0,

//                     status:
//                         "draft",
//                 })
//                 .select(`
//                     id,
//                     status
//                 `)
//                 .single();

//             if (error) {
//                 throw error;
//             }

//             selection =
//                 newSelection;
//         }

//         /*
//         |--------------------------------------------------------------------------
//         | Do not allow modification after submitted
//         |--------------------------------------------------------------------------
//         */

//         if (
//             selection.status !==
//             "draft"
//         ) {
//             return NextResponse.json(
//                 {
//                     error:
//                         "Pilihan foto sudah dikirim dan tidak dapat diubah.",
//                 },
//                 {
//                     status: 409,
//                 }
//             );
//         }

//         /*
//         |--------------------------------------------------------------------------
//         | Validate photo ownership
//         |--------------------------------------------------------------------------
//         */

//         if (
//             uniquePhotoIds.length >
//             0
//         ) {
//             const {
//                 data: validPhotos,
//                 error:
//                     photoValidationError,
//             } = await admin
//                 .from("album_photos")
//                 .select("id")
//                 .eq(
//                     "album_id",
//                     album.id
//                 )
//                 .in(
//                     "id",
//                     uniquePhotoIds
//                 );

//             if (
//                 photoValidationError
//             ) {
//                 throw photoValidationError;
//             }

//             const validPhotoIds =
//                 new Set(
//                     (
//                         validPhotos ??
//                         []
//                     ).map(
//                         (photo) =>
//                             photo.id
//                     )
//                 );

//             const invalidPhotoIds =
//                 uniquePhotoIds.filter(
//                     (id) =>
//                         !validPhotoIds.has(
//                             id
//                         )
//                 );

//             if (
//                 invalidPhotoIds.length >
//                 0
//             ) {
//                 return NextResponse.json(
//                     {
//                         error:
//                             "Terdapat foto yang bukan bagian dari album ini.",
//                     },
//                     {
//                         status: 422,
//                     }
//                 );
//             }
//         }

//         /*
//         |--------------------------------------------------------------------------
//         | Remove old selection
//         |--------------------------------------------------------------------------
//         */

//         const {
//             error: deleteError,
//         } = await admin
//             .from(
//                 "album_selected_photos"
//             )
//             .delete()
//             .eq(
//                 "selection_id",
//                 selection.id
//             );

//         if (deleteError) {
//             throw deleteError;
//         }

//         /*
//         |--------------------------------------------------------------------------
//         | Insert new selection
//         |--------------------------------------------------------------------------
//         */

//         if (
//             uniquePhotoIds.length >
//             0
//         ) {
//             const rows =
//                 uniquePhotoIds.map(
//                     (photoId) => ({
//                         selection_id:
//                             selection.id,

//                         album_photo_id:
//                             photoId,
//                     })
//                 );

//             const {
//                 error: insertError,
//             } = await admin
//                 .from(
//                     "album_selected_photos"
//                 )
//                 .insert(rows);

//             if (insertError) {
//                 throw insertError;
//             }
//         }

//         /*
//         |--------------------------------------------------------------------------
//         | Update selection count
//         |--------------------------------------------------------------------------
//         */

//         const {
//             data: updatedSelection,
//             error: updateError,
//         } = await admin
//             .from("album_selections")
//             .update({
//                 selected_count:
//                     uniquePhotoIds.length,

//                 updated_at:
//                     new Date().toISOString(),
//             })
//             .eq(
//                 "id",
//                 selection.id
//             )
//             .select(`
//                 id,
//                 selected_count,
//                 status,
//                 submitted_at
//             `)
//             .single();

//         if (updateError) {
//             throw updateError;
//         }

//         return NextResponse.json({
//             success: true,

//             selection: {
//                 id:
//                     updatedSelection.id,

//                 selected_count:
//                     updatedSelection.selected_count,

//                 status:
//                     updatedSelection.status,

//                 submitted_at:
//                     updatedSelection.submitted_at,

//                 photo_ids:
//                     uniquePhotoIds,
//             },

//             quota:
//                 album.quota,
//         });

//     } catch (error) {
//         console.error(
//             "SAVE SELECTION ERROR:",
//             error
//         );

//         return NextResponse.json(
//             {
//                 error:
//                     error instanceof Error
//                         ? error.message
//                         : "Gagal menyimpan pilihan foto.",
//             },
//             {
//                 status: 500,
//             }
//         );
//     }
// }

// =============================================
// =============================================
// =============================================

import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";

import {
    getPublicAlbumAccess,
} from "@/lib/security/public-album";

interface Props {
    params: Promise<{
        token: string;
    }>;
}

/*
|--------------------------------------------------------------------------
| GET
|--------------------------------------------------------------------------
| Mengambil selection yang sudah tersimpan
|--------------------------------------------------------------------------
*/

export async function GET(
    request: Request,
    { params }: Props
) {
    try {
        const { token } = await params;

        const {
            accessTokenId,
            album,
        } = await getPublicAlbumAccess(token);

        const admin =
            createAdminClient();

        /*
        |--------------------------------------------------------------------------
        | Find existing selection
        |--------------------------------------------------------------------------
        */

        let { data: selection, error } =
            await admin
                .from("album_selections")
                .select(`
                    id,
                    selected_count,
                    status,
                    submitted_at
                `)
                .eq(
                    "access_token_id",
                    accessTokenId
                )
                .maybeSingle();

        if (error) {
            console.error(
                "GET SELECTION DATABASE ERROR:",
                error
            );

            return NextResponse.json(
                {
                    success: false,
                    error:
                        "Gagal mengambil data selection.",
                },
                {
                    status: 500,
                }
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Create selection if doesn't exist
        |--------------------------------------------------------------------------
        */

        if (!selection) {
            const {
                data: newSelection,
                error: createError,
            } = await admin
                .from("album_selections")
                .insert({
                    album_id:
                        album.id,

                    access_token_id:
                        accessTokenId,

                    selected_count: 0,

                    status: "draft",
                })
                .select(`
                    id,
                    selected_count,
                    status,
                    submitted_at
                `)
                .single();

            if (createError) {
                console.error(
                    "CREATE SELECTION ERROR:",
                    createError
                );

                return NextResponse.json(
                    {
                        success: false,
                        error:
                            createError.message,
                    },
                    {
                        status: 500,
                    }
                );
            }

            selection =
                newSelection;
        }

        /*
        |--------------------------------------------------------------------------
        | Get selected photos
        |--------------------------------------------------------------------------
        */

        const {
            data: selectedPhotos,
            error: selectedError,
        } = await admin
            .from("album_selected_photos")
            .select(`
                album_photo_id
            `)
            .eq(
                "selection_id",
                selection.id
            );

        if (selectedError) {
            console.error(
                "GET SELECTED PHOTOS ERROR:",
                selectedError
            );

            return NextResponse.json(
                {
                    success: false,
                    error:
                        "Gagal mengambil foto yang dipilih.",
                },
                {
                    status: 500,
                }
            );
        }

        return NextResponse.json({
            success: true,

            selection: {
                id:
                    selection.id,

                selected_count:
                    selection.selected_count,

                status:
                    selection.status,

                submitted_at:
                    selection.submitted_at,

                photo_ids:
                    (
                        selectedPhotos ?? []
                    ).map(
                        (item) =>
                            item.album_photo_id
                    ),
            },

            quota:
                album.quota,
        });

    } catch (error) {
        console.error(
            "GET SELECTION ERROR:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Gagal mengambil selection.",
            },
            {
                status: 500,
            }
        );
    }
}


/*
|--------------------------------------------------------------------------
| PUT
|--------------------------------------------------------------------------
| Menyimpan selection
|--------------------------------------------------------------------------
*/

export async function PUT(
    request: Request,
    { params }: Props
) {
    console.log(
        "========== PUT SELECTION =========="
    );

    try {
        const { token } = await params;

        console.log(
            "TOKEN:",
            token
        );

        /*
        |--------------------------------------------------------------------------
        | Validate public album
        |--------------------------------------------------------------------------
        */

        const {
            accessTokenId,
            album,
        } = await getPublicAlbumAccess(token);

        console.log(
            "ALBUM:",
            album.id
        );

        /*
        |--------------------------------------------------------------------------
        | Read request body
        |--------------------------------------------------------------------------
        */

        const body =
            await request.json();

        console.log(
            "REQUEST BODY:",
            body
        );

        const photoIds =
            Array.isArray(
                body.photoIds
            )
                ? body.photoIds
                : [];

        /*
        |--------------------------------------------------------------------------
        | Remove duplicates
        |--------------------------------------------------------------------------
        */

        const uniquePhotoIds =
            Array.from(
                new Set(
                    photoIds.filter(
                        (
                            id
                        ): id is string =>
                            typeof id ===
                            "string"
                    )
                )
            );

        console.log(
            "PHOTO COUNT:",
            uniquePhotoIds.length
        );

        /*
        |--------------------------------------------------------------------------
        | Validate quota
        |--------------------------------------------------------------------------
        */

        if (
            uniquePhotoIds.length >
            album.quota
        ) {
            return NextResponse.json(
                {
                    success: false,

                    error:
                        `Maksimal ${album.quota} foto.`,
                },
                {
                    status: 422,
                }
            );
        }

        const admin =
            createAdminClient();

        /*
        |--------------------------------------------------------------------------
        | Find selection
        |--------------------------------------------------------------------------
        */

        let { data: selection, error } =
            await admin
                .from("album_selections")
                .select(`
                    id,
                    status
                `)
                .eq(
                    "access_token_id",
                    accessTokenId
                )
                .maybeSingle();

        if (error) {
            console.error(
                "FIND SELECTION ERROR:",
                error
            );

            return NextResponse.json(
                {
                    success: false,
                    error:
                        error.message,
                },
                {
                    status: 500,
                }
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Create selection
        |--------------------------------------------------------------------------
        */

        if (!selection) {
            const {
                data: newSelection,
                error: createError,
            } = await admin
                .from("album_selections")
                .insert({
                    album_id:
                        album.id,

                    access_token_id:
                        accessTokenId,

                    selected_count: 0,

                    status: "draft",
                })
                .select(`
                    id,
                    status
                `)
                .single();

            if (createError) {
                console.error(
                    "CREATE SELECTION ERROR:",
                    createError
                );

                return NextResponse.json(
                    {
                        success: false,
                        error:
                            createError.message,
                    },
                    {
                        status: 500,
                    }
                );
            }

            selection =
                newSelection;
        }

        /*
        |--------------------------------------------------------------------------
        | Don't modify submitted selection
        |--------------------------------------------------------------------------
        */

        if (
            selection.status !==
            "draft"
        ) {
            return NextResponse.json(
                {
                    success: false,

                    error:
                        "Pilihan foto sudah dikirim dan tidak dapat diubah.",
                },
                {
                    status: 409,
                }
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Validate photo ownership
        |--------------------------------------------------------------------------
        */

        if (
            uniquePhotoIds.length >
            0
        ) {
            const {
                data: validPhotos,
                error:
                    validationError,
            } = await admin
                .from("album_photos")
                .select("id")
                .eq(
                    "album_id",
                    album.id
                )
                .in(
                    "id",
                    uniquePhotoIds
                );

            if (validationError) {
                console.error(
                    "PHOTO VALIDATION ERROR:",
                    validationError
                );

                return NextResponse.json(
                    {
                        success: false,
                        error:
                            validationError.message,
                    },
                    {
                        status: 500,
                    }
                );
            }

            const validPhotoIds =
                new Set(
                    (
                        validPhotos ??
                        []
                    ).map(
                        (photo) =>
                            photo.id
                    )
                );

            const invalidPhotoIds =
                uniquePhotoIds.filter(
                    (id) =>
                        !validPhotoIds.has(
                            id
                        )
                );

            if (
                invalidPhotoIds.length >
                0
            ) {
                console.error(
                    "INVALID PHOTO IDS:",
                    invalidPhotoIds
                );

                return NextResponse.json(
                    {
                        success: false,

                        error:
                            "Terdapat foto yang bukan bagian dari album ini.",
                    },
                    {
                        status: 422,
                    }
                );
            }
        }

        /*
        |--------------------------------------------------------------------------
        | Delete old selection
        |--------------------------------------------------------------------------
        */

        const {
            error: deleteError,
        } = await admin
            .from(
                "album_selected_photos"
            )
            .delete()
            .eq(
                "selection_id",
                selection.id
            );

        if (deleteError) {
            console.error(
                "DELETE OLD SELECTION ERROR:",
                deleteError
            );

            return NextResponse.json(
                {
                    success: false,
                    error:
                        deleteError.message,
                },
                {
                    status: 500,
                }
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Insert new selection
        |--------------------------------------------------------------------------
        */

        if (
            uniquePhotoIds.length >
            0
        ) {
            const rows =
                uniquePhotoIds.map(
                    (photoId) => ({
                        selection_id:
                            selection.id,

                        album_photo_id:
                            photoId,
                    })
                );

            console.log(
                "INSERT ROWS:",
                rows.length
            );

            const {
                error: insertError,
            } = await admin
                .from(
                    "album_selected_photos"
                )
                .insert(rows);

            if (insertError) {
                console.error(
                    "INSERT SELECTION ERROR:",
                    insertError
                );

                return NextResponse.json(
                    {
                        success: false,
                        error:
                            insertError.message,
                    },
                    {
                        status: 500,
                    }
                );
            }
        }

        /*
        |--------------------------------------------------------------------------
        | Update selection count
        |--------------------------------------------------------------------------
        */

        const {
            data: updatedSelection,
            error: updateError,
        } = await admin
            .from("album_selections")
            .update({
                selected_count:
                    uniquePhotoIds.length,

                updated_at:
                    new Date().toISOString(),
            })
            .eq(
                "id",
                selection.id
            )
            .select(`
                id,
                selected_count,
                status,
                submitted_at
            `)
            .single();

        if (updateError) {
            console.error(
                "UPDATE SELECTION ERROR:",
                updateError
            );

            return NextResponse.json(
                {
                    success: false,
                    error:
                        updateError.message,
                },
                {
                    status: 500,
                }
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Success
        |--------------------------------------------------------------------------
        */

        console.log(
            "SELECTION SAVED:",
            updatedSelection
        );

        return NextResponse.json(
            {
                success: true,

                selection: {
                    id:
                        updatedSelection.id,

                    selected_count:
                        updatedSelection.selected_count,

                    status:
                        updatedSelection.status,

                    submitted_at:
                        updatedSelection.submitted_at,

                    photo_ids:
                        uniquePhotoIds,
                },

                quota:
                    album.quota,
            },
            {
                status: 200,
            }
        );

    } catch (error) {
        console.error(
            "PUT SELECTION ERROR:",
            error
        );

        return NextResponse.json(
            {
                success: false,

                error:
                    error instanceof Error
                        ? error.message
                        : "Gagal menyimpan pilihan foto.",
            },
            {
                status: 500,
            }
        );
    }
}