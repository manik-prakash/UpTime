import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { mockStats, mockWebsites, mockTicks, Website, WebsiteTick, getTicksForWebsite } from "@/lib/mockData";

// Stat icons
const icons = {
    globe: (
        <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
    ),
    check: (
        <svg className="w-5 h-5 text-up" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    chart: (
        <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
    ),
    clock: (
        <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
};

// Stat Card Component
function StatCard({
    label,
    value,
    subtitle,
    icon,
    trend
}: {
    label: string;
    value: string | number;
    subtitle?: string;
    icon: React.ReactNode;
    trend?: { value: string; isPositive: boolean };
}) {
    return (
        <Card>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-secondary font-medium">{label}</p>
                    <p className="text-3xl font-bold text-primary mt-1">{value}</p>
                    {subtitle && (
                        <p className="text-xs text-secondary mt-1">{subtitle}</p>
                    )}
                    {trend && (
                        <p className={`text-xs mt-1 ${trend.isPositive ? "text-up" : "text-down"}`}>
                            {trend.value}
                        </p>
                    )}
                </div>
                <div className="p-2 bg-surface-dark rounded-lg">
                    {icon}
                </div>
            </div>
        </Card>
    );
}

// Uptime Bar Component - shows last 30 checks as colored bars
function UptimeBar({ ticks }: { ticks: WebsiteTick[] }) {
    // Take last 30 ticks or pad with empty
    const bars = ticks.slice(0, 30);

    return (
        <div className="flex gap-0.5 h-8">
            {bars.map((tick, i) => (
                <div
                    key={tick.id || i}
                    className={`
                        w-1.5 rounded-sm flex-shrink-0
                        ${tick.status === "up" ? "bg-up" : "bg-down"}
                        hover:opacity-80 cursor-pointer
                    `}
                    title={`${new Date(tick.timestamp).toLocaleString()} - ${tick.status.toUpperCase()}`}
                />
            ))}
            {/* Fill remaining with empty bars if less than 30 */}
            {Array.from({ length: Math.max(0, 30 - bars.length) }).map((_, i) => (
                <div
                    key={`empty-${i}`}
                    className="w-1.5 rounded-sm flex-shrink-0 bg-light/30"
                />
            ))}
        </div>
    );
}

// Monitor Card Component
function MonitorCard({ website }: { website: Website }) {
    const ticks = getTicksForWebsite(website.id);
    const upCount = ticks.filter(t => t.status === "up").length;
    const uptimePercent = ticks.length > 0 ? ((upCount / ticks.length) * 100).toFixed(2) : "0.00";

    return (
        <Card>
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-primary">{website.name}</h3>
                    <Badge variant={website.status === "up" ? "up" : "down"}>
                        {website.status === "up" ? "Operational" : "Down"}
                    </Badge>
                </div>
                <button className="text-secondary hover:text-primary p-1 rounded-lg hover:bg-surface-dark">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                </button>
            </div>

            <a
                href={website.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-secondary hover:text-accent flex items-center gap-1 mb-4"
            >
                {website.url}
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
            </a>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <p className="text-xs text-accent font-medium mb-1">Uptime (30d)</p>
                    <p className="text-2xl font-bold text-primary">{uptimePercent}%</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-secondary font-medium mb-1">Avg Response</p>
                    <p className="text-2xl font-bold text-primary">
                        {website.responseTime > 0 ? `${website.responseTime}ms` : "—"}
                    </p>
                </div>
            </div>

            <div>
                <p className="text-xs text-accent font-medium mb-2">Last 30 checks</p>
                <UptimeBar ticks={ticks} />
            </div>
        </Card>
    );
}

// Alert Banner Component
function AlertBanner({ count }: { count: number }) {
    if (count === 0) return null;

    return (
        <div className="bg-warning/10 border border-warning/30 rounded-xl p-4 flex items-start gap-3">
            <div className="p-1 bg-warning/20 rounded-lg">
                <svg className="w-5 h-5 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>
            <div>
                <p className="font-semibold text-primary">{count} monitors need attention</p>
                <p className="text-sm text-secondary">Some of your monitored services are experiencing issues</p>
            </div>
        </div>
    );
}

export default function DashboardPage() {
    const downCount = mockWebsites.filter(w => w.status === "down").length;
    const upCount = mockWebsites.filter(w => w.status === "up").length;

    // Calculate average uptime
    const avgUptime = 98.74; // Mock value

    return (
        <div className="space-y-6">
            {/* Header with Add Monitor button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
                    <p className="text-secondary text-sm">Monitor your websites and services in real-time</p>
                </div>
                <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent text-white font-medium rounded-lg hover:bg-secondary transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Monitor
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    label="Total Monitors"
                    value={mockStats.totalWebsites}
                    subtitle="Active monitoring"
                    icon={icons.globe}
                />
                <StatCard
                    label="Operational"
                    value={upCount}
                    subtitle={`${Math.round((upCount / mockStats.totalWebsites) * 100)}% healthy`}
                    icon={icons.check}
                />
                <StatCard
                    label="Avg Uptime"
                    value={`${avgUptime}%`}
                    icon={icons.chart}
                    trend={{ value: "+0.5% from last period", isPositive: true }}
                />
                <StatCard
                    label="Avg Response"
                    value={`${mockStats.avgResponseTime}ms`}
                    icon={icons.clock}
                />
            </div>

            {/* Alert Banner */}
            <AlertBanner count={downCount} />

            {/* Search */}
            <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                    type="text"
                    placeholder="Search monitors..."
                    className="w-full pl-12 pr-4 py-3 bg-surface border border-light/30 rounded-xl text-primary placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                />
            </div>

            {/* Monitor Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockWebsites.map((website) => (
                    <MonitorCard key={website.id} website={website} />
                ))}
            </div>
        </div>
    );
}
