import 'dotenv/config';
import './env.js';
import express from 'express';
import cors from 'cors';
import authRoute from './routes/authRoute.js';
import websiteRoute from './routes/websiteRoute.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;
const ALLOWED_ORIGINS = process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(',').map(origin => origin.trim())
    : ["http://localhost:3000", "http://localhost:3001"];

app.use(cors({
    origin: ALLOWED_ORIGINS,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.get('/health', (req, res) => {
    res.send("working backend");
})

app.use("/auth", authRoute);
app.use("/api", websiteRoute);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});