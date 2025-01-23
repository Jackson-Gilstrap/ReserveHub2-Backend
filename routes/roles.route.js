import express from "express";
import { checkRole } from "../controller/roles.controller.js";

const rolesRouter = express.Router();

//read with email param
rolesRouter.get("/read/:email", checkRole)

export default rolesRouter;

