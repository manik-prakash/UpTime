import Link from "next/link";
import Button from "./ui/Button";

export default function Navbar() {
    return (
        <nav className="bg-primary text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-white"
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
                        <span className="text-xl font-bold">Uptime</span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="#features" className="hover:text-light transition-colors">
                            Features
                        </Link>
                        <Link href="#how-it-works" className="hover:text-light transition-colors">
                            How it Works
                        </Link>
                    </div>

                    {/* Auth Buttons */}
                    <div className="flex items-center gap-3">
                        <Link href="/login">
                            <Button variant="outline" size="sm" className="border-white text-white hover:bg-white hover:text-primary">
                                Login
                            </Button>
                        </Link>
                        <Link href="/register">
                            <Button size="sm">Get Started</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
