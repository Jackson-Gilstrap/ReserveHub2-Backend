import express from "express";
import { create,edit,remove,read, readWithAppointmentId,readWithLocationId } from "../controller/appointments.controller.js";

const appointmentsRouter = express.Router();

//create
//edit
//delete
//read
//read with param id

appointmentsRouter.post("/create", create);
appointmentsRouter.put("/edit/:id", edit);
appointmentsRouter.delete("/delete/:id", remove);
appointmentsRouter.get("/read", read);
appointmentsRouter.get("/read/appointment/:id", readWithAppointmentId);
appointmentsRouter.get("/read/location/:id", readWithLocationId);

export default appointmentsRouter;