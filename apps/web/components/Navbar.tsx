import Image from "next/image";
import Link from "next/link";
import Button from "./ui/Button";

export default function Navbar() {
    return (
        <nav className="bg-primary text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    <Link href="/" className="flex items-center gap-2">
                        <Image src="/logo.png" alt="Uptime" width={32} height={32} className="w-8 h-8 rounded-lg" />
                        <span className="text-xl font-bold">Uptime</span>
                    </Link>


                    <div className="hidden md:flex items-center gap-8">
                        <Link href="#features" className="hover:text-light transition-colors">
                            Features
                        </Link>
                        <Link href="#how-it-works" className="hover:text-light transition-colors">
                            How it Works
                        </Link>
                    </div>


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
