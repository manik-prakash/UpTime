import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoute from './routes/authRoute.js';
import { initializeRedis } from '@repo/redis/client';
import websiteRoute from './routes/websiteRoute.js';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const PORT = 5000;
app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.get('/health', (req, res) => {
    res.send("working backend");
})

app.use("/auth", authRoute);
app.use("/api", websiteRoute);

// (async () => {
//     try {
//         await initializeRedis();
//         console.log('redis ready');
//     } catch (error) {
//         console.error('redis init failed:', error);
//     }


// })();

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});