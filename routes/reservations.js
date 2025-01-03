import express from "express";
import pool from "../db/postgres.js";
import createBookingRef from "../utility/bookingref.js";
import { convertStr2Bool } from "../utility/handleCheckbox.js";
import {formattedISO, formattedISOnoTime} from "../utility/datetime/dateConversion.js";
import {timeConverter} from "../utility/datetime/timeConversion.js"

const resRouter = express.Router();

//  desc    get reservations
//  route   /api/get-reservations
//  access  private
resRouter.get("/", async (req, res) => {
  const query = "Select * from reservations";
  try {
    const reservations = await pool.query(query);
    if (reservations.rows.length > 0) {
      res.status(200).send({
        status: "Success",
        body: reservations.rows,
        message: "Reservations successfully retrieved",
      });
    }
  } catch (err) {
    res.status(500).send({
      status: "Failed",
      message: "Internal server error",
      error: err.message,
    });
  }
});

//  desc    get reservation
//  route   /api/get-reservation/
//  access  public
//  not finished

resRouter.get("/:bookingRef", async (req, res) => {
  const { bookingRef } = req.params;
  const query = "Select * from reservations where booking_ref = $1";
  try {
    const reservations = await pool.query(query, [bookingRef]);

    const {booking_ref, created_at, file_jointly, for_dependent, res_date, res_location, res_time, res_type} = reservations.rows[0]
    const sanitizedData = {
      booking_ref,
      res_date: formattedISOnoTime(res_date),
      res_time: timeConverter(res_time),
      res_location,
      res_type,
      file_jointly,
      for_dependent,
      created_at: formattedISO(created_at),
    }
    
    if (reservations.rows.length > 0) {
      res.status(200).send({
        status: "Success",
        body: sanitizedData,
        message: "Reservation successfully retrieved",
      });

      return; // ends function if reservation found.
    }

    res.status(404).send({
      status: "Failed",
      message: "No Reservation found"
    })
  } catch (err) {
    res.status(500).send({
      status: "Failed",
      message: "Internal server error",
      error: err.message,
    });
  }
});

//  desc    create reservations
//  route   /api/create-reservations
//  access  public

resRouter.post("/", async (req, res) => {
  // console.log("request body", req.body);
  const { f_name, l_name, phone_number, zipcode, file_jointly, has_dependent } = req.body.final_data;
  const {
    app_id,
    app_date,
    app_time,
    app_type,
    app_location,
    app_status, //need to update this to show

  } = req.body.selectedAppointment;

  const bookingRef = createBookingRef(app_location, f_name, l_name);
  // need to format the file jointly and has dependents corectly
  const check_client_query =
    "SELECT * FROM clients WHERE client_given_name = $1 AND client_surname = $2 AND client_zipcode = $3";
  const insert_client_query =
    "INSERT INTO clients (client_given_name, client_surname, client_zipcode, client_phone_number) VALUES($1,$2,$3,$4) RETURNING client_id";
  const select_appointment_query =
    "SELECT * FROM appointments WHERE app_id = $1 FOR UPDATE";
  const insert_reservation_query =
    "INSERT INTO reservations (booking_ref, app_id, client_id, res_date, res_time, res_type, res_location, file_jointly, for_dependent) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *";
  const update_appointment_query1 =
    "UPDATE appointments set cur_slots = $1 WHERE app_id = $2";
  const update_appointment_query2 =
    "UPDATE appointments set app_status = $1 WHERE app_id = $2";
  try {
    //check if client already exists outside the transaction // but need to check if they have a reservation
    const client = await pool.query(check_client_query, [
      f_name,
      l_name,
      zipcode,
    ]);

    if (client.rows.length > 0) {
      res.status(409).send({
        status: "Conflict",
        message: "Client already exists in system",
      });

      return; // early exit from function on found client
    }
    //insert client into db
    //might remove as client should already exist
    await pool.query("BEGIN");
    const insertClient = await pool.query(insert_client_query, [
      f_name,
      l_name,
      zipcode,
      phone_number,
    ]);

    console.log(insertClient.rows);

    const { client_id } = insertClient.rows[0];

    //select appointment and destructure the ammount of slots left open on it
    const app_res = await pool.query(select_appointment_query, [app_id]);
    const { cur_slots, max_slots } = app_res.rows[0];

    // check availability
    if (cur_slots < max_slots) {
      //insert reservation
      const reservationRow = await pool.query(insert_reservation_query, [
        bookingRef,
        app_id,
        parseInt(client_id),
        app_date,
        app_time,
        app_type,
        app_location,
        file_jointly,
        has_dependent,
      ]);

      //update appointment row need to update the status
      await pool.query(update_appointment_query1, [cur_slots + 1, app_id]);

      const cleanedReservationData = reservationRow.rows.map((row) => ({
        booking_ref: row.booking_ref,
        res_date: row.res_date,
        res_time: row.res_time,
        res_location: row.res_location,
        res_type: row.res_type,
        file_jointly: row.file_jointly,
        for_dependent: row.for_dependent,
        created_at: row.created_at
      }));

      console.log(cleanedReservationData)
      await pool.query("COMMIT");
      res.status(201).send({
        status: "Success",
        message: "Reservation successfully created",
        booking_ref: bookingRef,
        body: cleanedReservationData,
      });
    } else {
      //appointment is full
      await pool.query(update_appointment_query2, [0, app_id]);
      await pool.query("COMMIT");
      res.status(409).send({
        status: "Conflict",
        message: "Appointment is full",
      });
    }
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error(error);
    res.status(500).send({
      status: "failed",
      body: "Internal server error",
    });
  }
});

//  desc    update reservations
//  route   /api/get-reservations
//  access  public || private

//  desc    delete reservations
//  route   /api/get-reservations
//  access  public || private

export default resRouter;
