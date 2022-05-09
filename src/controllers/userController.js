import db from "./../db.js";

export async function getMovements(req,res){
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer", "").trim();
    if (!token) return res.sendStatus(401);

    try {
        const session = await db.collection("sessions").findOne({ token });
        if (!session) return res.sendStatus(401);

        const movements = await db.collection("movements").findOne({ userId: session.userId });

        if (movements){
            delete movements.userId;

            res.send(movements);
        }

    } catch(e) {
        res.sendStatus(500);
    }
}