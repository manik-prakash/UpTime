// Integration test - needs a real Redis instance (see docker-compose.yml / CI service container).
// This exists mainly as a regression guard for the bug where the consumer
// group was never actually created anywhere live, so the worker silently
// never processed a single check.
import { describe, it, expect, afterAll } from "vitest";
import {
    initializeRedis,
    pushtoStream,
    readGroups,
    reclaimStale,
    isAccepted,
    redisClient,
} from "./index.js";

const testGroup = `test-group-${Date.now()}-${Math.random().toString(36).slice(2)}`;

afterAll(async () => {
    await redisClient.xGroupDestroy("uptime:website", testGroup).catch(() => {});
});

describe("redis streams pipeline", () => {
    it("creates the consumer group without throwing", async () => {
        await expect(initializeRedis(testGroup)).resolves.not.toThrow();
    });

    it("is safe to call initializeRedis twice (BUSYGROUP handled)", async () => {
        await expect(initializeRedis(testGroup)).resolves.not.toThrow();
    });

    it("delivers a pushed message to a consumer in the group", async () => {
        const website = { id: "test-website-1", url: "https://example.com" };
        await pushtoStream(website);

        const messages = await readGroups(testGroup, "test-consumer-1");

        expect(messages).not.toBeNull();
        const found = messages!.find((m) => m.message.id === website.id);
        expect(found).toBeDefined();
        expect(found!.message.url).toBe(website.url);

        // ack every message this test pulled so it doesn't leak into the
        // reclaim test below or leave stale PEL entries behind.
        for (const m of messages!) {
            await isAccepted(testGroup, m.id);
        }
    });

    it("reclaims a message left pending by a dead consumer", async () => {
        const website = { id: "test-website-2", url: "https://example.com" };
        await pushtoStream(website);

        // "dead-consumer" reads it but never acks - simulates a crash.
        const delivered = await readGroups(testGroup, "dead-consumer");
        const pendingEntry = delivered!.find((m) => m.message.id === website.id);
        expect(pendingEntry).toBeDefined();

        // Not yet idle long enough to be reclaimed.
        const tooSoon = await reclaimStale(testGroup, "rescuer", 60_000);
        expect(tooSoon.find((m) => m.message.id === website.id)).toBeUndefined();

        // Reclaim with a near-zero idle threshold - it's been at least a
        // few ms since delivery, so this should pick it up.
        const reclaimed = await reclaimStale(testGroup, "rescuer", 1);
        const found = reclaimed.find((m) => m.message.id === website.id);
        expect(found).toBeDefined();

        await isAccepted(testGroup, pendingEntry!.id);
    });
});
