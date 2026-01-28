import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <Card className="w-full max-w-md">
                {/* Logo */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-white"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                    <span className="text-2xl font-bold text-primary">Uptime</span>
                </div>

                <h1 className="text-2xl font-bold text-primary text-center mb-2">
                    Create Account
                </h1>
                <p className="text-secondary text-center mb-8">
                    Start monitoring your websites today
                </p>

                <form className="space-y-4">
                    <Input
                        label="Email"
                        type="email"
                        placeholder="you@example.com"
                        required
                    />
                    <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        required
                    />
                    <Input
                        label="Confirm Password"
                        type="password"
                        placeholder="••••••••"
                        required
                    />

                    <Button type="submit" className="w-full">
                        Create Account
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
