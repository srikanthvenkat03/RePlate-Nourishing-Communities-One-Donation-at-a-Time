$(document).ready(async function () {
  // Function to load previous orders from /api/orders
  async function loadPreviousOrders() {
    try {
      const response = await fetch('/api/orders');
      const orders = await response.json();
      // Example: Filter orders for "A2B Restaurant"
      const currentRestaurant = "A2B Restaurant";
      const filteredOrders = orders.filter(order => order.restaurant_username === currentRestaurant);
      $("#orders-list").empty();
      filteredOrders.forEach(order => {
        $("#orders-list").append(`
          <div class="order-row">
            <img src="../images/food.png" alt="Food Image">
            <div>${order.donated_foods}</div>
            <div>${order.amount}</div>
            <div>${order.order_date}</div>
          </div>
        `);
      });
    } catch (err) {
      console.error('Error loading orders:', err);
    }
  }

  // Function to load foods from /api/foods for the dropdown
  async function loadFoods() {
    try {
      const response = await fetch('/api/foods');
      const foods = await response.json();
      const $foodList = $("#food-list");
      $foodList.empty();
      foods.forEach(food => {
        // Assuming food.food_name is provided from your DB
        $foodList.append(`<li>${food.food_name}</li>`);
      });
    } catch (err) {
      console.error('Error loading foods:', err);
    }
  }

  // Populate the food dropdown on page load
  loadFoods();

  // Event handler for submitting an order
  $("#submit-order-btn").click(async function () {
    const selectedFoods = [];
    $(".selected-food").each(function () {
      selectedFoods.push($(this).contents().filter(function () {
        return this.nodeType === 3;
      }).text().trim());
    });
    const amount = $("#amount-input").val();
    if (selectedFoods.length === 0 || !amount) {
      alert("Please select at least one food item and enter the amount.");
      return;
    }
    const order_date = new Date().toISOString();
    const order_status = "pending";
    // Hardcoded restaurant for example – in practice, retrieve from user session
    const restaurant_username = "A2B Restaurant";

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurant_username,
          donated_foods: selectedFoods.join(", "),
          amount,
          order_date,
          order_status
        })
      });
      const data = await response.json();
      if (response.ok) {
        alert('Order submitted successfully! Order ID: ' + data.order_id);
        loadPreviousOrders();
        $("#selected-foods").empty();
        $("#amount-input").val("");
      } else {
        alert(data.error || 'Order submission failed');
      }
    } catch (err) {
      console.error('Error creating order:', err);
    }
  });

  // Toggle previous orders display
  $("#previous-orders-btn").click(function () {
    $("#previous-orders-container").slideToggle(600, function () {
      if (!$(this).is(":hidden")) {
        loadPreviousOrders();
      }
    });
  });

  // (Retain any additional UI interactions such as dropdown toggling as in your original code)
});
