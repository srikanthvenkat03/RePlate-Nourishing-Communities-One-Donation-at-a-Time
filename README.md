RePlate


RePlate is a web-based platform that helps restaurants donate surplus food and manage orders. The system supports two user types—restaurant and government—allowing restaurants to raise food donation orders and government users to review and accept orders. The project is built with Node.js, Express, PostgreSQL, and uses jQuery on the front end.
Features
•	User Signup & Login: Secure user registration and login with password hashing using bcrypt.
•	Restaurant Dashboard: Restaurants can raise food donation orders, view previously accepted orders, and manage food items.
•	Food Dashboard (Government): Government users can view pending food donation orders and either accept or reject them.
•	Order History: Both restaurant and government users can view order history. For restaurants, accepted orders are filtered.
•	Dynamic Aggregation: The amount_donated in the restaurants table is updated dynamically whenever an order’s status changes.
Project Structure
•	server.js: Main server file that configures the Express application, PostgreSQL connection, API endpoints, and static file serving.
•	html/: Contains HTML files for various pages (index.html, restaurant-dashboard.html, order-history-restaurant.html, food-info.html, etc.).
•	scripts/: Contains JavaScript files for front-end functionality (restaurant-dashboard.js, order-history-restaurant.js, food-info.js, login-animation.js, etc.).
•	styles/: Contains CSS files for styling the pages.
•	images/: Contains static images (logo, icons, etc.).
Setup Instructions
Follow these steps to set up and run the project locally:
1. Clone the Repository
Clone the project from GitHub:
bash
Copy
git clone https://github.com/your-username/RePlate.git
cd RePlate
2. Install Dependencies
Ensure you have Node.js and npm installed. Then install the required dependencies:
bash
Copy
npm install
3. Configure Environment Variables
Create a .env file in the project root with the following variables (adjust values as needed):
ini
Copy
PORT=3000
DB_HOST=your_database_host
DB_PORT=your_database_port
DB_USER=your_database_user
DB_PASS=your_database_password
DB_NAME=your_database_name
4. Set Up the Database
Ensure you have PostgreSQL installed and running. Create the required database and tables. For example, you might need the following tables:
Users Table
sql
Copy
CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  user_type VARCHAR(50),
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  restaurant_name VARCHAR(255),
  phone VARCHAR(50)
);
Restaurants Table
sql
Copy
CREATE TABLE restaurants (
  restaurant_username VARCHAR(255) PRIMARY KEY,
  restaurant_name VARCHAR(255) NOT NULL,
  address TEXT,
  rating NUMERIC,
  distance NUMERIC,
  amount_donated NUMERIC DEFAULT 0
);
Orders Table
sql
Copy
CREATE TABLE orders (
  order_id SERIAL PRIMARY KEY,
  restaurant_username VARCHAR(255) REFERENCES restaurants(restaurant_username),
  donated_foods TEXT,
  amount NUMERIC,
  order_date TIMESTAMP,
  order_status VARCHAR(50)
);
Foods Table
sql
Copy
CREATE TABLE foods (
  food_id SERIAL PRIMARY KEY,
  food_name VARCHAR(255) NOT NULL,
  description TEXT
);
5. Running the Server
Start your server with:
bash
Copy
npm start
Your server should now be running on http://localhost:3000.
6. Access the Application
•	Index / Login Page: http://localhost:3000/html/index.html
•	Restaurant Dashboard: Navigate to a URL similar to:
http://localhost:3000/html/restaurant-dashboard.html?username=dakshin_delight&name=Dakshin%20Delight
•	Order History (Restaurant): Navigate to:
http://localhost:3000/html/order-history-restaurant.html?restaurant=dakshin_delight&name=Dakshin%20Delight
•	Food Dashboard (Government): Navigate to:
http://localhost:3000/html/food-info.html?username=gov_user&name=Government
API Endpoints
Below are some of the main endpoints exposed by the server:
•	POST /api/signup: Create a new user.
•	POST /api/login: Authenticate a user.
•	GET /api/orders: Retrieve all orders (joined with restaurant info).
•	POST /api/orders: Create a new order.
•	PUT /api/orders/:orderId: Update an order's status and recompute the restaurant’s donation total.
•	GET /api/restaurants: Retrieve restaurant data along with the dynamically computed or stored donation total.
•	GET /api/foods: Retrieve a list of foods.
Additional Notes
•	The front-end JavaScript files use query parameters (username and name or restaurant and name) to maintain context between pages. Ensure that these parameters are properly included in your URL during navigation.
•	The amount_donated column in the restaurants table is updated via the PUT endpoint whenever an order’s status changes to or from "accepted". This ensures the stored total remains accurate.
•	If you make changes to server.js, restart your Node server.
•	For any issues, please refer to the console logs or check your PostgreSQL logs for errors.
Contributing
Feel free to open issues or submit pull requests if you have any improvements or bug fixes.

