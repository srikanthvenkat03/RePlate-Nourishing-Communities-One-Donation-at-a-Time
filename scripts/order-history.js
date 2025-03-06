$(document).ready(async function () {
    async function loadOrderHistory() {
      try {
        const response = await fetch('/api/orders');
        const orders = await response.json();
        $("#order-history-list").empty();
        $("#order-history-list").append(`
          <div class="order-header">
            <div>Order ID</div>
            <div>Date</div>
            <div>Food Name</div>
            <div>Amount Donated</div>
          </div>
        `);
        orders.forEach(order => {
          $("#order-history-list").append(`
            <div class="order-container">
              <div class="order-content">
                <div class="order-id">${order.order_id}</div>
                <div class="order-date">${order.order_date}</div>
                <div class="food-name">${order.donated_foods}</div>
                <div class="amount-donated">${order.amount}</div>
              </div>
            </div>
          `);
        });
      } catch (err) {
        console.error('Error loading order history:', err);
      }
    }
    loadOrderHistory();
  });
  