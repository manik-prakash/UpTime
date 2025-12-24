import 'dotenv/config';
import express from 'express'
import cors from 'cors'
import prisma from "@repo/db/client";
import authRoute from './routes/authRoute';
import { verify } from './middleware/verify';
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const PORT = 3000;
app.use(cors({
    origin: ["*"],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.get('/health', (req, res) => {
    res.send("working backend");
})

app.use("/auth", authRoute);

app.post("/website", verify, async (req, res) => {
    if (!req.body.url) {
        res.status(411).json({});
        return
    }
    const website = await prisma.website.create({
        data: {
            url: req.body.url,
            userId: req.body.userId
        }
    })
    res.json({
        id: website.id
    })
});

app.get("/status/:websiteId", verify, async (req, res) => {
    const website = await prisma.website.findFirst({
        where: {
            userId: req.body.userId,
            id: req.params.websiteId,
        },
        include: {
            ticks: {
                orderBy: [{
                    createdAt: 'desc',
                }],
                take: 1
            }
        }
    })

    if (!website) {
        res.status(409).json({
            message: "Not found"
        })
        return;
    }

    res.json({
        url: website.url,
        id: website.id,
        user_id: website.userId
    })

})


app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});