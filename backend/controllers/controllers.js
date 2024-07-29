import db from "../mysql-db/dbConfig.js"
import express from 'express'
import bodyParser from "body-parser";
import encryption from "../encryption.js";

const app = express();
app.use(bodyParser.json());
// Use body-parser middleware to parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

const addData = async (req, res) => {
  let connection;

  try {
    // Extract data from the request body
    const { email, emailPassword, username, website, websitePassword } = req.body;

    // Start a transaction to ensure atomicity
    connection = await db.getConnection();
    await connection.beginTransaction();

    // Check if the email already exists in the `users` table
    const [existingUser] = await connection.query(
      'SELECT email FROM users WHERE email = ?',
      [email]
    );

    // If the email does not exist, insert data into `users` table
    if (existingUser.length === 0) {
      await connection.query(
        'INSERT INTO users (email, emailPassword) VALUES (?, ?)',
        [email, emailPassword]
      );
    }

    // Insert data into `details` table
    await connection.query(
      'INSERT INTO details (email, website, username, websitePassword) VALUES (?, ?, ?, ?)',
      [email, website, username, encryption.encrypt(websitePassword)]
    );

    // Commit the transaction
    await connection.commit();
    res.status(201).send('Data added successfully');

  } catch (err) {
    // Rollback the transaction in case of error
    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackErr) {
        console.error('Error rolling back transaction:', rollbackErr);
      } finally {
        connection.release();
      }
    }
    console.error('Error adding data:', err);
    res.status(500).send('Error adding data');
  } finally {
    // Ensure connection is released if an error occurs before starting transaction
    if (connection && connection._pool) {
      connection.release();
    }
  }
};


const fetchAllData = async (req, res) => {

  const { email } = req.query;

  try {
    // Validate input
    if (!email) {
      return res.status(400).send('Email parameter is required');
    }

    // Query the database for details associated with the email
    const [rows] = await db.query(
      'SELECT email, website, username, websitePassword FROM details WHERE email = ?',
      [email]
    );

    // Check if any rows were returned
    if (rows.length === 0) {
      return res.status(404).send('No data found for the provided email');
    }

    // Decrypt websitePassword for each row
    const decryptedRows = rows.map(row => ({
      ...row,
      websitePassword: encryption.decrypt(row.websitePassword)
    }));

    // Send the fetched and decrypted data as JSON
    res.json(decryptedRows);

  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).send('Error fetching data');
  }
};

const deletePassword = async (req, res) => {
  const { email, website } = req.body;

  try {
    // Validate input
    if (!email || !website) {
      return res.status(400).send('Email and website are required');
    }

    // Delete data from `details` table
    const result = await db.query(
      'DELETE FROM details WHERE email = ? AND website = ?',
      [email, website]
    );

    // Check if any rows were affected
    if (result.affectedRows === 0) {
      return res.status(404).send('No data found to delete');
    }

    // Send success response
    res.status(200).send('Data deleted successfully');
  } catch (err) {
    console.error('Error deleting data:', err);
    res.status(500).send('Error deleting data');
  }
};


export default {
    addData,
    fetchAllData,
    deletePassword
}