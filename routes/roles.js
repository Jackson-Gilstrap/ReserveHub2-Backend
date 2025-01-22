import express from "express";
import pool from "../db/postgres.js";

const rolesRouter = express.Router();

rolesRouter.get("/check_role/:email", async (req, res) => {
    const email_param = req.params.email;
    const query = `select * from authorizationRoles where verified_email = ($1)`

    try {
        const data = await pool.query(query, [email_param])

        res.status(200).send({
            body: data.rows[0]
        })
    } catch (error) {
        console.log(error)
    }
});

export default rolesRouter;

