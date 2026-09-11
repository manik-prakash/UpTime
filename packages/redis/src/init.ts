import { createClient } from 'redis';

const STREAM_NAME = "uptime:website";

let client: ReturnType<typeof createClient> | null = null;

async function getClient() {
    if (!client) {
        client = createClient();
        client.on('error', err => console.log('redis error:', err));
        await client.connect();
        console.log('redis connected');
    }
    return client;
}

export async function initializeRedis(consumerGroup: string): Promise<void> {
    console.log(`starting redis init for group "${consumerGroup}"...`);

    const redisClient = await getClient();

    try {
        await redisClient.xGroupCreate(STREAM_NAME, consumerGroup, '$', {
            MKSTREAM: true
        });
        console.log(`created stream "${STREAM_NAME}" with group "${consumerGroup}"`);
    } catch (error: any) {
        if (error?.message?.includes('BUSYGROUP')) {
            console.log(`group "${consumerGroup}" already exists`);
        } else {
            console.error('error creating group:', error);
            throw error;
        }
    }

    try {
        const streamInfo = await redisClient.xInfoStream(STREAM_NAME);
        console.log(`stream: ${streamInfo.length} entries`);
    } catch (error) {
        console.log('couldnt get stream info:', error);
    }

    console.log('redis init done');
}

export { getClient, STREAM_NAME };
