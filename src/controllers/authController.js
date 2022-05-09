import db from "./../db.js";
import bcrypt from 'bcrypt';
import joi from 'joi';
import { v4 as uuid } from 'uuid';

export async function signUp(req, res) {
    const user = req.body;

    const userSchema = joi.object({
        name: joi.string().required(),
        email: joi.string().required(),
        password: joi.string().required()
    });
    const validation = userSchema.validate(user, { abortEarly: true });
    if (validation.error) {
        console.log(validation.error.details);
        res.sendStatus(422);
        return;
    };

    try {
        const emailUsed = await db.collection("users").findOne({ email: user.email });
        if (emailUsed) {
            console.log("Esse email já foi cadastrado.");
            res.sendStatus(409);
            return;
        };

        const hashPassword = bcrypt.hashSync(user.password, 10);
        await db.collection("users").insertOne({ ...user, password: hashPassword });

        const savedUser = await db.collection("users").findOne({ password: hashPassword });

        const userBalance = {
            userId: savedUser._id,
            movements: [],
            balance: 0
        }
        await db.collection("movements").insertOne(userBalance);

        res.sendStatus(201);
    } catch (e) {
        res.sendStatus(500);
        console.log("Erro ao registrar", e);
    };
}

export async function signIn(req, res) {
    const login = req.body;

    const loginSchema = joi.object({
        email: joi.string().required(),
        password: joi.string().required()
    });
    const validation = loginSchema.validate(login, { abortEarly: true });
    if (validation.error) {
        console.log(validation.error.details);
        res.sendStatus(422);
        return;
    };

    try {
        const user = await db.collection("users").findOne({ email: login.email });

        if (user && bcrypt.compareSync(login.password, user.password)) {
            const token = uuid();
            await db.collection("sessions").insertOne({
                token,
                userId: user._id
            });

            const response = {
                token,
                name: user.name
            };
            
            res.status(200).send(response);
        } else {
            res.sendStatus(404);
        }
    } catch (e) {
        res.sendStatus(500);
        console.log("Erro ao fazer login", e);
    }
}