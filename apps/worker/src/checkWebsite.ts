import { prisma } from "@repo/db/client";
import axios from "axios";

export async function checkWebsite(id: string, url: string, regionId: string): Promise<void> {
    const startTime = Date.now();

    let isUp: boolean;
    try {
        await axios.get(url, {
            timeout: 10000,
            // Intentional: "Up" means the host is reachable and responding,
            // not that the endpoint itself is healthy - 4xx counts as Up.
            validateStatus: (status) => status < 500
        });
        isUp = true;
    } catch (error) {
        isUp = false;
    }

    const endTime = Date.now();
    const status = isUp ? "Up" : "Down";

    // Not caught here: a DB write failure must not be recorded as the site
    // being down, and should leave the stream entry unacked for retry.
    await prisma.websiteTick.create({
        data: {
            responseTimeMs: endTime - startTime,
            status,
            regionId,
            websiteId: id
        }
    });

    console.log(`${url} ${status.toLowerCase()} ${endTime - startTime}ms`);
}
