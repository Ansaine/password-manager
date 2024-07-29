import express from 'express'
import db from './mysql-db/dbConfig.js'

// Environment variables
import dotenv from 'dotenv';
import routes from './routes/routes.js';
dotenv.config()

// Express configurations
const app = express();
app.use(express.json());  // Middleware to parse JSON bodies - Fixed error unable to destructure req.body
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  checkDB();
  createTables(db);
  }
);

app.use('/',routes)

// check DB connection
const checkDB = async () => {
  try {
    const checkQuery = await db.query('SELECT 1 AS test');
    console.log('Connection successful: ', checkQuery[0]);
  } catch (err) {
    console.error('Connection error:', err);
  }
};

// Create initial tables if not present
const createTables = async (db) => {
  try {
    // SQL to create `users` table
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        email VARCHAR(255) PRIMARY KEY,
        emailPassword VARCHAR(255) NOT NULL
      );
    `;

    // SQL to create `details` table
    const createDetailsTable = `
    CREATE TABLE IF NOT EXISTS details (
      email VARCHAR(255) NOT NULL,
      website VARCHAR(255) NOT NULL,
      username VARCHAR(255) NOT NULL,
      websitePassword VARCHAR(255) NOT NULL,
      PRIMARY KEY (email, website),
      FOREIGN KEY (email) REFERENCES users(email) ON DELETE CASCADE
    );
  `;
  

    // Execute the SQL statements
    await db.query(createUsersTable);
    await db.query(createDetailsTable);

    console.log('Tables checked and created if they did not exist.');
  } catch (err) {
    console.error('Error creating tables:', err);
  }
};


