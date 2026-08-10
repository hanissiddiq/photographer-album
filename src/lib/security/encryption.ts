import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";

function getKey() {
    const key = process.env.APP_ENCRYPTION_KEY;

    if (!key) {
        throw new Error(
            "APP_ENCRYPTION_KEY belum dikonfigurasi."
        );
    }

    return Buffer.from(key, "hex");
}

export function encrypt(text: string) {
    const iv = crypto.randomBytes(12);

    const cipher = crypto.createCipheriv(
        ALGORITHM,
        getKey(),
        iv
    );

    const encrypted = Buffer.concat([
        cipher.update(text, "utf8"),
        cipher.final(),
    ]);

    const authTag = cipher.getAuthTag();

    return [
        iv.toString("hex"),
        authTag.toString("hex"),
        encrypted.toString("hex"),
    ].join(":");
}

export function decrypt(value: string) {
    const [ivHex, authTagHex, encryptedHex] =
        value.split(":");

    const decipher = crypto.createDecipheriv(
        ALGORITHM,
        getKey(),
        Buffer.from(ivHex, "hex")
    );

    decipher.setAuthTag(
        Buffer.from(authTagHex, "hex")
    );

    const decrypted = Buffer.concat([
        decipher.update(
            Buffer.from(encryptedHex, "hex")
        ),
        decipher.final(),
    ]);

    return decrypted.toString("utf8");
}