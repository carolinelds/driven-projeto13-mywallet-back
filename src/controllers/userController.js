import db from "./../db.js";
import joi from "joi";
import dayjs from 'dayjs';

export async function getMovements(req, res) {

    // FIXME: passar para middleware
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer", "").trim();
    if (!token) return res.sendStatus(401);

    try {
        const session = await db.collection("sessions").findOne({ token });
        if (!session) return res.sendStatus(401);

        const movements = await db.collection("movements").findOne({ userId: session.userId });

        if (movements) {
            delete movements.userId;
            res.send(movements);
        }

    } catch (e) {
        res.sendStatus(500);
    }
}

export async function addMovement(req, res) {

    // FIXME: passar para middleware
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer", "").trim();
    if (!token) return res.sendStatus(401);

    let diaMes = dayjs().toDate();
    diaMes = dayjs(diaMes).format("DD/MM");

    try {
        const session = await db.collection("sessions").findOne({ token });
        if (!session) return res.sendStatus(401);

        const movement = req.body;

        const movementSchema = joi.object({
            type: joi.any().valid('in', 'out').required(),
            value: joi.number().sign('positive').precision(2).required(),
            description: joi.string().required()
        });
        const validation = movementSchema.validate(movement, { abortEarly: true });
        if (validation.error) {
            console.log(validation.error.details);
            res.sendStatus(422);
            return;
        };

        let value = movement.value;
        if (movement.type === 'out') value = (-1) * value;

        const userId = session.userId;
        const newMovement = {...movement, date: diaMes };
        console.log(newMovement);

        await db.collection("movements").updateOne(
            { userId },
            {
                $push: { movements: newMovement },
                $inc: { balance: value }
            }
        );

        res.sendStatus(200);

    } catch (e) {
        res.sendStatus(500);
    }
}