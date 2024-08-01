import db from "../mysql-db/dbConfig.js"
import encryption from "../encryption.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

// Environment variables
import dotenv from 'dotenv';
dotenv.config()


const addData = async (req, res) => {
  let connection;

  try {
    // Extract data from the request body
    const { email, username, website, websitePassword } = req.body;

    // Start a transaction to ensure atomicity
    connection = await db.getConnection();
    await connection.beginTransaction();

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

// registration is simply added email and its hashed password to db
const register = async (req, res) => {
  const { email, emailPassword } = req.body;
  console.log("At /register : ", email, " ", emailPassword);

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(emailPassword, 10);

    // Insert the user into the database
    const [results] = await db.query(
      'INSERT INTO users (email, emailPassword) VALUES (?, ?)',
      [email, hashedPassword]
    );

    // Send a success response
    res.status(201).send('User registered');
  } catch (err) {
    console.error('Error registering user:', err);
    // Send an error response if there's an issue
    res.status(500).send('Error registering user');
  }
};

const login = async (req, res) => {
  const { email, emailPassword } = req.body;
  console.log("At login for:", email, " ", emailPassword);

  try {
    const [results] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (results.length === 0) return res.status(401).send('Invalid email or password');

    const user = results[0];
    console.log("Email search for login found:", user);

    const validPassword = await bcrypt.compare(emailPassword, user.emailPassword);
    if (!validPassword) return res.status(401).send('Invalid email or password');

    // Generate JWT token with expiration
    const token = jwt.sign({ email: user.email }, process.env.SECRET_KEY, { expiresIn: '1h' });
    res.status(200).json({ token });

  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).send('Error logging in');
  }
};


const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({message: "Token not provided"})
  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({message : "unable to verify token"});
    req.user = user;
    next();
  });
};

// Protected route example
const protectionTest = (req, res) => {
  res.send('This is a protected route');
};

export default {
    addData,
    fetchAllData,
    deletePassword,
    register,
    login,
    protectionTest,
    authenticateToken
}