import express from "express";
import { create, edit, remove, read, readWithId } from "../controller/locations.controller.js";

const locationRouter = express.Router();

//create
//edit
//delete
//read
//read with param id
locationRouter.post("/create", create);
locationRouter.put("/edit/:id", edit);
locationRouter.delete("/delete/:id", remove);
locationRouter.get("/read", read);
locationRouter.get("/read/:location_id", readWithId);








export default locationRouter;