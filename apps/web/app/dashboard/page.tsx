"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { getWebsites, GetWebsitesResponse } from "@/lib/api";

type Website = NonNullable<GetWebsitesResponse['websites']>[number];
type Tick = Website['ticks'][number];

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

function UptimeBar({ ticks }: { ticks: Tick[] }) {
    const bars = ticks.slice(0, 30);

    return (
        <div className="flex gap-0.5 h-8">
            {bars.map((tick, i) => (
                <div
                    key={tick.id || i}
                    className={`
                        w-1.5 rounded-sm shrink-0
                        ${tick.status === "Up" ? "bg-up" : "bg-down"}
                        hover:opacity-80 cursor-pointer
                    `}
                    title={`${new Date(tick.createdAt).toLocaleString()} - ${tick.status}`}
                />
            ))}
            {Array.from({ length: Math.max(0, 30 - bars.length) }).map((_, i) => (
                <div
                    key={`empty-${i}`}
                    className="w-1.5 rounded-sm shrink-0 bg-light/30"
                />
            ))}
        </div>
    );
}

function MonitorCard({ website }: { website: Website }) {
    const ticks = website.ticks;
    const upCount = ticks.filter(t => t.status === "Up").length;
    const uptimePercent = ticks.length > 0 ? ((upCount / ticks.length) * 100).toFixed(2) : "0.00";
    const latestTick = ticks[0];
    const status = latestTick?.status === "Up" ? "up" : "down";
    const responseTime = latestTick?.responseTimeMs || 0;

    const getWebsiteName = (url: string): string => {
        try {
            const urlObj = new URL(url);
            return urlObj.hostname;
        } catch {
            return url;
        }
    };

    return (
        <Card>
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-primary">{getWebsiteName(website.url)}</h3>
                    <Badge variant={status === "up" ? "up" : "down"}>
                        {status === "up" ? "Operational" : "Down"}
                    </Badge>
                </div>
                <Link href={`/dashboard/monitors/${website.id}`} className="text-secondary hover:text-primary p-1 rounded-lg hover:bg-surface-dark">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </Link>
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
                    <p className="text-xs text-accent font-medium mb-1">Uptime (30 checks)</p>
                    <p className="text-2xl font-bold text-primary">{uptimePercent}%</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-secondary font-medium mb-1">Response Time</p>
                    <p className="text-2xl font-bold text-primary">
                        {responseTime > 0 ? `${responseTime}ms` : "—"}
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
    const [websites, setWebsites] = useState<Website[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getWebsites();
                if (response.websites) {
                    setWebsites(response.websites);
                }
            } catch (err) {
                console.error("Failed to load websites", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-secondary">Loading dashboard...</div>
            </div>
        );
    }

    const downCount = websites.filter(w => {
        const latestTick = w.ticks[0];
        return !latestTick || latestTick.status !== "Up";
    }).length;

    const upCount = websites.length - downCount;
    const totalMonitors = websites.length;

    const allTicks = websites.flatMap(w => w.ticks);
    const avgUptime = allTicks.length > 0
        ? ((allTicks.filter(t => t.status === "Up").length / allTicks.length) * 100).toFixed(2)
        : "0.00";

    const validResponseTimes = allTicks.filter(t => t.responseTimeMs > 0);
    const avgResponseTime = validResponseTimes.length > 0
        ? Math.round(validResponseTimes.reduce((sum, t) => sum + t.responseTimeMs, 0) / validResponseTimes.length)
        : 0;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
                    <p className="text-secondary text-sm">Monitor your websites and services in real-time</p>
                </div>
                <Link href="/dashboard/monitors" className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent text-white font-medium rounded-lg hover:bg-secondary transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Monitor
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    label="Total Monitors"
                    value={totalMonitors}
                    subtitle="Active monitoring"
                    icon={icons.globe}
                />
                <StatCard
                    label="Operational"
                    value={upCount}
                    subtitle={totalMonitors > 0 ? `${Math.round((upCount / totalMonitors) * 100)}% healthy` : "No monitors"}
                    icon={icons.check}
                />
                <StatCard
                    label="Avg Uptime"
                    value={`${avgUptime}%`}
                    icon={icons.chart}
                />
                <StatCard
                    label="Avg Response"
                    value={avgResponseTime > 0 ? `${avgResponseTime}ms` : "—"}
                    icon={icons.clock}
                />
            </div>

            {/* Alert Banner */}
            <AlertBanner count={downCount} />

            {/* Monitor Cards Grid */}
            {websites.length === 0 ? (
                <Card className="text-center py-12">
                    <p className="text-secondary mb-4">No monitors yet</p>
                    <Link href="/dashboard/monitors" className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white font-medium rounded-lg hover:bg-secondary transition-colors">
                        Add your first monitor
                    </Link>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {websites.map((website) => (
                        <MonitorCard key={website.id} website={website} />
                    ))}
                </div>
            )}
        </div>
    );
}
