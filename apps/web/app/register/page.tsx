"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import { useAuth } from "@/lib/AuthContext";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setIsLoading(true);

        const result = await register(email, password);

        if (result.success) {
            router.push("/dashboard");
        } else {
            setError(result.error || "Registration failed");
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
                    Create Account
                </h1>
                <p className="text-secondary text-center mb-8">
                    Start monitoring your websites today
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
                    <Input
                        label="Confirm Password"
                        type="password"
                        placeholder="••••••••"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    <p className="text-xs text-secondary">
                        Password must be at least 6 characters with a letter, number, and special character.
                    </p>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Creating Account..." : "Create Account"}
                    </Button>
                </form>

                <p className="mt-6 text-center text-sm text-secondary">
                    Already have an account?{" "}
                    <Link href="/login" className="text-accent hover:text-secondary font-medium transition-colors">
                        Sign in
                    </Link>
                </p>
            </Card>
        </div>
    );
}
