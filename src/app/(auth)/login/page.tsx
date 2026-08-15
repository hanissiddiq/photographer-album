// "use client";

// import { FormEvent, useState } from "react";
// import { createClient } from "@/lib/supabase/client";
// import { useRouter } from "next/navigation";

// export default function LoginPage() {
//     const supabase = createClient();
//     const router = useRouter();

//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");

//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState("");

//     async function handleLogin(
//         event: FormEvent<HTMLFormElement>
//     ) {
//         event.preventDefault();

//         setLoading(true);
//         setError("");

//         const { data, error } =
//             await supabase.auth.signInWithPassword({
//                 email,
//                 password,
//             });

//         if (error) {
//             setError(error.message);
//             setLoading(false);
//             return;
//         }

//         if (!data.user) {
//             setError("User tidak ditemukan.");
//             setLoading(false);
//             return;
//         }

//         const { data: profile } = await supabase
//             .from("profiles")
//             .select("role")
//             .eq("id", data.user.id)
//             .single();

//         if (profile?.role === "photographer") {
//             router.push("/photographer/dashboard");
//         } else {
//             router.push("/client/dashboard");
//         }

//         router.refresh();
//     }

//     return (
//         <main className="flex min-h-screen items-center justify-center p-6">

//             <div className="w-full max-w-md">

//                 <h1 className="mb-2 text-3xl font-bold">
//                     Photographer Album
//                 </h1>

//                 <p className="mb-8 text-gray-500">
//                     Login ke akun Anda
//                 </p>

//                 <form
//                     onSubmit={handleLogin}
//                     className="space-y-4"
//                 >

//                     <input
//                         type="email"
//                         placeholder="Email"
//                         value={email}
//                         onChange={(e) =>
//                             setEmail(e.target.value)
//                         }
//                         required
//                         className="w-full rounded-lg border p-3"
//                     />

//                     <input
//                         type="password"
//                         placeholder="Password"
//                         value={password}
//                         onChange={(e) =>
//                             setPassword(e.target.value)
//                         }
//                         required
//                         className="w-full rounded-lg border p-3"
//                     />

//                     {error && (
//                         <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
//                             {error}
//                         </div>
//                     )}

//                     <button
//                         type="submit"
//                         disabled={loading}
//                         className="w-full rounded-lg bg-black p-3 text-white disabled:opacity-50"
//                     >
//                         {loading
//                             ? "Login..."
//                             : "Login"}
//                     </button>

//                 </form>

//             </div>

//         </main>
//     );
// }


// ================== Modif UI From Claude =======
"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import AuthBrandPanel from "@/components/auth/AuthBrandPanel";

export default function LoginPage() {
    const supabase = createClient();
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleLogin(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setLoading(true);
        setError("");

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        if (!data.user) {
            setError("User tidak ditemukan.");
            setLoading(false);
            return;
        }

        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", data.user.id)
            .single();

        if (profile?.role === "photographer") {
            router.push("/photographer/dashboard");
        } else {
            router.push("/client/dashboard");
        }

        router.refresh();
    }

    return (
        <main className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
            <AuthBrandPanel
                eyebrow="Selamat datang kembali"
                title="Setiap sesi punya cerita. Pilih yang paling berarti."
                description="Kelola album, bagikan link galeri, dan lihat pilihan klien Anda — semua dalam satu dashboard."
            />

            {/* FORM PANEL */}
            <div className="flex items-center justify-center bg-[var(--paper)] px-6 py-12 sm:px-10">
                <div className="w-full max-w-sm">
                    {/* Brand mark - mobile only, brand panel disembunyikan di layar kecil */}
                    <Link href="/" className="mb-10 flex items-center gap-2 lg:hidden">
                        <FrameMark />
                        <span className="font-display text-lg font-semibold tracking-tight text-neutral-900">
                            pilihin<span className="text-[var(--proof)]">.</span>
                        </span>
                    </Link>

                    <h1 className="text-2xl font-bold text-neutral-900">
                        Masuk ke akun Anda
                    </h1>
                    <p className="mt-2 text-sm text-[var(--slate)]">
                        Belum punya akun?{" "}
                        <Link
                            href="/register"
                            className="font-medium text-neutral-900 underline underline-offset-4"
                        >
                            Daftar sebagai klien
                        </Link>
                    </p>

                    <form onSubmit={handleLogin} className="mt-8 space-y-4">
                        <div>
                            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-neutral-700">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="nama@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full rounded-lg border border-neutral-300 bg-white p-3 text-sm text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-neutral-700">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Masukkan password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full rounded-lg border border-neutral-300 bg-white p-3 pr-11 text-sm text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-neutral-400 hover:text-neutral-700"
                                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                                >
                                    <EyeIcon open={showPassword} />
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-900 p-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading && <Spinner />}
                            {loading ? "Memproses..." : "Masuk"}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-xs text-neutral-400">
                        Klien dengan link album publik tidak perlu login — cukup buka link yang
                        dikirim fotografer Anda.
                    </p>
                </div>
            </div>
        </main>
    );
}

function FrameMark() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M3 8V4.5A1.5 1.5 0 0 1 4.5 3H8" stroke="var(--proof)" strokeWidth="2" strokeLinecap="round" />
            <path d="M16 3h3.5A1.5 1.5 0 0 1 21 4.5V8" stroke="var(--proof)" strokeWidth="2" strokeLinecap="round" />
            <path d="M21 16v3.5a1.5 1.5 0 0 1-1.5 1.5H16" stroke="var(--proof)" strokeWidth="2" strokeLinecap="round" />
            <path d="M8 21H4.5A1.5 1.5 0 0 1 3 19.5V16" stroke="var(--proof)" strokeWidth="2" strokeLinecap="round" />
            <circle cx="12" cy="12" r="3.1" stroke="#14131a" strokeWidth="1.6" />
        </svg>
    );
}

function EyeIcon({ open }: { open: boolean }) {
    return open ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
                d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.4 5.5A10.6 10.6 0 0121 12c-.7 1.3-1.6 2.5-2.7 3.5M6.2 6.7C4.3 8 2.9 9.8 2 12c1.8 4 5.6 7 10 7 1.3 0 2.6-.3 3.7-.7"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
                d="M2 12c1.8-4 5.6-7 10-7s8.2 3 10 7c-1.8 4-5.6 7-10 7s-8.2-3-10-7z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
            />
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
        </svg>
    );
}

function Spinner() {
    return (
        <svg className="h-4 w-4 animate-spin motion-reduce:animate-none" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.25" />
            <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
    );
}
