"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import { useAuth } from "@/lib/AuthContext";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        const result = await login(email, password);

        if (result.success) {
            router.push("/dashboard");
        } else {
            setError(result.error || "Login failed");
        }

        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <Card className="w-full max-w-md">

                <div className="flex items-center justify-center gap-2 mb-8">
                    <Image src="/logo.png" alt="Uptime" width={40} height={40} className="w-10 h-10 rounded-lg" />
                    <span className="text-2xl font-bold text-primary">Uptime</span>
                </div>

                <h1 className="text-2xl font-bold text-primary text-center mb-2">
                    Welcome Back
                </h1>
                <p className="text-secondary text-center mb-8">
                    Sign in to your account
                </p>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <Input
                        label="Email"
                        type="email"
                        placeholder="you@example.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />



                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                </form>

                <p className="mt-6 text-center text-sm text-secondary">
                    Don&apos;t have an account?{" "}
                    <Link href="/register" className="text-accent hover:text-secondary font-medium transition-colors">
                        Sign up
                    </Link>
                </p>
            </Card>
        </div>
    );
}
