// Types
export interface Website {
    id: string;
    url: string;
    name: string;
    status: "up" | "down";
    lastChecked: string;
    region: string;
    responseTime: number;
    interval: number;
}

export interface WebsiteTick {
    id: string;
    websiteId: string;
    timestamp: string;
    status: "up" | "down";
    responseTime: number;
    region: string;
}

export interface Region {
    id: string;
    name: string;
    code: string;
}

// Mock Regions
export const mockRegions: Region[] = [
    { id: "1", name: "US East", code: "us-east" },
    { id: "2", name: "US West", code: "us-west" },
    { id: "3", name: "Europe", code: "eu" },
    { id: "4", name: "Asia Pacific", code: "ap" },
];

// Mock Websites
export const mockWebsites: Website[] = [
    {
        id: "1",
        url: "https://google.com",
        name: "Google",
        status: "up",
        lastChecked: "2026-01-28T22:00:00Z",
        region: "US East",
        responseTime: 45,
        interval: 30,
    },
    {
        id: "2",
        url: "https://github.com",
        name: "GitHub",
        status: "up",
        lastChecked: "2026-01-28T22:00:00Z",
        region: "US West",
        responseTime: 120,
        interval: 60,
    },
    {
        id: "3",
        url: "https://example.com",
        name: "Example Site",
        status: "down",
        lastChecked: "2026-01-28T21:55:00Z",
        region: "Europe",
        responseTime: 0,
        interval: 30,
    },
    {
        id: "4",
        url: "https://vercel.com",
        name: "Vercel",
        status: "up",
        lastChecked: "2026-01-28T22:00:00Z",
        region: "US East",
        responseTime: 89,
        interval: 60,
    },
    {
        id: "5",
        url: "https://nextjs.org",
        name: "Next.js",
        status: "up",
        lastChecked: "2026-01-28T22:00:00Z",
        region: "Asia Pacific",
        responseTime: 156,
        interval: 30,
    },
];

// Mock Ticks
export const mockTicks: WebsiteTick[] = [
    { id: "1", websiteId: "1", timestamp: "2026-01-28T22:00:00Z", status: "up", responseTime: 45, region: "US East" },
    { id: "2", websiteId: "1", timestamp: "2026-01-28T21:59:30Z", status: "up", responseTime: 42, region: "US East" },
    { id: "3", websiteId: "1", timestamp: "2026-01-28T21:59:00Z", status: "up", responseTime: 48, region: "US East" },
    { id: "4", websiteId: "1", timestamp: "2026-01-28T21:58:30Z", status: "up", responseTime: 44, region: "US East" },
    { id: "5", websiteId: "1", timestamp: "2026-01-28T21:58:00Z", status: "up", responseTime: 46, region: "US East" },
    { id: "6", websiteId: "2", timestamp: "2026-01-28T22:00:00Z", status: "up", responseTime: 120, region: "US West" },
    { id: "7", websiteId: "2", timestamp: "2026-01-28T21:59:00Z", status: "up", responseTime: 115, region: "US West" },
    { id: "8", websiteId: "2", timestamp: "2026-01-28T21:58:00Z", status: "up", responseTime: 125, region: "US West" },
    { id: "9", websiteId: "3", timestamp: "2026-01-28T21:55:00Z", status: "down", responseTime: 0, region: "Europe" },
    { id: "10", websiteId: "3", timestamp: "2026-01-28T21:54:30Z", status: "down", responseTime: 0, region: "Europe" },
    { id: "11", websiteId: "3", timestamp: "2026-01-28T21:54:00Z", status: "up", responseTime: 230, region: "Europe" },
    { id: "12", websiteId: "3", timestamp: "2026-01-28T21:53:30Z", status: "up", responseTime: 225, region: "Europe" },
    { id: "13", websiteId: "4", timestamp: "2026-01-28T22:00:00Z", status: "up", responseTime: 89, region: "US East" },
    { id: "14", websiteId: "4", timestamp: "2026-01-28T21:59:00Z", status: "up", responseTime: 92, region: "US East" },
    { id: "15", websiteId: "5", timestamp: "2026-01-28T22:00:00Z", status: "up", responseTime: 156, region: "Asia Pacific" },
    { id: "16", websiteId: "5", timestamp: "2026-01-28T21:59:30Z", status: "up", responseTime: 162, region: "Asia Pacific" },
    { id: "17", websiteId: "5", timestamp: "2026-01-28T21:59:00Z", status: "up", responseTime: 149, region: "Asia Pacific" },
    { id: "18", websiteId: "5", timestamp: "2026-01-28T21:58:30Z", status: "up", responseTime: 158, region: "Asia Pacific" },
    { id: "19", websiteId: "5", timestamp: "2026-01-28T21:58:00Z", status: "up", responseTime: 154, region: "Asia Pacific" },
    { id: "20", websiteId: "5", timestamp: "2026-01-28T21:57:30Z", status: "up", responseTime: 160, region: "Asia Pacific" },
];

// Dashboard Stats
export const mockStats = {
    totalWebsites: mockWebsites.length,
    websitesUp: mockWebsites.filter((w) => w.status === "up").length,
    websitesDown: mockWebsites.filter((w) => w.status === "down").length,
    avgResponseTime: Math.round(
        mockWebsites.filter((w) => w.status === "up").reduce((acc, w) => acc + w.responseTime, 0) /
        mockWebsites.filter((w) => w.status === "up").length
    ),
};

// Helper function to get ticks for a website
export function getTicksForWebsite(websiteId: string): WebsiteTick[] {
    return mockTicks.filter((tick) => tick.websiteId === websiteId);
}

// Helper function to get website by ID
export function getWebsiteById(id: string): Website | undefined {
    return mockWebsites.find((website) => website.id === id);
}
