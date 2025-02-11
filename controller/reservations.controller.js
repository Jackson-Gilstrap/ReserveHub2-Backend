import pool from "../db/postgres.js";
import {
  formattedISO,
  formattedISOnoTime,
} from "../utility/datetime/dateConversion.js";
import { timeConverter } from "../utility/datetime/timeConversion.js";
import { makeFirstLetterCapital } from "../utility/validation/strings.js";
import createBookingRef from "../utility/bookingref.js";
import { join } from "path";

//need to create the delete function and edit the create function make it better

export async function create(req, res) {
  const {
    f_name,
    l_name,
    j_f_name,
    j_l_name,
    phone_number,
    zipcode,
    file_jointly,
    has_dependent,
    is_tce,
  } = req.body.final_data;
  const { app_id, app_date, app_time, app_type, app_location } =
    req.body.selectedAppointment;

  const joint_filer = `${j_f_name} ${j_l_name}`

  const bookingRef = createBookingRef(
    app_location,
    makeFirstLetterCapital(f_name),
    makeFirstLetterCapital(l_name)
  );
  const check_client_query = "SELECT * FROM check_client($1,$2,$3)";
  const insert_client_query = "select * from insert_client($1,$2,$3,$4)";
  const create_reservation_with_client_query =
    "select * from create_reservation($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)";
  const create_reservation_without_client_query =
    "select * from create_reservation($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)";
  try {
    const check_client = await pool.query(check_client_query, [
      makeFirstLetterCapital(l_name),
      phone_number,
      zipcode,
    ]);

    if (check_client.rows.length > 0) {
      const { client_id } = check_client.rows[0];
      console.log(client_id)
      
      const reservation_row = await pool.query(
        create_reservation_with_client_query,
        [
          bookingRef,
          parseInt(client_id),
          app_id,
          app_date,
          app_time,
          app_type,
          app_location,
          file_jointly,
          has_dependent,
          is_tce,
          joint_filer,
        ]
      );

      const cleanedReservationData = reservation_row.rows.map((row) => ({
        booking_ref: row.booking_ref,
        res_date: row.res_date,
        res_time: row.res_time,
        res_location: row.res_location,
        res_type: row.res_type,
        file_jointly: row.file_jointly,
        for_dependent: row.for_dependent,
        is_tce: row.is_tce,
        created_at: row.created_at,
        joint_filer: row.joint_filer
      }));

      console.log(cleanedReservationData);

      res.status(201).send({
        status: "Success",
        message: "Reservation successfully created",
        booking_ref: bookingRef,
        body: cleanedReservationData,
      });

      //destructure the client _id
      //then make new sp call
    } else {
      //now if client does not exist
      const insert_client = await pool.query(insert_client_query, [
        makeFirstLetterCapital(f_name),
        makeFirstLetterCapital(l_name),
        phone_number,
        zipcode,
      ]);

      const { client_id } = insert_client.rows[0]; //check if this is an int query says it returns an int.

      //make reservation
      const create_reservation = await pool.query(
        create_reservation_without_client_query,
        [
          bookingRef,
          client_id,
          app_id,
          app_date,
          app_time,
          app_type,
          app_location,
          file_jointly,
          has_dependent,
          is_tce,
          joint_filer,
        ]
      );

      const cleanedReservationData = create_reservation.rows.map((row) => ({
        booking_ref: row.booking_ref,
        res_date: row.res_date,
        res_time: row.res_time,
        res_location: row.res_location,
        res_type: row.res_type,
        file_jointly: row.file_jointly,
        for_dependent: row.for_dependent,
        is_tce: row.is_tce,
        created_at: row.created_at,
        joint_filer: row.joint_filer,
      }));

      console.log(cleanedReservationData);
      res.status(201).send({
        status: "Success",
        message: "Reservation successfully created",
        booking_ref: bookingRef,
        body: cleanedReservationData,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      body: "Internal server error",
    });
  }
}

export async function remove(req, res) {
  console.log("running");
  const { bookingRef } = req.params;
  console.log(bookingRef);
  const query = "SELECT delete_reservation($1);";
  try {
    const delete_app = await pool.query(query, [bookingRef]);

    res.status(200).send({
      status: "success",
      message: `Reservation with id of ${bookingRef} has been successfully deleted`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: "failed",
      message: "Internal server error",
    });
  }
}

export async function read(req, res) {
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
}

export async function readWithBookingRef(req, res) {
  const { bookingRef } = req.params;
  const query = "Select * from reservations where booking_ref = $1";
  try {
    const reservations = await pool.query(query, [bookingRef]);

    const {
      booking_ref,
      created_at,
      file_jointly,
      for_dependent,
      is_tce,
      res_date,
      res_location,
      res_time,
      res_type,
    } = reservations.rows[0];
    const sanitizedData = {
      booking_ref,
      res_date: formattedISOnoTime(res_date),
      res_time: timeConverter(res_time),
      res_location,
      res_type,
      file_jointly,
      for_dependent,
      is_tce,
      created_at: formattedISO(created_at),
    };

    if (reservations.rows.length > 0) {
      res.status(200).send({
        status: "Success",
        body: sanitizedData,
        message: "Reservation successfully retrieved",
      });

      return;
    }

    res.status(404).send({
      status: "Failed",
      message: "No Reservation found",
    });
  } catch (err) {
    res.status(500).send({
      status: "Failed",
      message: "Internal server error",
      error: err.message,
    });
  }
}

export async function readWithDate(req, res) {
  const date_param = req.params.date;
  const query = `select * from fetch_reservations_by_date($1) order by res_time asc, client_surname asc`;

  try {
    const data = await pool.query(query, [date_param]);

    res.status(200).send({
      body: data.rows,
    });
  } catch (error) {
    console.log(error);
  }
}

export async function readWithAppointmentID(req, res) {
  const id_param = req.params.id;
  const query = `select * from fetch_reservation_by_app_id($1) order by client_surname asc`;

  try {
    const data = await pool.query(query, [id_param]);

    res.status(200).send({
      body: data.rows,
    });
  } catch (error) {
    console.log(error);
  }
}
