import { createClient } from 'redis';

const STREAM_NAME = "uptime:website";
const CONSUMER_GROUP = "asia";

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

export async function initializeRedis(): Promise<void> {
    console.log('starting redis init...');

    const redisClient = await getClient();

    try {
        await redisClient.xGroupCreate(STREAM_NAME, CONSUMER_GROUP, '$', {
            MKSTREAM: true
        });
        console.log(`created stream "${STREAM_NAME}" with group "${CONSUMER_GROUP}"`);
    } catch (error: any) {
        if (error?.message?.includes('BUSYGROUP')) {
            console.log(`group "${CONSUMER_GROUP}" already exists`);
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

export { getClient, STREAM_NAME, CONSUMER_GROUP };
