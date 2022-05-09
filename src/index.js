import express, { json } from 'express';
import cors from 'cors';
import { signUp, signIn } from './controllers/authController.js';
import { getMovements, addMovement } from './controllers/userController.js';

const app = express();
app.use(cors());
app.use(json());

app.post("/sign-up", signUp);
app.post("/sign-in", signIn);

app.get("/user", getMovements);
app.post("/user", addMovement);

app.listen(5000, () => console.log("Server is running."));