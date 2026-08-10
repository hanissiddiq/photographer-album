import Link from "next/link";
import LogoutButton from "@/components/auth/LogoutButton";

export default function PhotographerNav() {
    return (
        <nav className="border-b bg-white">

            <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">

                <Link
                    href="/photographer/dashboard"
                    className="font-bold"
                >
                    PhotoStudio
                </Link>

                <div className="flex items-center gap-6">

                    <Link
                        href="/photographer/dashboard"
                        className="text-sm"
                    >
                        Dashboard
                    </Link>

                    <Link
                        href="/photographer/albums"
                        className="text-sm"
                    >
                        Albums
                    </Link>

                    <LogoutButton />

                </div>

            </div>

        </nav>
    );
}