import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar />

            {/* Main content area */}
            <main className="flex-1 md:ml-0">
                {/* Top bar */}
                <header className="sticky top-0 z-40 bg-background border-b border-light/30 px-6 py-3">
                    <div className="flex items-center justify-between">
                        {/* Left - Navigation links (visible on desktop) */}
                        <nav className="hidden md:flex items-center gap-6">
                            <a href="/dashboard" className="text-sm font-medium text-primary hover:text-accent">
                                Dashboard
                            </a>
                            <a href="/dashboard/monitors" className="text-sm font-medium text-secondary hover:text-accent">
                                Monitors
                            </a>
                            <a href="/dashboard/incidents" className="text-sm font-medium text-secondary hover:text-accent">
                                Incidents
                            </a>
                        </nav>

                        {/* Right - User actions */}
                        <div className="flex items-center gap-4 ml-auto">
                            {/* Notification bell */}
                            <button className="relative p-2 text-secondary hover:text-primary hover:bg-surface rounded-lg transition-colors">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                            </button>

                            {/* User menu */}
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-accent rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <span className="hidden sm:block text-sm font-medium text-primary">John Doe</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <div className="p-6 pb-24 md:pb-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
