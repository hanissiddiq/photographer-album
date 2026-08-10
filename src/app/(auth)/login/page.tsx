"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const supabase = createClient();
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleLogin(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setLoading(true);
        setError("");

        const { data, error } =
            await supabase.auth.signInWithPassword({
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
        <main className="flex min-h-screen items-center justify-center p-6">

            <div className="w-full max-w-md">

                <h1 className="mb-2 text-3xl font-bold">
                    Photographer Album
                </h1>

                <p className="mb-8 text-gray-500">
                    Login ke akun Anda
                </p>

                <form
                    onSubmit={handleLogin}
                    className="space-y-4"
                >

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
                        className="w-full rounded-lg border p-3"
                    />

                    {error && (
                        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-black p-3 text-white disabled:opacity-50"
                    >
                        {loading
                            ? "Login..."
                            : "Login"}
                    </button>

                </form>

            </div>

        </main>
    );
}