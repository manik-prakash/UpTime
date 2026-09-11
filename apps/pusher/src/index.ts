import { prisma } from "@repo/db/client";
import { pushtoStream } from "@repo/redis/client"

async function pusher() {
    try {
        const websites = await prisma.website.findMany({
            select: { id: true, url: true }
        });

        for (const website of websites) {
            try {
                await pushtoStream(website);
            } catch (error) {
                console.error(`failed to push ${website.id} - ${website.url}:`, error);
            }
        }

        console.log(`pushed ${websites.length} websites`);
    } catch (error) {
        console.error('pusher error:', error);
    } finally {
        setTimeout(pusher, 3 * 60 * 1000);
    }
}

pusher();
