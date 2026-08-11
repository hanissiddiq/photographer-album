// import {
//     NextResponse,
// } from "next/server";

// // import {
// //     createServerSupabaseClient,
// // } from "@/lib/supabase/server";

// import { createClient } from "@/lib/supabase/server";

// interface Props {
//     params: Promise<{
//         id: string;
//     }>;
// }

// const allowedStatuses = [
//     "submitted",
//     "editing",
//     "printing",
//     "done",
// ] as const;

// type AlbumStatus =
//     (typeof allowedStatuses)[number];

// const transitions: Record<
//     AlbumStatus,
//     AlbumStatus | null
// > = {
//     submitted: "editing",
//     editing: "printing",
//     printing: "done",
//     done: null,
// };

// export async function PATCH(
//     request: Request,
//     { params }: Props
// ) {
//     try {
//         const { id } =
//             await params;

//         // const supabase =
//         //     await createServerSupabaseClient();

//         const supabase =
//     await createClient();

//         /*
//         |--------------------------------------------------------------------------
//         | Authentication
//         |--------------------------------------------------------------------------
//         */

//         const {
//             data: {
//                 user,
//             },
//             error: authError,
//         } = await supabase.auth.getUser();

//         if (
//             authError ||
//             !user
//         ) {
//             return NextResponse.json(
//                 {
//                     error:
//                         "Unauthorized",
//                 },
//                 {
//                     status: 401,
//                 }
//             );
//         }

//         /*
//         |--------------------------------------------------------------------------
//         | Request
//         |--------------------------------------------------------------------------
//         */

//         const body =
//             await request.json();

//         const nextStatus =
//             body.status as string;

//         if (
//             !allowedStatuses.includes(
//                 nextStatus as AlbumStatus
//             )
//         ) {
//             return NextResponse.json(
//                 {
//                     error:
//                         "Status tidak valid.",
//                 },
//                 {
//                     status: 422,
//                 }
//             );
//         }

//         /*
//         |--------------------------------------------------------------------------
//         | Album owner check
//         |--------------------------------------------------------------------------
//         */

//         const {
//             data: album,
//             error: albumError,
//         } = await supabase
//             .from("albums")
//             .select(`
//                 id,
//                 photographer_id,
//                 status
//             `)
//             .eq(
//                 "id",
//                 id
//             )
//             .eq(
//                 "photographer_id",
//                 user.id
//             )
//             .single();

//         if (albumError) {
//             return NextResponse.json(
//                 {
//                     error:
//                         "Album tidak ditemukan.",
//                 },
//                 {
//                     status: 404,
//                 }
//             );
//         }

//         /*
//         |--------------------------------------------------------------------------
//         | Prevent invalid transition
//         |--------------------------------------------------------------------------
//         */

//         if (
//             album.status ===
//             "draft"
//         ) {
//             return NextResponse.json(
//                 {
//                     error:
//                         "Album belum memiliki final selection dari client.",
//                 },
//                 {
//                     status: 422,
//                 }
//             );
//         }

//         const currentStatus =
//             album.status as AlbumStatus;

//         if (
//             currentStatus ===
//             "done"
//         ) {
//             return NextResponse.json(
//                 {
//                     error:
//                         "Album sudah selesai.",
//                 },
//                 {
//                     status: 422,
//                 }
//             );
//         }

//         const expectedNext =
//             transitions[
//                 currentStatus
//             ];

//         if (
//             expectedNext !==
//             nextStatus
//         ) {
//             return NextResponse.json(
//                 {
//                     error:
//                         `Perubahan status tidak valid. Status saat ini: ${currentStatus}.`,
//                 },
//                 {
//                     status: 422,
//                 }
//             );
//         }

//         /*
//         |--------------------------------------------------------------------------
//         | Update
//         |--------------------------------------------------------------------------
//         */

//         const {
//             data: updatedAlbum,
//             error: updateError,
//         } = await supabase
//             .from("albums")
//             .update({
//                 status:
//                     nextStatus,
//                 updated_at:
//                     new Date().toISOString(),
//             })
//             .eq(
//                 "id",
//                 id
//             )
//             .eq(
//                 "photographer_id",
//                 user.id
//             )
//             .select(`
//                 id,
//                 status,
//                 updated_at
//             `)
//             .single();

//         if (updateError) {
//             throw updateError;
//         }

//         return NextResponse.json({
//             success: true,
//             album: updatedAlbum,
//         });

//     } catch (error) {
//         console.error(
//             "UPDATE ALBUM STATUS ERROR:",
//             error
//         );

//         return NextResponse.json(
//             {
//                 error:
//                     error instanceof Error
//                         ? error.message
//                         : "Gagal mengubah status album.",
//             },
//             {
//                 status: 500,
//             }
//         );
//     }
// }

import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

interface Props {
    params: Promise<{
        id: string;
    }>;
}

const allowedStatuses = [
    "submitted",
    "editing",
    "printing",
    "done",
] as const;

type SelectionStatus =
    (typeof allowedStatuses)[number];

const transitions: Record<
    SelectionStatus,
    SelectionStatus | null
> = {
    submitted: "editing",
    editing: "printing",
    printing: "done",
    done: null,
};

export async function PATCH(
    request: Request,
    { params }: Props
) {
    try {
        const { id } =
            await params;

        const supabase =
            await createClient();

        /*
        |--------------------------------------------------------------------------
        | 1. Authentication
        |--------------------------------------------------------------------------
        */

        const {
            data: {
                user,
            },
            error: authError,
        } = await supabase.auth.getUser();

        if (
            authError ||
            !user
        ) {
            return NextResponse.json(
                {
                    error:
                        "Unauthorized",
                },
                {
                    status: 401,
                }
            );
        }

        /*
        |--------------------------------------------------------------------------
        | 2. Request
        |--------------------------------------------------------------------------
        */

        const body =
            await request.json();

        const nextStatus =
            body.status as string;

        if (
            !allowedStatuses.includes(
                nextStatus as SelectionStatus
            )
        ) {
            return NextResponse.json(
                {
                    error:
                        "Status tidak valid.",
                },
                {
                    status: 422,
                }
            );
        }

        /*
        |--------------------------------------------------------------------------
        | 3. Pastikan album milik photographer
        |--------------------------------------------------------------------------
        */

        const {
            data: album,
            error: albumError,
        } = await supabase
            .from("albums")
            .select(`
                id,
                photographer_id
            `)
            .eq(
                "id",
                id
            )
            .eq(
                "photographer_id",
                user.id
            )
            .single();

        if (
            albumError ||
            !album
        ) {
            console.error(
                "ALBUM ERROR:",
                albumError
            );

            return NextResponse.json(
                {
                    error:
                        "Album tidak ditemukan atau bukan milik Anda.",
                },
                {
                    status: 404,
                }
            );
        }

        /*
        |--------------------------------------------------------------------------
        | 4. Ambil selection aktif
        |--------------------------------------------------------------------------
        */

        const {
            data: selection,
            error: selectionError,
        } = await supabase
            .from(
                "album_selections"
            )
            .select(`
                id,
                album_id,
                selected_count,
                status,
                submitted_at,
                updated_at
            `)
            .eq(
                "album_id",
                album.id
            )
            .order(
                "submitted_at",
                {
                    ascending: false,
                }
            )
            .limit(1)
            .maybeSingle();

        if (
            selectionError
        ) {
            console.error(
                "SELECTION ERROR:",
                selectionError
            );

            return NextResponse.json(
                {
                    error:
                        selectionError.message,
                },
                {
                    status: 500,
                }
            );
        }

        if (!selection) {
            return NextResponse.json(
                {
                    error:
                        "Belum ada selection dari client.",
                },
                {
                    status: 422,
                }
            );
        }

        /*
        |--------------------------------------------------------------------------
        | 5. Current selection status
        |--------------------------------------------------------------------------
        */

        const currentStatus =
            selection.status as SelectionStatus;

        /*
        |--------------------------------------------------------------------------
        | 6. Pastikan status valid
        |--------------------------------------------------------------------------
        */

        if (
            !allowedStatuses.includes(
                currentStatus
            )
        ) {
            return NextResponse.json(
                {
                    error:
                        `Status selection "${selection.status}" tidak dikenali.`,
                },
                {
                    status: 422,
                }
            );
        }

        /*
        |--------------------------------------------------------------------------
        | 7. DONE tidak boleh diubah
        |--------------------------------------------------------------------------
        */

        if (
            currentStatus ===
            "done"
        ) {
            return NextResponse.json(
                {
                    error:
                        "Selection sudah berstatus DONE.",
                },
                {
                    status: 422,
                }
            );
        }

        /*
        |--------------------------------------------------------------------------
        | 8. Validasi transition
        |--------------------------------------------------------------------------
        */

        const expectedNext =
            transitions[
                currentStatus
            ];

        if (
            expectedNext !==
            nextStatus
        ) {
            return NextResponse.json(
                {
                    error:
                        `Perubahan status tidak valid. Status saat ini: ${currentStatus}. Status berikutnya: ${expectedNext}.`,
                },
                {
                    status: 422,
                }
            );
        }

        /*
        |--------------------------------------------------------------------------
        | 9. Update album_selections
        |--------------------------------------------------------------------------
        */

        const {
            data: updatedSelection,
            error: updateError,
        } = await supabase
            .from(
                "album_selections"
            )
            .update({
                status:
                    nextStatus,
                updated_at:
                    new Date().toISOString(),
            })
            .eq(
                "id",
                selection.id
            )
            .select(`
                id,
                album_id,
                selected_count,
                status,
                submitted_at,
                updated_at
            `)
            .single();

        if (updateError) {
            console.error(
                "UPDATE SELECTION ERROR:",
                updateError
            );

            return NextResponse.json(
                {
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
        | 10. Success
        |--------------------------------------------------------------------------
        */

        return NextResponse.json({
            success: true,

            message:
                "Status selection berhasil diperbarui.",

            selection:
                updatedSelection,
        });

    } catch (error) {
        console.error(
            "UPDATE SELECTION STATUS ERROR:",
            error
        );

        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Gagal mengubah status selection.",
            },
            {
                status: 500,
            }
        );
    }
}