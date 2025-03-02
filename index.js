const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());

// 1) Serve your HTML folder as static
app.use(express.static(path.join(__dirname, 'html')));

// 2) (Optional) If you want to serve images, scripts, and styles on separate routes
//    so you can reference them like /images/something.png, etc., do this:
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));
app.use('/styles', express.static(path.join(__dirname, 'styles')));

// 3) Example route for your backend API (if you want to connect to PostgreSQL later)
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// 4) If you have an index.html in the 'html' folder, you can serve it at the root:
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'index.html'));
});

// 5) Start the server
const PORT = 3000; // or any port you like
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

