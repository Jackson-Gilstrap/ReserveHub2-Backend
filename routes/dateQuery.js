import express from "express";
import pool from "../db/postgres.js";

const dateQueryRouter = express.Router();


dateQueryRouter.get("/get-reservations/:date", async (req, res) => {
    const date_param = req.params.date;
    const query = `select * from fetch_reservations_by_date($1)`

    try {
        const data = await pool.query(query, [date_param])

        res.status(200).send({
            body: data.rows
        })
    } catch (error) {
        console.log(error)
    }
});


export default dateQueryRouter;