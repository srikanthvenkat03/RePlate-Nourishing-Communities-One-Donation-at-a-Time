**🍽️ RePlate – Rescue Surplus, Reconnect Communities
RePlate is a web-based platform that helps restaurants donate surplus food and empowers governments to manage and track food donations. Built with Node.js, Express, PostgreSQL, and jQuery on the front end.**

🔑 **Features**
🔐 User Signup & Login
Secure login with password hashing using bcrypt.

🏪 **Restaurant Dashboard**
Raise food donation orders, view accepted orders, and manage food items.

🏛️ **Government Dashboard**
View pending orders and accept/reject them.

*📜 **Order History**

**Restaurants:** See accepted donation history.

**Government:** Track all donations.

🔄 **Dynamic Aggregation**
The amount_donated column in the restaurants table updates automatically when an order status changes!

🗂️ **Project Structure**
bash
Copy
Edit
RePlate/
├── server.js                  # Main server file
├── html/                      # Pages (index, dashboard, history, etc.)
├── scripts/                   # Frontend JS (dashboard logic, animations)
├── styles/                    # CSS styling
└── images/                    # Logos, icons, and visuals
⚙️ Setup Instructions
1️⃣ **Clone the Repository**
bash
Copy
Edit
git clone https://github.com/your-username/RePlate.git
cd RePlate
2️⃣ **Install Dependencies**
Make sure Node.js & npm are installed:

bash
Copy
Edit
npm install
3️⃣ **Configure Environment Variables**
Create a .env file:

ini
Copy
Edit
PORT=3000
DB_HOST=your_database_host
DB_PORT=your_database_port
DB_USER=your_database_user
DB_PASS=your_database_password
DB_NAME=your_database_name
4️⃣ **Set Up PostgreSQL Database**
Create these tables in your database:

👤 **Users Table**
sql
Copy
Edit
CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  user_type VARCHAR(50),
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  restaurant_name VARCHAR(255),
  phone VARCHAR(50)
);
🏢 **Restaurants Table**
sql
Copy
Edit
CREATE TABLE restaurants (
  restaurant_username VARCHAR(255) PRIMARY KEY,
  restaurant_name VARCHAR(255) NOT NULL,
  address TEXT,
  rating NUMERIC,
  distance NUMERIC,
  amount_donated NUMERIC DEFAULT 0
);
📦 **Orders Table**
sql
Copy
Edit
CREATE TABLE orders (
  order_id SERIAL PRIMARY KEY,
  restaurant_username VARCHAR(255) REFERENCES restaurants(restaurant_username),
  donated_foods TEXT,
  amount NUMERIC,
  order_date TIMESTAMP,
  order_status VARCHAR(50)
);
🍲 **Foods Table**
sql
Copy
Edit
CREATE TABLE foods (
  food_id SERIAL PRIMARY KEY,
  food_name VARCHAR(255) NOT NULL,
  description TEXT
);
5️⃣ **Run the Server**
bash
Copy
Edit
npm start
🌐 Access the App
🔑 Login Page
http://localhost:3000/html/index.html

🍛 **Restaurant Dashboard**
Example:
http://localhost:3000/html/restaurant-dashboard.html?username=dakshin_delight&name=Dakshin%20Delight

📜 **Order History (Restaurant)**
http://localhost:3000/html/order-history-restaurant.html?restaurant=dakshin_delight&name=Dakshin%20Delight

🏛️ **Government Dashboard**
http://localhost:3000/html/food-info.html?username=gov_user&name=Government

🔌 **API Endpoints**
POST /api/signup → Register a new user

POST /api/login → Authenticate user

GET /api/orders → Get all orders with restaurant info

POST /api/orders → Create a new food donation order

PUT /api/orders/:orderId → Update order status + donation total

GET /api/restaurants → Get all restaurant data

GET /api/foods → List all food items

📝 **Notes**
🔗 Frontend uses query parameters (username, restaurant, name) in URLs for user context.

💰 amount_donated in restaurants updates whenever an order status is updated to/from accepted.

🔁 Restart server after any change in server.js.

🐞 Check browser console or PostgreSQL logs for debugging.

🤝 Contributing
Got improvements? Bug fixes?
Fork, star, or open a pull request!

📌 **About**
RePlate bridges the gap between restaurants with surplus food and governments aiming to fight hunger and food waste. It promotes:

🧾 Transparency

🚯 Waste Reduction

❤️ Community Welfare

All with an intuitive, user-friendly experience.
