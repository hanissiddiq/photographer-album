import Link from "next/link";

interface AuthBrandPanelProps {
    eyebrow: string;
    title: string;
    description: string;
}

/**
 * Panel kiri pada halaman login/register.
 * Disembunyikan di layar mobile (< lg) - form jadi fokus utama di layar kecil.
 */
export default function AuthBrandPanel({
    eyebrow,
    title,
    description,
}: AuthBrandPanelProps) {
    return (
        <div className="relative hidden overflow-hidden bg-[var(--ink)] lg:flex lg:flex-col lg:justify-between lg:p-12">
            {/* Grid tipis ala contact-sheet di latar belakang */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.06]"
                style={{
                    backgroundImage:
                        "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
                    backgroundSize: "44px 44px",
                }}
            />

            <Link href="/" className="relative flex items-center gap-2.5">
                <FrameMark />
                <span className="font-display text-lg font-semibold tracking-tight text-[var(--paper)]">
                    pilihin<span className="text-[var(--proof)]">.</span>
                </span>
            </Link>

            <div className="relative max-w-md">
                <p className="text-sm font-medium text-[var(--proof)]">{eyebrow}</p>
                <h2 className="font-display mt-3 text-3xl font-semibold leading-tight text-[var(--paper)] xl:text-4xl">
                    {title}
                </h2>
                <p className="mt-4 text-[15px] leading-relaxed text-[var(--fog)]">
                    {description}
                </p>
            </div>

            <div className="relative flex items-center gap-6 text-xs text-[var(--fog)]">
                <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--signal)]" />
                    Album tersinkron Google Drive
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--proof)]" />
                    Link publik aman berbasis token
                </span>
            </div>
        </div>
    );
}

function FrameMark() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M3 8V4.5A1.5 1.5 0 0 1 4.5 3H8" stroke="var(--proof)" strokeWidth="2" strokeLinecap="round" />
            <path d="M16 3h3.5A1.5 1.5 0 0 1 21 4.5V8" stroke="var(--proof)" strokeWidth="2" strokeLinecap="round" />
            <path d="M21 16v3.5a1.5 1.5 0 0 1-1.5 1.5H16" stroke="var(--proof)" strokeWidth="2" strokeLinecap="round" />
            <path d="M8 21H4.5A1.5 1.5 0 0 1 3 19.5V16" stroke="var(--proof)" strokeWidth="2" strokeLinecap="round" />
            <circle cx="12" cy="12" r="3.2" stroke="var(--paper)" strokeWidth="1.6" />
        </svg>
    );
}
