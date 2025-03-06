$(document).ready(async function () {
  // 1) Load the orders from /api/orders-with-distance
  async function loadOrders() {
    try {
      const response = await fetch('/api/orders-with-distance');
      const orders = await response.json();

      // Grab the header row (clone it) so we can preserve it after emptying
      const headerRow = $('.food-header').clone();

      // Clear the #food-list container
      $("#food-list").empty();

      // Re-append the header row
      $("#food-list").append(headerRow);

      // 2) For each order, create a row
      orders.forEach(order => {
        $("#food-list").append(`
          <div class="food-item" data-order-id="${order.order_id}">
            <div class="food-content">
              <div class="restaurant-name">${order.restaurant_name}</div>
              <div class="food-name">${order.donated_foods}</div>
              <div class="weight">${order.amount}</div>
              <div class="distance">${order.distance}</div>
              <div class="side-tick">
                <button class="tick-btn accept-btn">
                  <img src="../images/tick-icon-vector-14450588-removebg-preview.png" alt="Accept">
                </button>
              </div>
              <div class="close-btn">
                <button class="close-btn reject-btn">
                  <img src="../images/14025477.png" alt="Reject">
                </button>
              </div>
            </div>
          </div>
        `);
      });
    } catch (err) {
      console.error('Error loading orders:', err);
    }
  }

  // 3) Accept/Reject Logic (Event Delegation)
  // Because rows are created dynamically, we use .on('click', ...)
  $("#food-list").on('click', '.accept-btn', async function() {
    const orderId = $(this).closest('.food-item').data('order-id');
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newStatus: 'accepted' })
      });
      const data = await response.json();
      if (response.ok) {
        alert(`Order #${orderId} accepted!`);
        loadOrders(); // Reload the list
      } else {
        alert(data.error || 'Update failed');
      }
    } catch (err) {
      console.error('Error accepting order:', err);
    }
  });

  $("#food-list").on('click', '.reject-btn', async function() {
    const orderId = $(this).closest('.food-item').data('order-id');
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newStatus: 'rejected' })
      });
      const data = await response.json();
      if (response.ok) {
        alert(`Order #${orderId} rejected!`);
        loadOrders(); // Reload
      } else {
        alert(data.error || 'Update failed');
      }
    } catch (err) {
      console.error('Error rejecting order:', err);
    }
  });

  // 4) On page load, call loadOrders
  loadOrders();

  // Additional UI logic (dropdown toggles, etc.)
  $('.sort-by-btn').click(function(e) {
    e.stopPropagation();
    $('.sort-dropdown').slideToggle(300);
  });

  $('.hamburger').click(function(e) {
    e.stopPropagation();
    $('.hamburger-dropdown').slideToggle(300);
  });

  $('.sort-dropdown, .hamburger-dropdown').click(function(e) {
    e.stopPropagation();
  });

  $(document).click(function() {
    $('.sort-dropdown').slideUp(300);
    $('.hamburger-dropdown').slideUp(300);
  });
});
