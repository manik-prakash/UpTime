import { prisma } from "@repo/db/client";
import { readGroups, isAccepted } from "@repo/redis/client";
import axios from "axios";

const REGION_NAME = process.env.REGION_ID! || "asia";
const WORKER_ID = process.env.WORKER_ID! || "worker-1";

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
                regionId: REGION_UUID,
                websiteId: id
            }
        });

        console.log(`${url} up ${endTime - startTime}ms`);
    } catch (error) {

        const endTime = Date.now();
        await prisma.websiteTick.create({
            data: {
                responseTimeMs: endTime - startTime,
                status: "Down",
                regionId: REGION_UUID,
                websiteId: id
            }
        });

        console.log(`${url} down ${endTime - startTime}ms`);
    }
}

async function worker() {
    console.log(`worker ${WORKER_ID} started in ${REGION_NAME}`);

    while (true) {
        try {
            const response = await readGroups(REGION_NAME, WORKER_ID);

            if (!response || response.length === 0) {
                continue;
            }

            console.log(`got ${response.length} websites`);

            await Promise.all(
                response.map(async ({ id, message }) => {
                    try {
                        await checkWebsite(message.id, message.url);

                        await isAccepted(REGION_NAME, id);
                    } catch (error) {
                        console.error(`failed ${id}:`, error);
                    }
                })
            );

        } catch (error) {
            console.error('worker error:', error);
        }
    }
}

worker().catch((error) => {
    console.error('fatal error:', error);
});