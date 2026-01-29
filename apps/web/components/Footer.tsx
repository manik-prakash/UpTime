import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-primary text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <img src="/logo.png" alt="Uptime" className="w-8 h-8 rounded-lg" />
                            <span className="text-xl font-bold">Uptime</span>
                        </div>
                        <p className="text-light/80 max-w-md">
                            Monitor your websites from multiple regions. Get instant alerts when
                            your sites go down.
                        </p>
                    </div>


                    <div>
                        <h4 className="font-semibold mb-4">Product</h4>
                        <ul className="space-y-2 text-light/80">
                            <li>
                                <Link href="#features" className="hover:text-white transition-colors">
                                    Features
                                </Link>
                            </li>
                            <li>
                                <Link href="#how-it-works" className="hover:text-white transition-colors">
                                    How it Works
                                </Link>
                            </li>
                            <li>
                                <Link href="/login" className="hover:text-white transition-colors">
                                    Login
                                </Link>
                            </li>
                        </ul>
                    </div>


                    <div>
                        <h4 className="font-semibold mb-4">Support</h4>
                        <ul className="space-y-2 text-light/80">
                            <li>
                                <Link href="#" className="hover:text-white transition-colors">
                                    Documentation
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-white transition-colors">
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-white transition-colors">
                                    Status
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>


                <div className="mt-12 pt-8 border-t border-secondary text-center text-light/60 text-sm">
                    <p>&copy; {new Date().getFullYear()} Uptime. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
