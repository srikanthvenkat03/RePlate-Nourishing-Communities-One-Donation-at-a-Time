require('dotenv').config();
const express = require('express');
const path = require('path');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/html', express.static(path.join(__dirname, 'html')));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));
app.use('/styles', express.static(path.join(__dirname, 'styles')));
app.use('/images', express.static(path.join(__dirname, 'images')));

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
        r.restaurant_name,
        r.distance
      FROM orders o
      JOIN restaurants r 
        ON o.restaurant_username = r.restaurant_username
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('GET /api/orders error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const { restaurant_username, donated_foods, amount, order_date, order_status } = req.body;
    const result = await pool.query(
      `INSERT INTO orders (restaurant_username, donated_foods, amount, order_date, order_status)
       VALUES ($1, $2, $3, $4, $5) RETURNING order_id`,
      [restaurant_username, donated_foods, amount, order_date, order_status]
    );
    res.json({ order_id: result.rows[0].order_id });
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/orders/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { newStatus } = req.body;
    const orderResult = await pool.query('SELECT * FROM orders WHERE order_id = $1', [orderId]);
    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    const order = orderResult.rows[0];
    await pool.query(
      'UPDATE orders SET order_status = $1 WHERE order_id = $2',
      [newStatus, orderId]
    );
    await pool.query(`
      UPDATE restaurants
         SET amount_donated = (
           SELECT COALESCE(SUM(amount), 0)
             FROM orders
            WHERE restaurant_username = $1
              AND order_status = 'accepted'
         )
       WHERE restaurant_username = $1
    `, [order.restaurant_username]);
    res.json({ message: `Order ${orderId} updated to ${newStatus}` });
  } catch (err) {
    console.error('Error updating order:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/restaurants', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        restaurant_username,
        restaurant_name,
        address,
        rating,
        distance,
        amount_donated
      FROM restaurants
      ORDER BY restaurant_username;
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error in GET /api/restaurants:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/restaurants/:restaurant_username/rating', async (req, res) => {
  try {
    const { restaurant_username } = req.params;
    const { rating } = req.body;
    
    // Assuming that your restaurants table has a column for rating,
    // you might update the rating directly:
    await pool.query(
      'UPDATE restaurants SET rating = $1 WHERE restaurant_username = $2',
      [rating, restaurant_username]
    );
    
    res.json({ message: 'Rating updated successfully' });
  } catch (err) {
    console.error('Error updating rating:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/foods', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM foods');
    res.json(result.rows);
  } catch (err) {
    console.error('GET /api/foods error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
