import { notFound } from "next/navigation";

import { createAdminClient } from "@/lib/supabase/admin";

import {
    hashAlbumToken,
} from "@/lib/security/album-token";

export interface PublicAlbum {
    id: string;
    title: string;
    description: string | null;
    quota: number;
    expires_at: string | null;
    is_active: boolean;
}


export async function getPublicAlbumByToken(
    token: string
): Promise<PublicAlbum> {
    if (!token) {
        notFound();
    }

    const tokenHash =
        hashAlbumToken(token);

    const admin =
        createAdminClient();

    /*
    |--------------------------------------------------------------------------
    | Validate token
    |--------------------------------------------------------------------------
    */

    const { data: accessToken, error } =
        await admin
            .from("album_access_tokens")
            .select(`
                id,
                album_id,
                expires_at,
                is_active
            `)
            .eq(
                "token_hash",
                tokenHash
            )
            .eq(
                "is_active",
                true
            )
            .single();

    if (error || !accessToken) {
        notFound();
    }

    /*
    |--------------------------------------------------------------------------
    | Check token expiration
    |--------------------------------------------------------------------------
    */

    if (
        accessToken.expires_at &&
        new Date(
            accessToken.expires_at
        ).getTime() < Date.now()
    ) {
        notFound();
    }

    /*
    |--------------------------------------------------------------------------
    | Get album
    |--------------------------------------------------------------------------
    */

    const { data: album, error: albumError } =
        await admin
            .from("albums")
            .select(`
                id,
                title,
                description,
                quota,
                expires_at,
                is_active
            `)
            .eq(
                "id",
                accessToken.album_id
            )
            .eq(
                "is_active",
                true
            )
            .single();

    if (
        albumError ||
        !album
    ) {
        notFound();
    }

    /*
    |--------------------------------------------------------------------------
    | Check album expiration
    |--------------------------------------------------------------------------
    */

    if (
        album.expires_at &&
        new Date(
            album.expires_at
        ).getTime() < Date.now()
    ) {
        notFound();
    }

    /*
    |--------------------------------------------------------------------------
    | Update last access
    |--------------------------------------------------------------------------
    */

    await admin
        .from("album_access_tokens")
        .update({
            last_accessed_at:
                new Date().toISOString(),
        })
        .eq(
            "id",
            accessToken.id
        );

    return album;
}


export interface PublicAlbumAccess {
    accessTokenId: string;
    album: PublicAlbum;
}

export async function getPublicAlbumAccess(
    token: string
): Promise<PublicAlbumAccess> {
    if (!token) {
        throw new Error("Invalid album token.");
    }

    const tokenHash =
        hashAlbumToken(token);

    const admin =
        createAdminClient();

    const {
        data: accessToken,
        error: tokenError,
    } = await admin
        .from("album_access_tokens")
        .select(`
            id,
            album_id,
            expires_at,
            is_active
        `)
        .eq(
            "token_hash",
            tokenHash
        )
        .eq(
            "is_active",
            true
        )
        .single();

    if (
        tokenError ||
        !accessToken
    ) {
        throw new Error(
            "Invalid album token."
        );
    }

    if (
        accessToken.expires_at &&
        new Date(
            accessToken.expires_at
        ).getTime() < Date.now()
    ) {
        throw new Error(
            "Album link expired."
        );
    }

    const {
        data: album,
        error: albumError,
    } = await admin
        .from("albums")
        .select(`
            id,
            photographer_id,
            title,
            description,
            quota,
            expires_at,
            is_active
        `)
        .eq(
            "id",
            accessToken.album_id
        )
        .eq(
            "is_active",
            true
        )
        .single();

    if (
        albumError ||
        !album
    ) {
        throw new Error(
            "Album not found."
        );
    }

    if (
        album.expires_at &&
        new Date(
            album.expires_at
        ).getTime() < Date.now()
    ) {
        throw new Error(
            "Album expired."
        );
    }

    return {
        accessTokenId:
            accessToken.id,

        album,
    };
}