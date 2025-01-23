import express from "express";
import { create, remove, read, readWithBookingRef, readWithDate, readWithAppointmentID } from "../controller/reservations.controller.js";

const reservationsRouter = express.Router();

//create
//delete
//read
//read with param booking ref

reservationsRouter.post("/create", create);
reservationsRouter.delete("/delete/:bookingRef", remove);
reservationsRouter.get("/read", read);
reservationsRouter.get("/read/bookingRef/:bookingRef", readWithBookingRef);
reservationsRouter.get("/read/date/:date", readWithDate);
reservationsRouter.get("/read/id/:id", readWithAppointmentID);

export default reservationsRouter;