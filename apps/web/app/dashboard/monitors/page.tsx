"use client";

import { useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import { mockWebsites, mockRegions } from "@/lib/mockData";

export default function MonitorsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="space-y-6">
            {/* Header */}
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

            {/* Website Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockWebsites.map((website) => (
                    <Card key={website.id} className="hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-primary truncate">{website.name}</h3>
                                <p className="text-sm text-secondary truncate">{website.url}</p>
                            </div>
                            <Badge variant={website.status === "up" ? "up" : "down"}>
                                {website.status.toUpperCase()}
                            </Badge>
                        </div>

                        <div className="space-y-2 text-sm text-secondary mb-4">
                            <div className="flex justify-between">
                                <span>Region:</span>
                                <span className="text-primary">{website.region}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Response Time:</span>
                                <span className="text-primary">
                                    {website.responseTime > 0 ? `${website.responseTime}ms` : "—"}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Last Checked:</span>
                                <span className="text-primary">
                                    {new Date(website.lastChecked).toLocaleTimeString()}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Interval:</span>
                                <span className="text-primary">{website.interval}s</span>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Link href={`/dashboard/monitors/${website.id}`} className="flex-1">
                                <Button variant="secondary" size="sm" className="w-full">
                                    View Details
                                </Button>
                            </Link>
                            <Button variant="outline" size="sm" className="text-down border-down hover:bg-down hover:text-white">
                                Delete
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Add Monitor Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Monitor">
                <form className="space-y-4">
                    <Input
                        label="Website URL"
                        type="url"
                        placeholder="https://example.com"
                        required
                    />

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-primary">Monitoring Interval</label>
                        <select className="px-4 py-2 border border-light rounded-lg bg-white text-primary focus:outline-none focus:ring-2 focus:ring-accent">
                            <option value="30">Every 30 seconds</option>
                            <option value="60">Every 60 seconds</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-primary">Region</label>
                        <select className="px-4 py-2 border border-light rounded-lg bg-white text-primary focus:outline-none focus:ring-2 focus:ring-accent">
                            {mockRegions.map((region) => (
                                <option key={region.id} value={region.code}>
                                    {region.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1">
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1">
                            Add Monitor
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
