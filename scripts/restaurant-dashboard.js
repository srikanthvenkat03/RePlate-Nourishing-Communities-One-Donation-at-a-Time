$(document).ready(function () {
  // Use the actual restaurant username from the header data attribute
  const restaurantUsername = $("#header-title").data("username");

  /************************************
   * 1. Toggle the "Raise Order" form
   ************************************/
  $("#raise-order-btn").click(function() {
    $("#order-container").removeClass("hidden").slideToggle(300);
  });

  /************************************
   * 2. Toggle the hamburger dropdown
   ************************************/
  $(".hamburger").click(function(e) {
    e.stopPropagation();
    $(".hamburger-dropdown").removeClass("hidden").slideToggle(300);
  });
  $(document).click(function() {
    $(".hamburger-dropdown").slideUp(300);
  });
  $(".hamburger-dropdown").click(function(e) {
    e.stopPropagation();
  });

  /************************************
   * 3. Toggle the "Select Food" dropdown
   ************************************/
  $("#food-items-dropdown-btn").click(function(e) {
    e.stopPropagation();
    $("#dropdown-menu").slideToggle(300);
  });
  $(document).click(function() {
    $("#dropdown-menu").slideUp(300);
  });
  $("#dropdown-menu").click(function(e) {
    e.stopPropagation();
  });

  /************************************
   * 4. Load food items from /api/foods
   ************************************/
  async function loadFoodItems() {
    try {
      const response = await fetch('/api/foods');
      const foods = await response.json();
      const $foodList = $("#food-list");
      $foodList.empty();
      foods.forEach(food => {
        $foodList.append(`<li class="dropdown-food-item">${food.food_name}</li>`);
      });
    } catch (err) {
      console.error('Error loading food items:', err);
    }
  }
  loadFoodItems();

  /************************************
   * 5. Add selected food from dropdown
   ************************************/
  $("#food-list").on("click", ".dropdown-food-item", function () {
    const selectedText = $(this).text().trim();
    if ($("#selected-foods").find(`div:contains("${selectedText}")`).length === 0) {
      $("#selected-foods").append(
        `<div class="selected-food">${selectedText} <span class="remove-food">x</span></div>`
      );
    }
  });
  $("#selected-foods").on("click", ".remove-food", function () {
    $(this).parent().remove();
  });

  /************************************
   * 6. Load ONLY accepted orders
   ************************************/
  async function loadPreviousOrders() {
    try {
      const response = await fetch('/api/orders');
      const orders = await response.json();
      // Filter for accepted orders for this restaurant
      const filteredOrders = orders.filter(order =>
        order.restaurant_username === restaurantUsername &&
        order.order_status === 'accepted'
      );
      $("#orders-list").empty();
      if (filteredOrders.length === 0) {
        $("#orders-list").append(`<div>No accepted orders found.</div>`);
      } else {
        filteredOrders.forEach(order => {
          $("#orders-list").append(`
            <div class="order-row" data-order-id="${order.order_id}">
              <img src="../images/food.png" alt="Food Image">
              <div>${order.donated_foods}</div>
              <div>${order.amount}</div>
              <div>${order.order_date}</div>
            </div>
          `);
        });
      }
    } catch (err) {
      console.error('Error loading previous orders:', err);
    }
  }

  /************************************
   * 7. Toggle "Previous Orders" container
   ************************************/
  $("#previous-orders-btn").click(function () {
    $("#previous-orders-container").slideToggle(600, function () {
      if (!$(this).is(":hidden")) {
        loadPreviousOrders();
      }
    });
  });

  /************************************
   * 8. Submit a new order
   ************************************/
  $("#submit-order-btn").click(async function () {
    const selectedFoods = [];
    $(".selected-food").each(function () {
      const foodText = $(this).text().replace(" x", "").trim();
      selectedFoods.push(foodText);
    });
    const amount = $("#amount-input").val().trim();
    if (selectedFoods.length === 0 || !amount) {
      alert("Please select at least one food item and enter the amount.");
      return;
    }
    const order_date = new Date().toISOString();
    // New orders are initially pending
    const order_status = "pending";
    // Use the actual restaurant username (from data attribute)
    const restaurant_username = restaurantUsername;

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
        $("#selected-foods").empty();
        $("#amount-input").val("");
      } else {
        alert(data.error || 'Order submission failed');
      }
    } catch (err) {
      console.error('Error creating order:', err);
    }
  });
});
