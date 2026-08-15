import Navbar from "@/components/layout/Navbar";

export default function PhotographerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // TODO: ganti userName dengan data profil dari session Supabase
    return (
        <>
            <Navbar role="photographer" userName="Fotografer" />
            <main className="min-h-screen bg-[var(--paper)]">{children}</main>
        </>
    );
}
