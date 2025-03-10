import pool from "../db/postgres.js";
import { formattedISOnoTime } from "../utility/datetime/dateConversion.js";
import { timeConverter } from "../utility/datetime/timeConversion.js";

export async function create(req, res) {
  const { app_title, app_date, app_time, app_type, app_location, max_slots } =
    req.body;
  const cur_slots = 0;
  const app_status = 1;
  const query =
    "INSERT INTO appointments(app_date, app_time, app_type, app_location, app_status, cur_slots, max_slots, app_title) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *";

  try {
    const create_app = await pool.query(query, [
      app_date,
      app_time,
      app_type,
      app_location,
      app_status,
      cur_slots,
      parseInt(max_slots),
      app_title,
    ]);
    if (create_app.rows.length > 0) {
      res.status(201).send({
        status: "success",
        body: create_app.rows[0],
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({
      status: "failed",
      body: "Internal server error",
    });
  }
}

export async function edit(req, res) {
    console.log("edit body: ", req.body);
  const app_id = parseInt(req.params.id);
  const {
    app_title,
    app_date,
    app_time,
    app_type,
    app_location,
    app_status,
    cur_slots,
    max_slots,
  } = req.body;
  const c_slots = parseInt(cur_slots);
  const m_slots = parseInt(max_slots);
  const a_status = parseInt(app_status);

  const query = "UPDATE appointments set app_title = $1, app_date = $2, app_time = $3, app_location = $4, app_status = $5, cur_slots = $6, max_slots = $7, app_type = $8 WHERE app_id = $9 RETURNING *"
  try {
    const edit_app = await pool.query(
      query,
      [
        app_title,
        app_date,
        app_time,
        app_location,
        a_status,
        c_slots,
        m_slots,
        app_type,
        app_id,
      ]
    );
    if (edit_app.rows.length > 0) {
      res.status(201).send({
        status: "success",
        body: edit_app.rows[0],
        message: "Appointment successfully updated",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({
      status: "failed",
      body: "Internal server error",
    });
  }
}

export async function remove(req, res) {
    const app_id = parseInt(req.params.id);
  const query = "DELETE FROM appointments WHERE app_id = $1"
  try {
    const delete_app = await pool.query(
      query,
      [app_id]
    );

    res.status(200).send({
      status: "success",
      message: `appointment with id of ${app_id} has been successfully deleted`,
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
    const query = "Select * from appointments";
  try {
    const get_appointments = await pool.query(query);

    const sanitizedData = get_appointments.rows.map(row => ({
      app_id: row.app_id,
      app_date: formattedISOnoTime(row.app_date),
      app_time: timeConverter(row.app_time),
      app_type: row.app_type,
      app_location: row.app_location,
      app_status: row.app_status,
      cur_slots: row.cur_slots,
      max_slots: row.max_slots,
      app_title: row.app_title
    }));

    if (get_appointments.rows.length > 0) {
      res.status(200).send({
        status: "success",
        body: sanitizedData,
        message: "Successfully retrieved all appointments",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({
      status: "failed",
      message: "Internal server error",
    });
  }
}

export async function readWithAppointmentId(req, res) {
    const{ id }= req.params;
  const query = "Select * from appointments WHERE app_id = $1";
  try {
    const app_row = await pool.query(query, [id]);

    if (app_row.rows.length > 0) {
      res.status(200).send({
        status: "success",
        body: app_row.rows[0],
        message: "Retrieved appointment",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: "failed",
      message: "Internal server error",
    });
  }
}

export async function readWithLocationId(req, res) {
  console.log(req.params)
  const {id }= req.params;

  const query = "Select * from get_appointments_by_location($1)";
  try {
    const app_row = await pool.query(query, [parseInt(id)]);

    if (app_row.rows.length > 0) {
      res.status(200).send({
        status: "success",
        body: {
          appointments: app_row.rows,
        },
        message: `Retrieved appointments for ${id}`,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: "failed",
      message: "Internal server error",
    });
  }
}
