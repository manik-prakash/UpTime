"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/lib/AuthContext";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isLoggedIn, isLoading, user, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isLoggedIn) {
            router.push("/login");
        }
    }, [isLoading, isLoggedIn, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-secondary">Loading...</div>
            </div>
        );
    }

    if (!isLoggedIn) {
        return null;
    }

    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar />

            <main className="flex-1 md:ml-0">
                <header className="sticky top-0 z-40 bg-background border-b border-light/30 px-6 py-3">
                    <div className="flex items-center justify-end w-full">

                        <div className="flex items-center gap-4">

                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-accent rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <span className="hidden sm:block text-sm font-medium text-primary">{user?.email || "User"}</span>
                                <button
                                    onClick={logout}
                                    className="text-sm text-secondary hover:text-primary transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-6 pb-24 md:pb-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
