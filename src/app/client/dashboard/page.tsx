import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function ClientDashboard() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    if (!profile || profile.role !== "client") {
        redirect("/login");
    }

    return (
        <main className="min-h-screen p-8">

            <h1 className="text-3xl font-bold">
                Client Dashboard
            </h1>

            <p className="mt-2 text-gray-500">
                Selamat datang, {profile.full_name}
            </p>

        </main>
    );
}