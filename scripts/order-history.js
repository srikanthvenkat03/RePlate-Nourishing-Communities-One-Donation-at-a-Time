function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    restaurant: params.get('restaurant')
  };
}

$(document).ready(async function () {
  const { restaurant } = getQueryParams();

  async function loadOrderHistory() {
    try {
      const ordersResponse = await fetch('/api/orders');
      const orders = await ordersResponse.json();

      $("#order-history-list").empty();

      // Build a header row
      $("#order-history-list").append(`
        <div class="order-header">
          <div>Order ID</div>
          <div>Date</div>
          <div>Food Name</div>
          <div>Amount Donated</div>
          <div>Restaurant Name</div>
          <div>Status</div>
        </div>
      `);

      // If there's a "restaurant" param, filter the orders
      let filteredOrders = orders;
      if (restaurant) {
        filteredOrders = orders.filter(o => o.restaurant_username === restaurant);
      }

      // Display the filtered orders
      filteredOrders.forEach(order => {
        $("#order-history-list").append(`
          <div class="order-container">
            <div class="order-content">
              <div class="order-id">${order.order_id}</div>
              <div class="order-date">${new Date(order.order_date).toLocaleDateString()}</div>
              <div class="food-name">${order.donated_foods}</div>
              <div class="amount-donated">${order.amount}</div>
              <div class="restaurant-name">${order.restaurant_name}</div>
              <div class="order-status">${order.order_status}</div>
            </div>
          </div>
        `);
      });
    } catch (err) {
      console.error('Error loading orders:', err);
    }
  }

  // Load orders on startup
  loadOrderHistory();

  // Search functionality
  $('#search').on('input', function() {
    const searchTerm = $(this).val().toLowerCase();
    $('.order-container').each(function() {
      const orderId = $(this).find('.order-id').text().toLowerCase();
      $(this).toggle(orderId.includes(searchTerm));
    });
  });

  // Hamburger dropdown toggle
  $('.hamburger').click(function(e) {
    e.stopPropagation();
    $('.hamburger-dropdown').slideToggle(300);
  });

  $(document).click(function() {
    $('.hamburger-dropdown').slideUp(300);
  });

  $('.hamburger-dropdown').click(function(e) {
    e.stopPropagation();
  });

  // Hamburger dropdown navigation handlers
  $('.hamburger-dropdown .dropdown-option').on('click', function() {
    const optionText = $(this).text().trim();
    if (optionText === "Food Dashboard") {
      window.location.href = "/html/food-info.html";
    } else if (optionText === "Restaurant Dashboard") {
      window.location.href = "/html/restaurant-info.html";
    }
  });

  $('.hamburger-dropdown .dropdown-option-logout').on('click', function() {
    window.location.href = "/html/index.html";
  });
});
