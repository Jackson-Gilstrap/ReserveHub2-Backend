import pool from "../db/postgres.js";


export async function checkRole (req, res) {
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
}