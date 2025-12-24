import express from 'express'
import cors from 'cors'

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:3002"],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.get('/health',(req,res) => {
    res.send("working backend");
})

app.post('/auth/signup',(req,res) => {
    const {username , password} = req.body
    if(!username || !password){
        res.json({})
    }
})