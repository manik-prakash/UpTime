import { createClient } from 'redis';

type website = {
    id: string,
    url: string
}

type StreamMessage = {
    id: string;
    message: {
        id: string;
        url: string;
    };
};

const client = createClient();
client.on('error', err => console.log('redis error', err));
await client.connect();
console.log('redis connected');

const stream_name = "uptime:website";

export { initializeRedis } from './init.js';

export async function pushtoStream({ id, url }: website) {
    console.log(`pushing ${id} - ${url}`);
    const res = await client.xAdd(
        stream_name, '*',
        {
            id,
            url
        }
    )
    console.log(`added to stream: ${res}`);
    return res;
}

export async function readGroups(CONSUMER_GROUP: string, workerID: string): Promise<StreamMessage[] | null | any[]> {
    console.log(`reading from ${CONSUMER_GROUP}, worker: ${workerID}`);
    const res = await client.xReadGroup(
        CONSUMER_GROUP,
        workerID,
        {
            key: stream_name,
            id: '>'
        },
        {
            COUNT: 5
        }
    )

    if (!res) {
        console.log('no messages');
        return null;
    }

    // @ts-ignore
    const messages = res[0].messages.map(msg => ({
        id: msg.id,
        message: {
            id: msg.message.id as string,
            url: msg.message.url as string
        }
    }));

    console.log(`got ${messages.length} messages`);
    return messages;
}

export async function isAccepted(CONSUMER_GROUP: string, eventId: string) {
    console.log(`acking ${eventId}`);
    const res = await client.xAck(stream_name, CONSUMER_GROUP, eventId);
    console.log(`acked: ${res}`);
    return res;
}

export { client as redisClient };
