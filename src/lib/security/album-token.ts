import crypto from "crypto";

export function generateAlbumToken(): string {
    return crypto.randomBytes(32).toString("base64url");
}

export function hashAlbumToken(token: string): string {
    return crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
}