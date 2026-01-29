"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Table from "@/components/ui/Table";
import { getWebsiteById, deleteWebsite, GetWebsiteByIdResponse } from "@/lib/api";

type Website = NonNullable<GetWebsiteByIdResponse['website']>;
type Tick = Website['ticks'][number];

export default function MonitorDetailPage() {
    const params = useParams();
    const router = useRouter();
    const websiteId = params.id as string;

    const [website, setWebsite] = useState<Website | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getWebsiteById(websiteId);
                if (response.website) {
                    setWebsite(response.website);
                } else {
                    setError(response.message || "Website not found");
                }
            } catch (err) {
                setError("Failed to load website");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [websiteId]);

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this monitor?")) return;

        try {
            await deleteWebsite(websiteId);
            router.push("/dashboard/monitors");
        } catch (err) {
            setError("Failed to delete monitor");
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-secondary">Loading monitor...</div>
            </div>
        );
    }

    if (error || !website) {
        return (
            <div className="text-center py-12">
                <h1 className="text-2xl font-bold text-primary mb-2">Monitor Not Found</h1>
                <p className="text-secondary mb-4">{error || "The monitor you're looking for doesn't exist."}</p>
                <Link href="/dashboard/monitors">
                    <Button>Back to Monitors</Button>
                </Link>
            </div>
        );
    }

    const ticks = website.ticks;
    const latestTick = ticks[0];
    const status = latestTick?.status === "Up" ? "up" : "down";
    const responseTime = latestTick?.responseTimeMs || 0;
    const upCount = ticks.filter(t => t.status === "Up").length;
    const uptimePercent = ticks.length > 0 ? ((upCount / ticks.length) * 100).toFixed(2) : "0.00";

    const getWebsiteName = (url: string): string => {
        try {
            const urlObj = new URL(url);
            return urlObj.hostname;
        } catch {
            return url;
        }
    };

    const tickColumns = [
        {
            key: "createdAt",
            header: "Timestamp",
            render: (tick: Tick) => {
                const date = new Date(tick.createdAt);
                return date.toLocaleString();
            }
        },
        { key: "region", header: "Region" },
        {
            key: "status",
            header: "Status",
            render: (tick: Tick) => (
                <Badge variant={tick.status === "Up" ? "up" : "down"}>
                    {tick.status}
                </Badge>
            )
        },
        {
            key: "responseTimeMs",
            header: "Response Time",
            render: (tick: Tick) => (
                tick.responseTimeMs > 0 ? `${tick.responseTimeMs}ms` : "—"
            )
        },
    ];

    return (
        <div className="space-y-6">

            <Link href="/dashboard/monitors" className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to Monitors
            </Link>


            <Card>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-2xl font-bold text-primary">{getWebsiteName(website.url)}</h1>
                            <Badge variant={status === "up" ? "up" : "down"}>
                                {status.toUpperCase()}
                            </Badge>
                        </div>
                        <a
                            href={website.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent hover:text-secondary transition-colors"
                        >
                            {website.url}
                        </a>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            className="text-down border-down hover:bg-down hover:text-white"
                            onClick={handleDelete}
                        >
                            Delete
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-light/30">
                    <div>
                        <div className="text-sm text-secondary">Region</div>
                        <div className="font-medium text-primary">{latestTick?.region || "—"}</div>
                    </div>
                    <div>
                        <div className="text-sm text-secondary">Response Time</div>
                        <div className="font-medium text-primary">
                            {responseTime > 0 ? `${responseTime}ms` : "—"}
                        </div>
                    </div>
                    <div>
                        <div className="text-sm text-secondary">Uptime</div>
                        <div className="font-medium text-primary">{uptimePercent}%</div>
                    </div>
                    <div>
                        <div className="text-sm text-secondary">Last Checked</div>
                        <div className="font-medium text-primary">
                            {latestTick ? new Date(latestTick.createdAt).toLocaleTimeString() : "—"}
                        </div>
                    </div>
                </div>
            </Card>


            <Card>
                <h2 className="text-lg font-semibold text-primary mb-4">
                    Recent Checks ({ticks.length})
                </h2>
                {ticks.length > 0 ? (
                    <Table columns={tickColumns} data={ticks} />
                ) : (
                    <p className="text-secondary text-center py-8">No checks recorded yet</p>
                )}
            </Card>
        </div>
    );
}
