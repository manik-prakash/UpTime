import 'dotenv/config';
import express from 'express'
import cors from 'cors'
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


app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});