"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import LogoutButton from "../auth/LogoutButton";

type Role = "photographer" | "client";

interface NavLink {
    label: string;
    href: string;
}

const PHOTOGRAPHER_LINKS: NavLink[] = [
    { label: "Dashboard", href: "/photographer/dashboard" },
    { label: "Album", href: "/photographer/albums" },
    { label: "Google Drive", href: "/photographer/settings/google-drive" },
    { label: "Pengaturan", href: "/photographer/settings" },
];

const CLIENT_LINKS: NavLink[] = [
    { label: "Album Saya", href: "/client/dashboard" },
    { label: "Progres Pekerjaan", href: "/client/progress" },
];

interface AlbumProgress {
    selected: number;
    quota: number;
}

interface NavbarProps {
    role: Role;
    userName?: string;
    albumProgress?: AlbumProgress;
    onLogout?: () => void;
}

export default function Navbar({
    role,
    userName = "Fotografer",
    albumProgress,
    onLogout,
}: NavbarProps) {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    const links =
        role === "photographer"
            ? PHOTOGRAPHER_LINKS
            : CLIENT_LINKS;

    const homeHref =
        role === "photographer"
            ? "/photographer/dashboard"
            : "/client/dashboard";

    // Tutup drawer ketika route berubah
    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    // Lock body scroll ketika drawer terbuka
    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        function handleKey(e: KeyboardEvent) {
            if (e.key === "Escape") {
                setOpen(false);
            }
        }

        window.addEventListener("keydown", handleKey);

        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", handleKey);
        };
    }, [open]);

    function isActive(href: string) {
        return (
            pathname === href ||
            pathname?.startsWith(href + "/")
        );
    }

    return (
        <>
            {/* =====================================================
                HEADER
            ====================================================== */}
            <header className="sticky top-0 z-50 border-b-2 border-[var(--proof)] bg-[var(--ink)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--ink)]/85">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">

                    {/* Brand */}
                    <Link
                        href={homeHref}
                        className="flex shrink-0 items-center gap-2 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--proof)]"
                    >
                        <FrameMark />

                        <span className="font-display text-lg font-semibold tracking-tight text-[var(--paper)]">
                            pilihin
                            <span className="text-[var(--proof)]">.</span>
                        </span>
                    </Link>

                    {/* =================================================
                        DESKTOP NAV
                    ================================================== */}
                    <nav className="hidden md:flex md:items-center md:gap-1">
                        {links.map((link) => {
                            const active = isActive(link.href);

                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    aria-current={
                                        active ? "page" : undefined
                                    }
                                    className={`relative px-3.5 py-2 text-sm font-medium transition-colors motion-reduce:transition-none ${
                                        active
                                            ? "text-[var(--paper)]"
                                            : "text-[var(--fog)] hover:text-[var(--paper)]"
                                    }`}
                                >
                                    {active && <ActiveMarks />}
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* =================================================
                        DESKTOP ACTION
                    ================================================== */}
                    <div className="hidden shrink-0 md:flex md:items-center md:gap-3">
                        {role === "photographer" ? (
                            <>
                                <Link
                                    href="/photographer/albums/new"
                                    className="rounded-lg bg-[var(--proof)] px-4 py-2 text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--proof-strong)]"
                                >
                                    + Album Baru
                                </Link>

                                <button
                                    type="button"
                                    title={userName}
                                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-[var(--paper)] transition hover:bg-white/15"
                                >
                                    {userName
                                        .trim()
                                        .charAt(0)
                                        .toUpperCase() || "F"}
                                </button>
                                <LogoutButton />
                            </>
                        ) : (
                            <>
                                {albumProgress && (
                                    <span className="rounded-full border border-[var(--signal)]/40 bg-[var(--signal)]/10 px-3 py-1.5 text-xs font-medium text-[var(--signal)]">
                                        {albumProgress.selected}/
                                        {albumProgress.quota} dipilih
                                    </span>
                                )}

                                <LogoutButton />
                            </>
                        )}
                    </div>

                    {/* =================================================
                        MOBILE HAMBURGER
                    ================================================== */}
                    <button
                        type="button"
                        aria-label={
                            open
                                ? "Tutup menu"
                                : "Buka menu"
                        }
                        aria-expanded={open}
                        aria-controls="mobile-nav-panel"
                        onClick={() =>
                            setOpen((value) => !value)
                        }
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-[var(--paper)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--proof)] md:hidden"
                    >
                        <BurgerIcon open={open} />
                    </button>
                </div>
            </header>

            {/* =====================================================
                MOBILE DRAWER

                PENTING:
                Drawer berada DI LUAR <header>
            ====================================================== */}
            <div
                id="mobile-nav-panel"
                className={`fixed inset-0 z-[100] md:hidden ${
                    open
                        ? "pointer-events-auto"
                        : "pointer-events-none"
                }`}
            >
                {/* Overlay */}
                <div
                    onClick={() => setOpen(false)}
                    aria-hidden="true"
                    className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 motion-reduce:transition-none ${
                        open
                            ? "opacity-100"
                            : "opacity-0"
                    }`}
                />

                {/* Drawer */}
                <aside
                    className={`absolute right-0 top-0 flex h-full w-[82%] max-w-xs flex-col bg-[var(--ink)] shadow-2xl transition-transform duration-300 motion-reduce:transition-none ${
                        open
                            ? "translate-x-0"
                            : "translate-x-full"
                    }`}
                >
                    {/* =================================================
                        DRAWER HEADER
                    ================================================== */}
                    <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-5">
                        <span className="font-display text-base font-semibold text-[var(--paper)]">
                            Menu
                        </span>

                        <button
                            type="button"
                            aria-label="Tutup menu"
                            onClick={() =>
                                setOpen(false)
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--paper)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--proof)]"
                        >
                            <BurgerIcon open={true} />
                        </button>
                    </div>

                    {/* =================================================
                        MOBILE NAVIGATION

                        HARUS flex-col
                    ================================================== */}
                    <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
                        {links.map((link) => {
                            const active = isActive(link.href);

                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    aria-current={
                                        active
                                            ? "page"
                                            : undefined
                                    }
                                    onClick={() =>
                                        setOpen(false)
                                    }
                                    className={`relative block rounded-lg px-4 py-3 text-base font-medium transition-colors motion-reduce:transition-none ${
                                        active
                                            ? "border-l-4 border-[var(--proof)] bg-white/10 pl-3.5 text-[var(--paper)]"
                                            : "text-[var(--fog)] hover:bg-white/5 hover:text-[var(--paper)]"
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* =================================================
                        DRAWER BOTTOM ACTION
                    ================================================== */}
                    <div
                        className="shrink-0 border-t border-white/10 p-4"
                        style={{
                            paddingBottom:
                                "max(1rem, env(safe-area-inset-bottom))",
                        }}
                    >
                        {role === "photographer" ? (
                            <>
                            <Link
                                href="/photographer/albums/new"
                                onClick={() =>
                                    setOpen(false)
                                }
                                className="block w-full rounded-lg mb-3 bg-[var(--proof)] px-4 py-3 text-center text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--proof-strong)]"
                            >
                                + Album Baru
                            </Link>
                            <LogoutButton /></>
                        ) : (
                            <>
                                {albumProgress && (
                                    <p className="mb-3 text-center text-sm font-medium text-[var(--signal)]">
                                        {albumProgress.selected}/
                                        {albumProgress.quota}{" "}
                                        foto dipilih
                                    </p>
                                )}

                                <LogoutButton />
                            </>
                        )}
                    </div>
                </aside>
            </div>
        </>
    );
}

/**
 * Logo mark
 */
function FrameMark() {
    return (
        <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            className="shrink-0"
        >
            <path
                d="M3 8V4.5A1.5 1.5 0 0 1 4.5 3H8"
                stroke="var(--proof)"
                strokeWidth="2"
                strokeLinecap="round"
            />

            <path
                d="M16 3h3.5A1.5 1.5 0 0 1 21 4.5V8"
                stroke="var(--proof)"
                strokeWidth="2"
                strokeLinecap="round"
            />

            <path
                d="M21 16v3.5a1.5 1.5 0 0 1-1.5 1.5H16"
                stroke="var(--proof)"
                strokeWidth="2"
                strokeLinecap="round"
            />

            <path
                d="M8 21H4.5A1.5 1.5 0 0 1 3 19.5V16"
                stroke="var(--proof)"
                strokeWidth="2"
                strokeLinecap="round"
            />

            <circle
                cx="12"
                cy="12"
                r="3.1"
                stroke="var(--paper)"
                strokeWidth="1.6"
            />
        </svg>
    );
}

/**
 * Active navigation marks
 */
function ActiveMarks() {
    return (
        <>
            <span className="pointer-events-none absolute left-0 top-0 h-2 w-2 border-l-2 border-t-2 border-[var(--proof)]" />

            <span className="pointer-events-none absolute right-0 top-0 h-2 w-2 border-r-2 border-t-2 border-[var(--proof)]" />

            <span className="pointer-events-none absolute bottom-0 left-0 h-2 w-2 border-b-2 border-l-2 border-[var(--proof)]" />

            <span className="pointer-events-none absolute bottom-0 right-0 h-2 w-2 border-b-2 border-r-2 border-[var(--proof)]" />
        </>
    );
}

/**
 * Hamburger / Close icon
 */
function BurgerIcon({ open }: { open: boolean }) {
    return (
        <span className="relative block h-4 w-5">
            <span
                className={`absolute left-0 top-0 h-0.5 w-5 bg-current transition-transform duration-300 motion-reduce:transition-none ${
                    open
                        ? "translate-y-[7px] rotate-45"
                        : ""
                }`}
            />

            <span
                className={`absolute left-0 top-[7px] h-0.5 w-5 bg-current transition-opacity duration-200 motion-reduce:transition-none ${
                    open
                        ? "opacity-0"
                        : "opacity-100"
                }`}
            />

            <span
                className={`absolute bottom-0 left-0 h-0.5 w-5 bg-current transition-transform duration-300 motion-reduce:transition-none ${
                    open
                        ? "-translate-y-[7px] -rotate-45"
                        : ""
                }`}
            />
        </span>
    );
}