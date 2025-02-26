$(document).ready(function () {
  // Sample restaurants array
  let restaurants = [
    {
      id: 1,
      name: "A2B Restaurant",
      address: "2, GST Road, Thailavaram Village, Chennai - Trichy Hwy, Maraimalai Nagar, Guduvancheri, Tamil Nadu 603202",
      amount_donated: "30 kg",
      rating: 4
    },
    {
      id: 2,
      name: "Saravana Bhavan",
      address: "T.Nagar, Chennai, Tamil Nadu",
      amount_donated: "20 kg",
      rating: 5
    }
  ];

  // Sample previous orders array (JS object for previous orders)
  let previousOrders = [
    { food: "Idli, Dosa", amount: "2 kg", date: "2023-05-12, 10:15 AM" },
    { food: "Chapati, Poori", amount: "3 kg", date: "2023-05-13, 12:30 PM" }
  ];

  // Function to load restaurant list and update header title on selection
  function loadRestaurants() {
    $("#restaurant-list").empty();

    // Add column headers for the restaurant list
    $("#restaurant-list").append(`
      <div class="restaurant-header">
        <div>S.No</div>
        <div>Restaurant Name</div>
        <div>Address</div>
        <div>Amount Donated</div>
        <div>Rating</div>
      </div>
    `);

    // Add each restaurant container
    restaurants.forEach((restaurant, index) => {
      $("#restaurant-list").append(`
        <div class="restaurant-container" data-name="${restaurant.name}">
          <div class="restaurant-content">
            <div class="restaurant-number">${index + 1}</div>
            <div class="restaurant-name">${restaurant.name}</div>
            <div class="restaurant-address">${restaurant.address}</div>
            <div class="amount-donated">${restaurant.amount_donated}</div>
            <div class="rating" data-id="${restaurant.id}">
              ${generateStars(restaurant.rating)}
            </div>
          </div>
          <button class="order-history">Order History</button>
        </div>
      `);
    });

    // When a restaurant container is clicked, update header title dynamically
    $(".restaurant-container").click(function () {
      let restaurantName = $(this).data("name");
      $("#header-title").text(restaurantName);
    });


  }



  // Load previous orders into the Previous Orders container
  function loadPreviousOrders() {
    $("#orders-list").empty();
    previousOrders.forEach(order => {
      $("#orders-list").append(`
        <div class="order-row">
          <img src="../images/food.png" alt="Food Image">
          <div>${order.food}</div>
          <div>${order.amount}</div>
          <div>${order.date}</div>
        </div>
      `);
    });
  }

  // Populate dropdown with sample list of 50 Indian foods
  const indianFoods = [
    "Idli", "Dosa", "Chapati", "Paratha", "Poori", "Vada", "Upma", "Pongal",
    "Masala Dosa", "Onion Uttapam", "Rava Idli", "Roti", "Naan", "Kulcha",
    "Biryani", "Pulav", "Sambar Rice", "Lemon Rice", "Tamarind Rice", "Curd Rice",
    "Aloo Gobi", "Paneer Butter Masala", "Chole Bhature", "Rajma Chawal", "Dal Makhani",
    "Palak Paneer", "Paneer Tikka", "Tandoori Chicken", "Chicken Curry", "Mutton Curry",
    "Fish Fry", "Pav Bhaji", "Vada Pav", "Misal Pav", "Poha", "Sabudana Khichdi",
    "Kanda Poha", "Aloo Paratha", "Gobi Paratha", "Methi Paratha", "Pani Puri",
    "Bhel Puri", "Sev Puri", "Ragda Pattice", "Kachori", "Samosa", "Dal Tadka",
    "Veg Kolhapuri", "Malai Kofta"
  ];
  const $foodList = $("#food-list");
  indianFoods.forEach(food => {
    $foodList.append(`<li>${food}</li>`);
  });

  // Toggle the Raise Order container
  $("#raise-order-btn").click(function () {
    $("#order-container").slideToggle(600);
  });

  // Toggle dropdown for food selection
  $("#food-items-dropdown-btn").click(function (e) {
    e.stopPropagation();
    $("#dropdown-menu").slideToggle(400);
  });

  // Hide dropdown when clicking outside
  $(document).click(function () {
    $("#dropdown-menu").slideUp(400);
  });

  // Filter dropdown food list based on input
  $("#food-search").on("input", function () {
    const query = $(this).val().toLowerCase();
    $("#food-list li").each(function () {
      const foodName = $(this).text().toLowerCase();
      $(this).toggle(foodName.indexOf(query) !== -1);
    });
  });

  // When a food is selected from the dropdown, add it to selected foods area with remove button
  $("#food-list").on("click", "li", function (e) {
    e.stopPropagation();
    const foodItem = $(this).text();
    $("#dropdown-menu").slideUp(400);
    const $newFood = $(`<div class="selected-food">${foodItem}<span class="remove-food">×</span></div>`).hide();
    $("#selected-foods").append($newFood);
    $newFood.fadeIn(600);
  });

  // Remove a selected food when its remove button is clicked
  $("#selected-foods").on("click", ".remove-food", function () {
    $(this).parent().fadeOut(400, function () {
      $(this).remove();
    });
  });

  // Handle order submission from the Raise Order container
  $("#submit-order-btn").click(function () {
    const selectedFoods = [];
    $(".selected-food").each(function () {
      // Exclude the remove icon text
      selectedFoods.push($(this).contents().filter(function () {
        return this.nodeType === 3;
      }).text().trim());
    });
    const amount = $("#amount-input").val();
    if (selectedFoods.length === 0 || !amount) {
      alert("Please select at least one food item and enter the amount.");
      return;
    }
    const dateStr = new Date().toLocaleString();
    // Create a new order row and add it to previous orders
    const $orderRow = $(`
      <div class="order-row">
        <img src="../images/food.png" alt="Food Image">
        <div>${selectedFoods.join(", ")}</div>
        <div>${amount} kg</div>
        <div>${dateStr}</div>
      </div>
    `);
    $("#orders-list").append($orderRow.hide().fadeIn(600));
    // Also update our previousOrders array (for demonstration)
    previousOrders.push({
      food: selectedFoods.join(", "),
      amount: `${amount} kg`,
      date: dateStr
    });
    $("#selected-foods").empty();
    $("#amount-input").val("");
    alert("Order submitted successfully!");
  });

  // Toggle Previous Orders Container and load orders when shown
  $("#previous-orders-btn").click(function () {
    $("#previous-orders-container").slideToggle(600, function () {
      if (!$(this).is(":hidden")) {
        loadPreviousOrders();
      }
    });
  });

  // Initial load
  loadRestaurants();
});
