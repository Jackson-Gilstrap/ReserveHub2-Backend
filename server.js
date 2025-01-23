import express from "express";
import cors from 'cors';
//routers
import locationRouter from "./routes/locations.route.js";
import rolesRouter from "./routes/roles.route.js";
import appointmentsRouter from "./routes/appointments.route.js";
import reservationsRouter from "./routes/reservations.route.js";

const port = process.env.PORT || 8000

const app = express()


//  middleware
app.use(express.json())
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ["Content-Type"]
}))

//  routes

    //  ROLES
app.use(`/api/auth/`, rolesRouter)

    //  LOCATIONS
app.use(`/api/locations`, locationRouter)

    //  APPOINTMENTS
app.use(`/api/appointments`, appointmentsRouter)

    //  RESERVATIONS
app.use(`/api/reservations`, reservationsRouter)








app.listen(port, ()=> console.log(`Server is running on port ${port}`))