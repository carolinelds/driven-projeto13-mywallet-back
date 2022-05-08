import express, { json } from 'express';
import cors from 'cors';
import { registerUser } from './controllers/authController.js';

const app = express();
app.use(cors());
app.use(json());

app.post("/sign-up", registerUser);

app.listen(5000, () => console.log("Server is running."));