import { prisma } from "@repo/db/client";
import { readGroups, isAccepted, initializeRedis, reclaimStale } from "@repo/redis/client";
import os from "os";
import { checkWebsite } from "./checkWebsite.js";

const STALE_MIN_IDLE_MS = 60_000;

const REGION_NAME = process.env.REGION_ID! || "asia";
const WORKER_ID = process.env.WORKER_ID || `worker-${os.hostname()}-${process.pid}`;

if (!REGION_NAME) {
    throw new Error("region id env var missing");
}

if (!WORKER_ID) {
    throw new Error("worker id env var missing");
}

const region = await prisma.region.findUnique({
    where: { name: REGION_NAME }
});

if (!region) {
    throw new Error(`region "${REGION_NAME}" not found, run seed first`);
}

const REGION_UUID = region.id;
console.log(`region ${REGION_NAME} -> ${REGION_UUID}`);

async function processMessages(messages: Array<{ id: string; message: { id: string; url: string } }>) {
    console.log(`processing ${messages.length} websites`);

    await Promise.all(
        messages.map(async ({ id, message }) => {
            try {
                await checkWebsite(message.id, message.url, REGION_UUID);

                await isAccepted(REGION_NAME, id);
            } catch (error) {
                console.error(`failed ${id}:`, error);
            }
        })
    );
}

async function worker() {
    await initializeRedis(REGION_NAME);

    console.log(`worker ${WORKER_ID} started in ${REGION_NAME}`);

    while (true) {
        try {
            const reclaimed = await reclaimStale(REGION_NAME, WORKER_ID, STALE_MIN_IDLE_MS);
            if (reclaimed.length > 0) {
                await processMessages(reclaimed);
            }

            const response = await readGroups(REGION_NAME, WORKER_ID);

            if (!response || response.length === 0) {
                continue;
            }

            await processMessages(response);
        } catch (error) {
            console.error('worker error:', error);
        }
    }
}

worker().catch((error) => {
    console.error('fatal error:', error);
});