import { describe, it, expect, vi, beforeEach } from "vitest";

const { getMock, createMock } = vi.hoisted(() => ({
    getMock: vi.fn(),
    createMock: vi.fn(),
}));

vi.mock("axios", () => ({
    default: { get: getMock },
}));

vi.mock("@repo/db/client", () => ({
    prisma: { websiteTick: { create: createMock } },
}));

const { checkWebsite } = await import("./checkWebsite.js");

describe("checkWebsite", () => {
    beforeEach(() => {
        getMock.mockReset();
        createMock.mockReset();
        createMock.mockResolvedValue({});
    });

    it("records Up when the request succeeds", async () => {
        getMock.mockResolvedValue({ status: 200 });

        await checkWebsite("website-1", "https://example.com", "region-1");

        expect(createMock).toHaveBeenCalledTimes(1);
        expect(createMock).toHaveBeenCalledWith({
            data: expect.objectContaining({
                status: "Up",
                websiteId: "website-1",
                regionId: "region-1",
            }),
        });
    });

    it("records Down when the request throws (timeout, DNS failure, connection refused)", async () => {
        getMock.mockRejectedValue(new Error("ECONNREFUSED"));

        await checkWebsite("website-1", "https://example.com", "region-1");

        expect(createMock).toHaveBeenCalledWith({
            data: expect.objectContaining({ status: "Down" }),
        });
    });

    it("does not record Down when the DB write itself fails after a successful ping", async () => {
        getMock.mockResolvedValue({ status: 200 });
        createMock.mockRejectedValue(new Error("connection pool exhausted"));

        await expect(checkWebsite("website-1", "https://example.com", "region-1")).rejects.toThrow(
            "connection pool exhausted"
        );

        // The only create() call attempted must have been for "Up" - a DB
        // failure must never cause a second, different-status write.
        expect(createMock).toHaveBeenCalledTimes(1);
        expect(createMock).toHaveBeenCalledWith({
            data: expect.objectContaining({ status: "Up" }),
        });
    });

    it("records a positive response time", async () => {
        getMock.mockResolvedValue({ status: 200 });

        await checkWebsite("website-1", "https://example.com", "region-1");

        const call = createMock.mock.calls[0][0];
        expect(call.data.responseTimeMs).toBeGreaterThanOrEqual(0);
    });
});
