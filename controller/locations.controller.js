import pool from "../db/postgres.js";


export async function create (req, res) {
    const { location_name, location_street_address, location_city, location_state, location_zipcode } = req.body;
    const query = "INSERT INTO locations(location_name, location_street_address, location_city, location_state, location_zipcode)VALUES($1,$2,$3,$4,$5) RETURNING *"
    try {
      const loc_row = await pool.query(
        query,
        [location_name, location_street_address, location_city, location_state, location_zipcode]
      );
  
      if (loc_row.rows.length > 0) {
        res.status(201).send({
          status: "success",
          body: loc_row.rows[0],
          message: "Created location",
        });
      }
    } catch (error) {
      res.status(500).send({
        status: "failed",
        message: "Internal server error",
        error: error.message
      });
    }
}

export async function edit (req, res) {
    const loc_id = parseInt(req.params.id);
    const {
      loc_title,
      loc_street_address,
      loc_city,
      loc_state,
      loc_zipcode,
      weekdayArray,
    } = req.body;
    const query ="UPDATE locations set location_name = $1, location_street_address = $2, location_city = $3, location_state = $4, location_zipcode = $5, weekdays = $6 WHERE location_id = $7 RETURNING *"
    try {
      const edit_loc = await pool.query(
        query,
        [
          loc_title,
          loc_street_address,
          loc_city,
          loc_state,
          loc_zipcode,
          weekdayArray,
          loc_id,
        ]
      );
      console.log(edit_loc.rows);
      if (edit_loc.rows.length > 0) {
        res.status(201).send({
          status: "success",
          body: edit_loc.rows[0],
          message: `successfully updated location with id of ${loc_id}`,
        });
      }
    } catch (err) {
      res.status(500).send({
        status: "failed",
        message: "Internal server error",
        error: err.message
      });
    } 
}

export async function remove (req, res) {
    const loc_id = parseInt(req.params.id);
    const query = "DELETE FROM locations WHERE location_id = $1"
    try {
      const delete_loc = await client.query(
        query,
        [loc_id]
      );
  
      res.status(200).send({
        status: "success",
        message: `appointment with id of ${loc_id} has been successfully deleted`,
      });
    } catch (err) {
      res.status(500).send({
        transaction: "failed",
        msg: "Interal server error",
        error: err.message
      })
    }
}

export async function read (req, res) {
    const query = 'Select * from locations';
    try {
      const location_row = await pool.query(query);
      if (location_row.rows.length > 0) {
        res.status(200).send({
          status: "success",
          body: location_row.rows,
          message: "successfully retrived all locations",
        });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({
        status: "failed",
        message: "Internal server error", 
        error: err.message
      });
    }
}

export async function readWithId (req, res) {
    const location_id = req.params.location_id;
    const query = "SELECT * FROM locations WHERE location_id = $1"
    try {
      const location_row = await pool.query(
        query,
        [parseInt(location_id)]
      );
      if (location_row.rows.length > 0) {
        res.status(200).send({
          status: "success",
          body: location_row.rows[0],
          message: `successfully retrieved data on location with id of ${location_id}`,
        });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({
        status: "failed",
        message: "Internal server error",
        error: err.message
      });
    }
}