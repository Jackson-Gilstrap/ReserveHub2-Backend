import express from "express";
import cors from 'cors';
import appRouter from "./routes/appointments.js";
import locRouter from "./routes/locations.js";
import resRouter from "./routes/reservations.js";
const port = process.env.PORT || 8000


const app = express()
//  middleware
app.use(express.json())
// app.options("*",cors() ) // could induce security risks
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ["Content-Type"]
}))


//  routes

//  appointments
app.use('/api/get-appointments', appRouter);
app.use('/api/get-appointment', appRouter);
app.use('/api/create-appointment', appRouter);
app.use('/api/update-appointment', appRouter);
app.use('/api/delete-appointment', appRouter);

//  locations
app.use('/api/get-locations', locRouter);
app.use('/api/get-location', locRouter);
app.use('/api/create-location', locRouter);
app.use('/api/update-location', locRouter);
app.use('/api/delete-location', locRouter);

//  reservations
app.use('/api/get-reservations', resRouter);
app.use('/api/get-reservation/', resRouter);
app.use('/api/create-reservation', resRouter); // needs updates !!!
app.use('/api/update-reservation', resRouter); // not implemented
app.use('/api/delete-reservation', resRouter); // not implemented

app.listen(port, ()=> console.log(`Server is running on port ${port}`))