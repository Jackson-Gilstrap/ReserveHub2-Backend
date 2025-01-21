import express from "express";
import pool from "../db/postgres.js";

const appIdRouter = express.Router();


appIdRouter.get("/get-reservations/:id", async (req, res) => {
    const id_param = req.params.id;
    console.log(id_param)
    const query = `select * from fetch_reservation_by_app_id($1) order by client_surname asc`

    try {
        const data = await pool.query(query, [id_param])

        res.status(200).send({
            body: data.rows
        })
    } catch (error) {
        console.log(error)
    }
});


export default appIdRouter;