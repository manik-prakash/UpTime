import Link from "next/link";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Table from "@/components/ui/Table";
import { getWebsiteById, getTicksForWebsite } from "@/lib/mockData";

interface MonitorDetailPageProps {
    params: Promise<{ id: string }>;
}

export default async function MonitorDetailPage({ params }: MonitorDetailPageProps) {
    const { id } = await params;
    const website = getWebsiteById(id);
    const ticks = getTicksForWebsite(id);

    if (!website) {
        return (
            <div className="text-center py-12">
                <h1 className="text-2xl font-bold text-primary mb-2">Monitor Not Found</h1>
                <p className="text-secondary mb-4">The monitor you&apos;re looking for doesn&apos;t exist.</p>
                <Link href="/dashboard/monitors">
                    <Button>Back to Monitors</Button>
                </Link>
            </div>
        );
    }

    const tickColumns = [
        {
            key: "timestamp",
            header: "Timestamp",
            render: (tick: typeof ticks[0]) => {
                const date = new Date(tick.timestamp);
                return date.toLocaleString();
            }
        },
        { key: "region", header: "Region" },
        {
            key: "status",
            header: "Status",
            render: (tick: typeof ticks[0]) => (
                <Badge variant={tick.status === "up" ? "up" : "down"}>
                    {tick.status.toUpperCase()}
                </Badge>
            )
        },
        {
            key: "responseTime",
            header: "Response Time",
            render: (tick: typeof ticks[0]) => (
                tick.responseTime > 0 ? `${tick.responseTime}ms` : "—"
            )
        },
    ];

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <Link href="/dashboard/monitors" className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to Monitors
            </Link>

            {/* Website Info Card */}
            <Card>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-2xl font-bold text-primary">{website.name}</h1>
                            <Badge variant={website.status === "up" ? "up" : "down"}>
                                {website.status.toUpperCase()}
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
                        <Button variant="secondary">Edit</Button>
                        <Button variant="outline" className="text-down border-down hover:bg-down hover:text-white">
                            Delete
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-light/30">
                    <div>
                        <div className="text-sm text-secondary">Region</div>
                        <div className="font-medium text-primary">{website.region}</div>
                    </div>
                    <div>
                        <div className="text-sm text-secondary">Response Time</div>
                        <div className="font-medium text-primary">
                            {website.responseTime > 0 ? `${website.responseTime}ms` : "—"}
                        </div>
                    </div>
                    <div>
                        <div className="text-sm text-secondary">Check Interval</div>
                        <div className="font-medium text-primary">{website.interval}s</div>
                    </div>
                    <div>
                        <div className="text-sm text-secondary">Last Checked</div>
                        <div className="font-medium text-primary">
                            {new Date(website.lastChecked).toLocaleTimeString()}
                        </div>
                    </div>
                </div>
            </Card>

            {/* Tick History */}
            <Card>
                <h2 className="text-lg font-semibold text-primary mb-4">
                    Recent Checks ({ticks.length})
                </h2>
                <Table columns={tickColumns} data={ticks} />
            </Card>
        </div>
    );
}
