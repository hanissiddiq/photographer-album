"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
    const supabase = createClient();
    const router = useRouter();

    async function handleLogout() {
        await supabase.auth.signOut();

        router.push("/login");
        router.refresh();
    }

    return (
        <button
            onClick={handleLogout}
            // className="rounded-lg border px-4 py-2"
            className ="rounded-lg bg-[#c52121] px-4 py-2 text-sm font-semibold text-[var(--ink)] transition hover:bg-[#ff0000] motion-reduce:transition-none"
        >
            Logout
        </button>
    );
}