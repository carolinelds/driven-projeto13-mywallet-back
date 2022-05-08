import db from "./../db.js";
import bcrypt from 'bcrypt';
import joi from 'joi';

export async function registerUser(req, res) {
    const user = req.body;

    // FIXME: passar para middleware
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
        const hashPassword = bcrypt.hashSync(user.password, 10);
        await db.collection("users").insertOne({ ...user, password: hashPassword });
        res.sendStatus(201); // created
    } catch (e) {
        res.sendStatus(500); // internal server error
        console.log("Erro ao registrar", e);
    }
}