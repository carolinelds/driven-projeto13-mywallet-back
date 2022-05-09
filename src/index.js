import express, { json } from 'express';
import cors from 'cors';
import authRouter from './routes/authRouter.js';
import userRouter from './routes/userRouter.js';
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(json());

app.use(authRouter);
app.use(userRouter);

app.listen(process.env.PORT, () => console.log("Server is running."));