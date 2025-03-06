$(document).ready(async function () {
    try {
      const response = await fetch('/api/restaurants');
      const restaurants = await response.json();
      $("#restaurant-list").empty();
      $("#restaurant-list").append(`
        <div class="restaurant-header">
            <div>S.No</div>
            <div>Restaurant Name</div>
            <div>Address</div>
            <div>Amount Donated</div>
            <div>Rating</div>
        </div>
      `);
      restaurants.forEach((restaurant, index) => {
        $("#restaurant-list").append(`
          <div class="restaurant-container">
            <div class="restaurant-content">
              <div class="restaurant-number">${index + 1}</div>
              <div class="restaurant-name">${restaurant.name}</div>
              <div class="restaurant-address">${restaurant.address}</div>
              <div class="amount-donated">${restaurant.amount_donated || ''}</div>
              <div class="rating" data-id="${restaurant.id}">
                ${generateStars(restaurant.rating)}
              </div>
            </div>
            <button class="order-history">Order History</button>
          </div>
        `);
      });
    } catch (err) {
      console.error('Error loading restaurants:', err);
    }
  });
  
  function generateStars(rating) {
    let stars = "";
    for (let i = 1; i <= 5; i++) {
      stars += `<span data-value="${i}" class="${i <= rating ? "filled-star" : "empty-star"}">★</span>`;
    }
    return stars;
  }
  