import pkg from "pg"
const { Pool } = pkg
import dotenv from 'dotenv';

dotenv.config()


const pool_config = {
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,

}
const pool = new Pool(pool_config)

export default pool;