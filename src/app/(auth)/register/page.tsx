"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const supabase = createClient();
    const router = useRouter();

    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    async function handleRegister(
        event: FormEvent<HTMLFormElement>
    ) {
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

        setSuccess(
            "Registrasi berhasil. Silakan cek email Anda."
        );

        setLoading(false);

        setTimeout(() => {
            router.push("/login");
        }, 2000);
    }

    return (
        <main className="flex min-h-screen items-center justify-center p-6">
            <div className="w-full max-w-md">

                <h1 className="mb-2 text-3xl font-bold">
                    Create Account
                </h1>

                <p className="mb-8 text-gray-500">
                    Daftar sebagai client
                </p>

                <form
                    onSubmit={handleRegister}
                    className="space-y-4"
                >

                    <input
                        type="text"
                        placeholder="Nama lengkap"
                        value={fullName}
                        onChange={(e) =>
                            setFullName(e.target.value)
                        }
                        required
                        className="w-full rounded-lg border p-3"
                    />

                    <input
                        type="text"
                        placeholder="Nomor WhatsApp"
                        value={phone}
                        onChange={(e) =>
                            setPhone(e.target.value)
                        }
                        className="w-full rounded-lg border p-3"
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        required
                        className="w-full rounded-lg border p-3"
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        required
                        minLength={6}
                        className="w-full rounded-lg border p-3"
                    />

                    {error && (
                        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="rounded-lg bg-green-50 p-3 text-sm text-green-600">
                            {success}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-black p-3 text-white disabled:opacity-50"
                    >
                        {loading
                            ? "Mendaftarkan..."
                            : "Daftar"}
                    </button>

                </form>

            </div>
        </main>
    );
}