import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
}).on('error', (err) => {
    console.error('Unexpected error on MySQL client', err);
    process.exit(-1);
});

const db = pool.promise();
export default db;

