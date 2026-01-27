import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoute from './routes/authRoute.js';
import { initializeRedis } from '@repo/redis/client';

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

(async () => {
    try {
        await initializeRedis();
        console.log('redis ready');
    } catch (error) {
        console.error('redis init failed:', error);
    }

    app.listen(PORT, () => {
        console.log(`server running on port ${PORT}`);
    });
})();