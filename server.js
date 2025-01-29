import express from "express";
import cors from 'cors';
//routers
import locationRouter from "./routes/locations.route.js";
import rolesRouter from "./routes/roles.route.js";
import appointmentsRouter from "./routes/appointments.route.js";
import reservationsRouter from "./routes/reservations.route.js";

const port = process.env.PORT || 8080
const allowsOrigins = [
    'http://localhost:3000',
    'https://reserve-hub-phi.vercel.app',
    'https://freetaxservices.org'
]

const app = express()

console.log(`Running Node.js version: ${process.version}`);




//  middleware
app.use(express.json())
app.use(cors({
    origin: (origin, callback) => {
        if (allowsOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
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

app.get(`/health`, (req, res) => {
    res.status(200).json({ status: 'ok' });
})








app.listen(port, ()=> console.log(`Server is running on port ${port}`))