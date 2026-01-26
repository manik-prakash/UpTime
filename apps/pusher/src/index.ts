import {prisma} from "@repo/db/client";
import { pushtoStream } from "@repo/redis/client"

async function pusher() {
    try {
        const websites = await prisma.website.findMany({
            select: { id: true, url: true }
        });

        for (const website of websites) {
            await pushtoStream(website);
        }

        console.log(`pushed ${websites.length} websites to stream`);
    } catch (error) {
        console.error('error in pusher:', error);
    } finally {
        setTimeout(pusher, 3 * 60 * 1000);
    }
}

pusher();
