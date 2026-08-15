// "use client";

// import { FormEvent, useState } from "react";
// import { createClient } from "@/lib/supabase/client";
// import { useRouter } from "next/navigation";

// export default function RegisterPage() {
//     const supabase = createClient();
//     const router = useRouter();

//     const [fullName, setFullName] = useState("");
//     const [phone, setPhone] = useState("");
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");

//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState("");
//     const [success, setSuccess] = useState("");

//     async function handleRegister(
//         event: FormEvent<HTMLFormElement>
//     ) {
//         event.preventDefault();

//         setLoading(true);
//         setError("");
//         setSuccess("");

//         const { error } = await supabase.auth.signUp({
//             email,
//             password,

//             options: {
//                 data: {
//                     full_name: fullName,
//                     phone,
//                 },
//             },
//         });

//         if (error) {
//             setError(error.message);
//             setLoading(false);
//             return;
//         }

//         setSuccess(
//             "Registrasi berhasil. Silakan cek email Anda."
//         );

//         setLoading(false);

//         setTimeout(() => {
//             router.push("/login");
//         }, 2000);
//     }

//     return (
//         <main className="flex min-h-screen items-center justify-center p-6">
//             <div className="w-full max-w-md">

//                 <h1 className="mb-2 text-3xl font-bold">
//                     Create Account
//                 </h1>

//                 <p className="mb-8 text-gray-500">
//                     Daftar sebagai client
//                 </p>

//                 <form
//                     onSubmit={handleRegister}
//                     className="space-y-4"
//                 >

//                     <input
//                         type="text"
//                         placeholder="Nama lengkap"
//                         value={fullName}
//                         onChange={(e) =>
//                             setFullName(e.target.value)
//                         }
//                         required
//                         className="w-full rounded-lg border p-3"
//                     />

//                     <input
//                         type="text"
//                         placeholder="Nomor WhatsApp"
//                         value={phone}
//                         onChange={(e) =>
//                             setPhone(e.target.value)
//                         }
//                         className="w-full rounded-lg border p-3"
//                     />

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
//                         minLength={6}
//                         className="w-full rounded-lg border p-3"
//                     />

//                     {error && (
//                         <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
//                             {error}
//                         </div>
//                     )}

//                     {success && (
//                         <div className="rounded-lg bg-green-50 p-3 text-sm text-green-600">
//                             {success}
//                         </div>
//                     )}

//                     <button
//                         type="submit"
//                         disabled={loading}
//                         className="w-full rounded-lg bg-black p-3 text-white disabled:opacity-50"
//                     >
//                         {loading
//                             ? "Mendaftarkan..."
//                             : "Daftar"}
//                     </button>

//                 </form>

//             </div>
//         </main>
//     );
// }


// =============================================================
// ======================= modif ui from claude ================
// =============================================================
"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import AuthBrandPanel from "@/components/auth/AuthBrandPanel";

export default function RegisterPage() {
    const supabase = createClient();
    const router = useRouter();

    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const passwordScore = getPasswordScore(password);

    async function handleRegister(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setLoading(true);
        setError("");
        setSuccess("");

        const { error } = await supabase.auth.signUp({
            email,
            password,

            options: {
                data: {
                    full_name: fullName,
                    phone,
                },
            },
        });

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        setSuccess("Registrasi berhasil. Silakan cek email Anda.");
        setLoading(false);

        setTimeout(() => {
            router.push("/login");
        }, 2000);
    }

    return (
        <main className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
            <AuthBrandPanel
                eyebrow="Bergabung sebagai klien"
                title="Foto terbaik Anda, tinggal dipilih."
                description="Buka album dari fotografer Anda, pilih favorit dengan sekali ketuk, dan pantau progres pekerjaannya sampai selesai."
            />

            {/* FORM PANEL */}
            <div className="flex items-center justify-center bg-[var(--paper)] px-6 py-12 sm:px-10">
                <div className="w-full max-w-sm">
                    <Link href="/" className="mb-10 flex items-center gap-2 lg:hidden">
                        <FrameMark />
                        <span className="font-display text-lg font-semibold tracking-tight text-neutral-900">
                            pilihin<span className="text-[var(--proof)]">.</span>
                        </span>
                    </Link>

                    <h1 className="text-2xl font-bold text-neutral-900">Buat akun</h1>
                    <p className="mt-2 text-sm text-[var(--slate)]">
                        Sudah punya akun?{" "}
                        <Link
                            href="/login"
                            className="font-medium text-neutral-900 underline underline-offset-4"
                        >
                            Masuk di sini
                        </Link>
                    </p>

                    <form onSubmit={handleRegister} className="mt-8 space-y-4">
                        <div>
                            <label htmlFor="fullName" className="mb-1.5 block text-sm font-medium text-neutral-700">
                                Nama lengkap
                            </label>
                            <input
                                id="fullName"
                                type="text"
                                placeholder="Nama Anda"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                                className="w-full rounded-lg border border-neutral-300 bg-white p-3 text-sm text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
                            />
                        </div>

                        <div>
                            <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-neutral-700">
                                Nomor WhatsApp
                                <span className="ml-1 font-normal text-neutral-400">(opsional)</span>
                            </label>
                            <input
                                id="phone"
                                type="text"
                                placeholder="628xxxxxxxxxx"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full rounded-lg border border-neutral-300 bg-white p-3 text-sm text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
                            />
                        </div>

                        <div>
                            <label htmlFor="regEmail" className="mb-1.5 block text-sm font-medium text-neutral-700">
                                Email
                            </label>
                            <input
                                id="regEmail"
                                type="email"
                                placeholder="nama@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full rounded-lg border border-neutral-300 bg-white p-3 text-sm text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
                            />
                        </div>

                        <div>
                            <label htmlFor="regPassword" className="mb-1.5 block text-sm font-medium text-neutral-700">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="regPassword"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Minimal 6 karakter"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
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

                            {password.length > 0 && (
                                <div className="mt-2 flex items-center gap-2">
                                    <div className="flex flex-1 gap-1">
                                        {[0, 1, 2].map((i) => (
                                            <span
                                                key={i}
                                                className={`h-1 flex-1 rounded-full transition-colors ${
                                                    i < passwordScore
                                                        ? passwordScore === 1
                                                            ? "bg-red-400"
                                                            : passwordScore === 2
                                                              ? "bg-amber-400"
                                                              : "bg-[var(--signal)]"
                                                        : "bg-neutral-200"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-xs text-neutral-400">
                                        {passwordScore === 1 && "Lemah"}
                                        {passwordScore === 2 && "Cukup"}
                                        {passwordScore >= 3 && "Kuat"}
                                    </span>
                                </div>
                            )}
                        </div>

                        {error && (
                            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="rounded-lg border border-[var(--signal)]/30 bg-[var(--signal)]/10 p-3 text-sm text-[var(--signal)]">
                                {success}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-900 p-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading && <Spinner />}
                            {loading ? "Mendaftarkan..." : "Daftar"}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-xs text-neutral-400">
                        Dengan mendaftar, Anda menyetujui bahwa foto pilihan Anda akan
                        dibagikan kepada fotografer terkait.
                    </p>
                </div>
            </div>
        </main>
    );
}

function getPasswordScore(password: string) {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10 && /[0-9]/.test(password) && /[a-zA-Z]/.test(password)) score++;
    if (password.length >= 10 && /[^a-zA-Z0-9]/.test(password)) score++;
    return Math.max(1, score);
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
