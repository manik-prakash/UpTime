"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
    {
        label: "Dashboard",
        href: "/dashboard",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
        ),
    },
    {
        label: "Monitors",
        href: "/dashboard/monitors",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.321A1 1 0 0113 17H7a1 1 0 01-.64-1.768l.804-.32.122-.49H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
            </svg>
        ),
    },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <>

            <aside className="hidden md:flex flex-col w-64 bg-primary min-h-screen">

                <div className="p-5 border-b border-secondary/50">
                    <Link href="/dashboard" className="flex items-center gap-2.5 text-white">
                        <img src="/logo.png" alt="Uptime" className="w-8 h-8 rounded-lg" />
                        <span className="text-lg font-bold">Uptime</span>
                    </Link>
                </div>


                <nav className="flex-1 p-4">
                    <ul className="space-y-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className={`
                                            flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors
                                            ${isActive
                                                ? "bg-accent text-white"
                                                : "text-light hover:bg-secondary/50 hover:text-white"
                                            }
                                        `}
                                    >
                                        {item.icon}
                                        <span className="font-medium">{item.label}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

            </aside>


            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-primary border-t border-secondary/50 z-50">
                <ul className="flex justify-around">
                    {navItems.slice(0, 4).map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`
                                        flex flex-col items-center gap-1 px-4 py-3 transition-colors
                                        ${isActive ? "text-accent" : "text-light"}
                                    `}
                                >
                                    {item.icon}
                                    <span className="text-xs font-medium">{item.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </>
    );
}
