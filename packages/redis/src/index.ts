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
client.on('error', err => console.log('Redis Client Error', err));
await client.connect();

const stream_name = "uptime:website";

export async function grpCreate() {
    await client.xGroupCreate(stream_name, 'asia', '$', {
        MKSTREAM: true
    });
}

export async function pushtoStream({ id, url }: website) {
    const res = await client.xAdd(
        stream_name, '*',
        {
            id,
            url
        }
    )
    return res;
}

export async function readGroups(CONSUMER_GROUP: string, workerID: string): Promise<StreamMessage[] | null | any[]> {
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
        return null;
    }
    // @ts-ignore
    return res[0].messages.map(msg => ({
        id: msg.id,
        message: {
            id: msg.message.id as string,
            url: msg.message.url as string
        }
    }));
}

export async function isAccepted(CONSUMER_GROUP: string, eventId: string) {
    const res = await client.xAck(stream_name, CONSUMER_GROUP, eventId);
    return res;
}


// await client.quit();
