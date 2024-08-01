import express from 'express';
import db from './mysql-db/dbConfig.js';
import dotenv from 'dotenv';
import routes from './routes/routes.js';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());  // Middleware to parse JSON bodies

const PORT = process.env.PORT || 3000; // Provide a default port if not set

// Check DB connection (wait for some time till mysql is initialised) and create tables
const checkDB = async () => {
  const maxRetries = 10;
  const delay = 3000; // 3 seconds
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const [rows] = await db.query('SELECT 1 AS test');
      console.log('Connection successful:', rows);
      return;
    } catch (err) {
      if (attempt === maxRetries) {
        console.error('Connection error after retries:', err);
        process.exit(1);
      }
      console.error(`Retry ${attempt}/${maxRetries} failed. Retrying in ${delay / 1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};


const createTables = async () => {
  try {
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        email VARCHAR(255) PRIMARY KEY,
        emailPassword VARCHAR(255) NOT NULL
      );
    `;

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

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await checkDB();
  await createTables();
});

app.use('/', routes);
