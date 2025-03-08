// Extract query parameters for username and name
function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    username: params.get('username'),
    name: params.get('name')
  };
}

$(document).ready(async function () {
  const loggedInUser = getQueryParams();
  
  // If a name is provided in the URL, update the header to include the user's name
  if (loggedInUser.name) {
    $("#header-title").text(`Food Dashboard - ${loggedInUser.name}`);
  }
  
  // Continue with your existing logic to load orders, etc.
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

      // Create a row for each order
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

  // Accept/Reject Logic (unchanged)
  $("#food-list").on('click', '.accept-btn', async function() {
    const $foodItem = $(this).closest('.food-item');
    const orderId = $foodItem.data('order-id');
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newStatus: 'accepted' })
      });
      const data = await response.json();
      if (response.ok) {
        alert(`Order #${orderId} accepted!`);
        $foodItem.addClass('removing');
        $foodItem.on('transitionend', function() {
          $(this).remove();
        });
      } else {
        alert(data.error || 'Update failed');
      }
    } catch (err) {
      console.error('Error accepting order:', err);
    }
  });

  $("#food-list").on('click', '.reject-btn', async function() {
    const $foodItem = $(this).closest('.food-item');
    const orderId = $foodItem.data('order-id');
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newStatus: 'rejected' })
      });
      const data = await response.json();
      if (response.ok) {
        alert(`Order #${orderId} rejected!`);
        $foodItem.addClass('removing');
        $foodItem.on('transitionend', function() {
          $(this).remove();
        });
      } else {
        alert(data.error || 'Update failed');
      }
    } catch (err) {
      console.error('Error rejecting order:', err);
    }
  });

  // On page load, call loadOrders
  loadOrders();

  // UI logic for dropdown toggles remains unchanged
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
  
  // Hamburger dropdown navigation event handlers
  $(".hamburger-dropdown .dropdown-option").on("click", function () {
    const optionText = $(this).text().trim();
    if (optionText === "Restaurant Dashboard") {
      window.location.href = "/html/restaurant-info.html";
    } else if (optionText === "Order History") {
      window.location.href = "/html/order-history.html";
    }
  });
  
  $(".hamburger-dropdown .dropdown-option-logout").on("click", function () {
    window.location.href = "/html/index.html";
  });
});
