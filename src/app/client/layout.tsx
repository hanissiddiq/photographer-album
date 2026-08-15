import Navbar from "@/components/layout/Navbar";

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // TODO: ganti albumProgress dengan data pilihan foto aktual klien
    return (
        <>
            <Navbar role="client" albumProgress={{ selected: 8, quota: 20 }} />
            <main className="min-h-screen bg-[var(--paper)]">{children}</main>
        </>
    );
}
