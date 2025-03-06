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

// Serve Static Files
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
      return res.status(400).json({ error: 'User with this email or username already exists.' });
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

// Improved Login endpoint (accept username or email)
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 OR username = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email/username or password' });
    }

    const user = result.rows[0];
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email/username or password' });
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
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get Restaurants
app.get('/api/restaurants', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM restaurants');
    res.json(result.rows);
  } catch (err) {
    console.error('GET /api/restaurants error:', err);
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

// Create a new order
app.post('/api/orders', async (req, res) => {
  try {
    const { restaurant_username, donated_foods, amount, order_date, order_status } = req.body;

    const result = await pool.query(
      `INSERT INTO orders (restaurant_username, donated_foods, amount, order_date, order_status)
       VALUES ($1, $2, $3, $4, $5) RETURNING order_id`,
      [restaurant_username, donated_foods, amount, order_date, order_status]
    );

    res.json({ message: 'Order created successfully', order_id: result.rows[0].order_id });
  } catch (err) {
    console.error('POST /api/orders error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Retrieve all orders
app.get('/api/orders', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders');
    res.json(result.rows);
  } catch (err) {
    console.error('GET /api/orders error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Retrieve orders with distance (join)
app.get('/api/orders-with-distance', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT o.order_id, o.restaurant_username, o.donated_foods, o.amount,
             o.order_status, r.restaurant_name, r.distance
      FROM orders AS o
      JOIN restaurants AS r ON o.restaurant_username = r.restaurant_username
    `);

    res.json(result.rows);
  } catch (err) {
    console.error('GET /api/orders-with-distance error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update order status
app.put('/api/orders/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { newStatus } = req.body;

    const result = await pool.query(
      `UPDATE orders SET order_status = $1 WHERE order_id = $2 RETURNING *`,
      [newStatus, orderId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ message: 'Order updated successfully', order: result.rows[0] });
  } catch (err) {
    console.error('PUT /api/orders/:orderId error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/******************************************
 * Default Route (Serve index.html)
 ******************************************/
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'index.html'));
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
  