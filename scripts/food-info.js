$(document).ready(async function () {
  async function loadFoods() {
    try {
      const response = await fetch('/api/foods');
      const foods = await response.json();
      $("#food-list").empty();
      foods.forEach(food => {
        $("#food-list").append(`
          <div class="food-item">
            <div class="food-content">
              <div class="restaurant-name">${food.restaurant_name}</div>
              <div class="food-name">${food.food_name}</div>
              <div class="weight">${food.weight}</div>
              <div class="distance">${food.distance}</div>
              <div class="side-tick">
                <button class="tick-btn">
                  <img src="../images/tick-icon-vector-14450588-removebg-preview.png" alt="Tick">
                </button>
              </div>
              <div class="close-btn">
                <button class="close-btn">
                  <img src="../images/14025477.png" alt="Close">
                </button>
              </div>
            </div>
          </div>
        `);
      });
    } catch (err) {
      console.error('Error loading foods:', err);
    }
  }
  loadFoods();

  // Retain your UI logic for dropdown toggling
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
