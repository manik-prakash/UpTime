import 'dotenv/config';
import express from 'express'
import cors from 'cors'
import authRoute from './routes/authRoute';
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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

app.post('/website/add',(req,res) =>{

})

app.get('/website/:id',(req,res) =>{

    const id = req.params.id;

})

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});