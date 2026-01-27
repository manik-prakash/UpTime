import 'dotenv/config';
import { prisma } from './dist/src/index.js';
import bcrypt from 'bcryptjs';

async function main() {
    console.log('starting seed...');
    console.log(`db url: ${process.env.DATABASE_URL ? 'set' : 'not set'}`);

    console.log('creating user...');
    const hashedPassword = await bcrypt.hash('testpassword123', 10);

    const user = await prisma.user.upsert({
        where: { username: 'testuser' },
        update: {},
        create: {
            username: 'testuser',
            password: hashedPassword,
        }
    });
    console.log(`user: ${user.id} (${user.username})`);

    console.log('creating region...');
    const region = await prisma.region.upsert({
        where: { name: 'asia' },
        update: {},
        create: {
            name: 'asia'
        }
    });
    console.log(`region: ${region.id} (${region.name})`);

    console.log('creating websites...');
    const websites = [
        'https://google.com',
        'https://github.com',
        'https://example.com',
        'https://httpstat.us/200',
        'https://httpstat.us/500',
    ];

    for (const url of websites) {
        try {
            const website = await prisma.website.upsert({
                where: {
                    userId_url: {
                        userId: user.id,
                        url: url
                    }
                },
                update: {},
                create: {
                    url: url,
                    userId: user.id
                }
            });
            console.log(`website: ${website.id} - ${website.url}`);
        } catch (error) {
            console.log(`website exists or error: ${url}`, error.message);
        }
    }

    const websiteCount = await prisma.website.count();
    const userCount = await prisma.user.count();
    const regionCount = await prisma.region.count();

    console.log(`users: ${userCount}`);
    console.log(`regions: ${regionCount}`);
    console.log(`websites: ${websiteCount}`);
}

main()
    .catch((error) => {
        console.error('seed error:', error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
