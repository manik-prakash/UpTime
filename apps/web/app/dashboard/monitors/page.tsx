"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import { getWebsites, createWebsite, deleteWebsite, GetWebsitesResponse } from "@/lib/api";

type Website = NonNullable<GetWebsitesResponse['websites']>[number];

export default function MonitorsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [websites, setWebsites] = useState<Website[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [newUrl, setNewUrl] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchWebsites = async () => {
        try {
            const response = await getWebsites();
            if (response.websites) {
                setWebsites(response.websites);
            }
        } catch (err) {
            setError("Failed to load websites");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchWebsites();
    }, []);

    const handleAddMonitor = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            const response = await createWebsite(newUrl);
            if (response.id) {
                setIsModalOpen(false);
                setNewUrl("");
                await fetchWebsites();
            } else {
                setError(response.message || "Failed to create monitor");
            }
        } catch (err) {
            setError("Failed to create monitor");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (websiteId: string) => {
        if (!confirm("Are you sure you want to delete this monitor?")) return;

        try {
            await deleteWebsite(websiteId);
            await fetchWebsites();
        } catch (err) {
            setError("Failed to delete monitor");
        }
    };

    const getWebsiteStatus = (website: Website): 'up' | 'down' => {
        if (website.ticks.length === 0) return 'down';
        const latestTick = website.ticks[0];
        return latestTick.status === 'Up' ? 'up' : 'down';
    };

    const getLatestResponseTime = (website: Website): number => {
        if (website.ticks.length === 0) return 0;
        return website.ticks[0].responseTimeMs;
    };

    const getWebsiteName = (url: string): string => {
        try {
            const urlObj = new URL(url);
            return urlObj.hostname;
        } catch {
            return url;
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-secondary">Loading monitors...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-primary">Monitors</h1>
                    <p className="text-secondary">Manage your monitored websites</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>
                    <span className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Add Monitor
                    </span>
                </Button>
            </div>

            {error && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                    {error}
                </div>
            )}


            {websites.length === 0 ? (
                <Card className="text-center py-12">
                    <p className="text-secondary mb-4">No monitors yet</p>
                    <Button onClick={() => setIsModalOpen(true)}>Add your first monitor</Button>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {websites.map((website) => {
                        const status = getWebsiteStatus(website);
                        const responseTime = getLatestResponseTime(website);
                        const name = getWebsiteName(website.url);
                        const latestTick = website.ticks[0];

                        return (
                            <Card key={website.id} className="hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-primary truncate">{name}</h3>
                                        <p className="text-sm text-secondary truncate">{website.url}</p>
                                    </div>
                                    <Badge variant={status === "up" ? "up" : "down"}>
                                        {status.toUpperCase()}
                                    </Badge>
                                </div>

                                <div className="space-y-2 text-sm text-secondary mb-4">
                                    <div className="flex justify-between">
                                        <span>Region:</span>
                                        <span className="text-primary">{latestTick?.region || "—"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Response Time:</span>
                                        <span className="text-primary">
                                            {responseTime > 0 ? `${responseTime}ms` : "—"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Last Checked:</span>
                                        <span className="text-primary">
                                            {latestTick ? new Date(latestTick.createdAt).toLocaleTimeString() : "—"}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Link href={`/dashboard/monitors/${website.id}`} className="flex-1">
                                        <Button variant="secondary" size="sm" className="w-full">
                                            View Details
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-down border-down hover:bg-down hover:text-white"
                                        onClick={() => handleDelete(website.id)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}


            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Monitor">
                <form className="space-y-4" onSubmit={handleAddMonitor}>
                    <Input
                        label="Website URL"
                        type="url"
                        placeholder="https://example.com"
                        required
                        value={newUrl}
                        onChange={(e) => setNewUrl(e.target.value)}
                    />

                    <div className="flex gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1">
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1" disabled={isSubmitting}>
                            {isSubmitting ? "Adding..." : "Add Monitor"}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
