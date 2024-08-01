import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_ROOT_PASSWORD,
  database: process.env.MYSQL_DATABASE
}).on('error', (err) => {
    console.error('Unexpected error on MySQL client', err);
    process.exit(-1);
});

const db = pool.promise();
export default db;

