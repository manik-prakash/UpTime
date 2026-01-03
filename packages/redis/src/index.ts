import { createClient } from 'redis';

type website = {
    id: string,
    url: string
}

const client = createClient();
client.on('error', err => console.log('Redis Client Error', err));
await client.connect();

const stream_name = "uptime:website";

export async function pushtoStream({ id, url }: website) {
    const res = await client.xAdd(
        stream_name, '*', {
        id,
        url
    }
    )
    return res;
}

export async function readGroups(CONSUMER_GROUP: string, workerID: string) {
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

    return res;
}

export async function isAccpted(CONSUMER_GROUP: string, eventId: string) {
    const res = await client.xAck(stream_name, CONSUMER_GROUP, eventId);
    return res;
}


// await client.quit();
