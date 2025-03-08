// If you need query params for a logged-in user, use this
function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    username: params.get('username'),
    name: params.get('name')
  };
}

$(document).ready(async function () {
  /************************************
   * 1. Hamburger Dropdown
   ************************************/
  $(".hamburger").click(function(e) {
    e.stopPropagation();
    $(".hamburger-dropdown").slideToggle(300).removeClass("hidden");
  });

  $(document).click(function() {
    $(".hamburger-dropdown").slideUp(300);
  });

  $(".hamburger-dropdown").click(function(e) {
    e.stopPropagation();
  });

  // Navigation handlers
  $(".hamburger-dropdown .dropdown-option").on("click", function () {
    const optionText = $(this).text().trim();
    if (optionText === "Food Dashboard") {
      window.location.href = "/html/food-info.html";
    } else if (optionText === "Order History") {
      window.location.href = "/html/order-history.html";
    }
  });

  $(".hamburger-dropdown .dropdown-option-logout").on("click", function () {
    window.location.href = "/html/index.html";
  });

  /************************************
   * 2. Load and display restaurants
   ************************************/
  async function loadRestaurantInfo() {
    try {
      const response = await fetch('/api/restaurants');
      const restaurants = await response.json();

      // Clear any existing items
      $("#restaurant-info-list").empty();

      // Add a column header row
      $("#restaurant-info-list").append(`
        <div class="column-header-row">
          <div>S.No</div>
          <div>Restaurant Name</div>
          <div>Address</div>
          <div>Amount Donated</div>
          <div>Distance</div>
          <div>Rating</div>
        </div>
      `);

      // For each restaurant, create a card
      restaurants.forEach((restaurant, index) => {
        // Build star rating UI (5 stars)
        let ratingHtml = `<div class="rating" data-restaurant-username="${restaurant.restaurant_username}">`;
        const currentRating = restaurant.rating || 0;
        for (let i = 1; i <= 5; i++) {
          ratingHtml += `<span data-star="${i}" class="${i <= currentRating ? 'filled-star' : ''}">&#9733;</span>`;
        }
        ratingHtml += `</div>`;

        const distanceVal = restaurant.distance || 'N/A';

        $("#restaurant-info-list").append(`
          <div class="restaurant-item">
            <div class="restaurant-row">
              <div>${index + 1}</div>
              <div>${restaurant.restaurant_name}</div>
              <div>${restaurant.address}</div>
              <div>${restaurant.amount_donated || 'N/A'}</div>
              <div>${distanceVal}</div>
              <div>${ratingHtml}</div>
            </div>
            <!-- "Order History" button at the bottom of each card -->
            <button class="order-history-btn" data-restaurant="${restaurant.restaurant_username}">
              Order History
            </button>
          </div>
        `);
      });
    } catch (err) {
      console.error('Error loading restaurant info:', err);
    }
  }

  loadRestaurantInfo();

  /************************************
   * 3. Star Rating Click Handler
   ************************************/
  $("#restaurant-info-list").on("click", ".rating span", async function() {
    const $star = $(this);
    const selectedRating = parseInt($star.attr("data-star"), 10);
    const $ratingContainer = $star.closest(".rating");
    const restaurantUsername = $ratingContainer.data("restaurant-username");

    try {
      // PUT to /api/restaurants/:username/rating
      const response = await fetch(`/api/restaurants/${restaurantUsername}/rating`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: selectedRating })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Rating update failed');
      }
      alert("Rating updated successfully!");

      // Update UI
      $ratingContainer.find("span").each(function() {
        const starValue = parseInt($(this).attr("data-star"), 10);
        if (starValue <= selectedRating) {
          $(this).addClass("filled-star");
        } else {
          $(this).removeClass("filled-star");
        }
      });
    } catch (err) {
      console.error("Error updating rating:", err);
      alert("Error updating rating.");
    }
  });

  /************************************
   * 4. "Order History" Button Click
   ************************************/
  $("#restaurant-info-list").on("click", ".order-history-btn", function() {
    const restaurantUsername = $(this).data("restaurant");
    // Navigate to order-history.html with ?restaurant=some_username
    window.location.href = `/html/order-history.html?restaurant=${encodeURIComponent(restaurantUsername)}`;
  });

  /************************************
   * 5. Optional Search Implementation
   ************************************/
  $("#search").on("input", function() {
    const searchText = $(this).val().toLowerCase();
    $(".restaurant-item").each(function() {
      const text = $(this).text().toLowerCase();
      $(this).toggle(text.includes(searchText));
    });
  });
});
  