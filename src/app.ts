import express from 'express'
import cors from 'cors'
import { router } from './routes/index.js';
import cookieParser from 'cookie-parser';

export const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(cookieParser())
app.use(express.json());
app.use('/api', router);