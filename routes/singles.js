import express from "express";
import pool from "../db/postgres.js";

const singleRouter = express.Router();


//  desc  get appointments by location name
//  route /api/get-appointment/:location_name
//  access  private

singleRouter.get("/:location_id", async (req, res) => {
    const location_id = req.params.location_id;
    console.log(location_id)
    const query = "Select * from get_appointments_by_location($1)";
    const query2 = "Select * from get_reservations_by_location($1)";
    try {
      const app_row = await pool.query(query, [parseInt(location_id)]);
      const res_row = await pool.query(query2, [parseInt(location_id)])
  
      if (app_row.rows.length > 0 || res_row.rows > 0) {
        res.status(200).send({
          status: "success",
          body: {
            appointments: app_row.rows,
            reservations: res_row.rows
          },
          message: `Retrieved appointments for ${location_id}`,
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({
        status: "failed",
        message: "Internal server error",
      });
    }
  });

  export default singleRouter;