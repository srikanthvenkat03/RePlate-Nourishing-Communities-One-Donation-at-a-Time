require('dotenv').config();
const express = require('express');
const path = require('path');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const app = express();
const port = process.env.PORT || 3000;

// PostgreSQL setup
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Files
app.use('/html', express.static(path.join(__dirname, 'html')));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));
app.use('/styles', express.static(path.join(__dirname, 'styles')));
app.use('/images', express.static(path.join(__dirname, 'images')));

/******************************************
 * API Endpoints
 ******************************************/

// Signup endpoint
app.post('/api/signup', async (req, res) => {
  try {
    const { username, email, password, restaurant_name, phone, user_type } = req.body;

    const userCheck = await pool.query(
      'SELECT * FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );

    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (user_type, username, email, password, restaurant_name, phone)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING user_id`,
      [user_type, username, email, hashedPassword, restaurant_name, phone]
    );

    res.json({ message: 'Signup successful', user_id: result.rows[0].user_id });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login endpoint (with email OR username)
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 OR username = $1',
      [email]
    );

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

// Retrieve orders along with Restaurant Names (JOIN Query)
app.get('/api/orders', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        o.order_id, 
        o.restaurant_username, 
        o.donated_foods, 
        o.amount,
        o.order_status, 
        o.order_date,
        r.restaurant_name
      FROM orders o
      JOIN restaurants r ON o.restaurant_username = r.restaurant_username
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('GET /api/orders error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get Restaurants
app.get('/api/restaurants', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM restaurants');
    res.json(result.rows);
  } catch (err) {
    console.error('Error in GET /api/restaurants:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get Foods
app.get('/api/foods', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM foods');
    res.json(result.rows);
  } catch (err) {
    console.error('GET /api/foods error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user by username
app.get('/api/users/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const userResult = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(userResult.rows[0]);
  } catch (err) {
    console.error('GET /api/users/:username error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/******************************************
 * New Rating Endpoint
 ******************************************/
app.put('/api/restaurants/:restaurantUsername/rating', async (req, res) => {
  try {
    const { restaurantUsername } = req.params;
    const { rating } = req.body;

    // Validate rating in [1..5]
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Invalid rating value. Must be 1..5.' });
    }

    // Update the rating in the restaurants table
    const updateResult = await pool.query(
      'UPDATE restaurants SET rating = $1 WHERE restaurant_username = $2 RETURNING *',
      [rating, restaurantUsername]
    );

    if (updateResult.rowCount === 0) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    res.json({
      message: 'Rating updated',
      restaurant: updateResult.rows[0]
    });
  } catch (err) {
    console.error('Error updating rating:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Default route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'index.html'));
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
