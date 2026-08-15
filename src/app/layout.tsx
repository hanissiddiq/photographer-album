import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    variable: "--font-space-grotesk",
    weight: ["500", "600", "700"],
});

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

export const metadata: Metadata = {
    title: "Pilihin.app — Photo Selection untuk Fotografer",
    description:
        "Kelola album foto, bagikan link publik, dan biarkan klien memilih foto favorit mereka.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="id">
            <body
                className={`${spaceGrotesk.variable} ${inter.variable} antialiased`}
            >
                {children}
            </body>
        </html>
    );
}
