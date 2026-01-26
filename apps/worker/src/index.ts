import { prisma } from "@repo/db/client";
import { readGroups, isAccepted } from "@repo/redis/client";
import axios from "axios";

const REGION_ID = process.env.REGION_ID! || "asia";
const WORKER_ID = process.env.WORKER_ID! || "worker-1";

if (!REGION_ID) {
    throw new Error("REGION_ID environment variable not provided");
}

if (!WORKER_ID) {
    throw new Error("WORKER_ID environment variable not provided");
}

async function checkWebsite(id: string, url: string): Promise<void> {
    const startTime = Date.now();

    try {
        await axios.get(url, {
            timeout: 10000,
            validateStatus: (status) => status < 500
        });

        const endTime = Date.now();

        await prisma.websiteTick.create({
            data: {
                responseTimeMs: endTime - startTime,
                status: "Up",
                regionId: REGION_ID,
                websiteId: id
            }
        });

        console.log(`${url} - Up (${endTime - startTime}ms)`);
    } catch (error) {

        const endTime = Date.now();
        await prisma.websiteTick.create({
            data: {
                responseTimeMs: endTime - startTime,
                status: "Down",
                regionId: REGION_ID,
                websiteId: id
            }
        });

        console.log(`${url} - Down (${endTime - startTime}ms)`);
    }
}

async function worker() {
    console.log(`Worker started: ${WORKER_ID} in region: ${REGION_ID}`);

    while (true) {
        try {
            const response = await readGroups(REGION_ID, WORKER_ID);

            if (!response || response.length === 0) {
                continue;
            }

            console.log(`processing ${response.length} websites`);

            await Promise.all(
                response.map(async ({ id, message }) => {
                    try {
                        await checkWebsite(message.id, message.url);

                        await isAccepted(REGION_ID, id);
                    } catch (error) {
                        console.error(`error processing ${id}:`, error);
                    }
                })
            );

        } catch (error) {
            console.error('Worker error:', error); ``
        }
    }
}

worker().catch((error) => {
    console.error('Fatal worker error:', error);
});