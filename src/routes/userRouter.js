import { Router } from 'express';
import { getMovements, addMovement } from './../controllers/userController.js';

const userRouter = Router();

userRouter.get("/user", getMovements);
userRouter.post("/user", addMovement);

export default userRouter;