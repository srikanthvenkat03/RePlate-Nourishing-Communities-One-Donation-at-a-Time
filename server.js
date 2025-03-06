require('dotenv').config();
const express = require('express');
const path = require('path');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const app = express();
const port = process.env.PORT || 3000;

// PostgreSQL pool setup
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from specific folders
app.use('/html', express.static(path.join(__dirname, 'html')));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));
app.use('/styles', express.static(path.join(__dirname, 'styles')));
app.use('/images', express.static(path.join(__dirname, 'images')));

// Default route: serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'index.html'));
});

/******************************************
 * API Endpoints
 ******************************************/

// POST /api/signup
// This endpoint is used for restaurant signup.
// Payload: { username, email, password, restaurant_name, phone, user_type }
// For restaurants, user_type is always "restaurant".
app.post('/api/signup', async (req, res) => {
  try {
    const { username, email, password, restaurant_name, phone, user_type } = req.body;

    // Check if a user with the same email exists
    const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: 'User with this email already exists.' });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert the new user into the database
    const insertQuery = `
      INSERT INTO users (user_type, username, email, password, restaurant_name, phone)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING user_id
    `;
    const result = await pool.query(insertQuery, [user_type, username, email, hashedPassword, restaurant_name, phone]);
    res.json({ message: 'Signup successful', user_id: result.rows[0].user_id });
  } catch (err) {
    console.error('Error in /api/signup:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/login
// This endpoint handles login for both government and restaurant users.
// For government login, the payload contains only { email, password }.
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }
    const user = result.rows[0];
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }
    res.json({
      message: 'Login successful',
      user: {
        user_id: user.user_id,
        user_type: user.user_type,
        username: user.username,
        email: user.email,
        restaurant_name: user.restaurant_name,
        phone: user.phone
      }
    });
  } catch (err) {
    console.error('Error in /api/login:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/foods
// Returns a list of food items from the "foods" table.
app.get('/api/foods', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM foods');
    res.json(result.rows);
  } catch (err) {
    console.error('Error in GET /api/foods:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/restaurants
// Returns a list of restaurants from the "restaurants" table.
app.get('/api/restaurants', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM restaurants');
    res.json(result.rows);
  } catch (err) {
    console.error('Error in GET /api/restaurants:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/orders
// Creates a new order.
// Expected payload: { restaurant_username, donated_foods, amount, order_date, order_status }
app.post('/api/orders', async (req, res) => {
  try {
    const { restaurant_username, donated_foods, amount, order_date, order_status } = req.body;
    const insertOrderQuery = `
      INSERT INTO orders (restaurant_username, donated_foods, amount, order_date, order_status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING order_id
    `;
    const result = await pool.query(insertOrderQuery, [restaurant_username, donated_foods, amount, order_date, order_status]);
    res.json({ message: 'Order created successfully', order_id: result.rows[0].order_id });
  } catch (err) {
    console.error('Error in /api/orders:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/orders
// Retrieves the list of orders from the "orders" table.
app.get('/api/orders', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders');
    res.json(result.rows);
  } catch (err) {
    console.error('Error in GET /api/orders:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
