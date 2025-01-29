import pkg from "pg"
const { Pool } = pkg
import dotenv from 'dotenv';
import { readFileSync } from 'fs';


dotenv.config({ path: '.env.production' })

const caCert = readFileSync('./certs/global-bundle.pem').toString();

const pool_config = {
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT || 5432,
    ssl: {
        rejectUnauthorized: true, // Use true with a valid certificate
        ca: caCert
    },

}
const pool = new Pool(pool_config)

export default pool;