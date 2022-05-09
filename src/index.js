import express, { json } from 'express';
import cors from 'cors';
import { signUp, signIn } from './controllers/authController.js';

const app = express();
app.use(cors());
app.use(json());

app.post("/sign-up", signUp);
app.post("/sign-in", signIn);

app.listen(5000, () => console.log("Server is running."));