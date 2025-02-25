$(document).ready(function () {
  let foods = [
    { id: 1, restaurantName: "A2B Restaurant", foodName: "Vegetable Biryani, Poori, Dosa, Chapathi, Idli, Samosa, Idiyappam", weight: "250g", rating: 4, distance: "1.2 km" },
    { id: 2, restaurantName: "Saravana Bhavan", foodName: "Idli", weight: "150g", rating: 5, distance: "2.0 km" }
  ];

  function loadFoods() {
    $("#food-list").find(".food-item").remove(); // Clear existing items

    foods.forEach(food => {
      $("#food-list").append(`
        <div class="food-item">
          <div class="food-content">
            <div class="restaurant-name">${food.restaurantName}</div>
            <div class="food-name">${food.foodName}</div>
            <div class="weight">${food.weight}</div>
            <div class="distance">${food.distance}</div>
            <!-- Tick Button with image -->
            <div class="side-tick">
              <button class="tick-btn">
                <img src="../images/tick-icon-vector-14450588-removebg-preview.png" alt="Tick">
              </button>
            </div>
            <!-- Close Button with image -->
            <div class="close-btn">
              <button class="close-btn">
                <img src="../images/14025477.png" alt="Close">
              </button>
            </div>
          </div>
        </div>
      `);
    });

    // Handle rating star click
    $(".rating span").click(function () {
      let selectedRating = $(this).data("value");
      let foodId = $(this).parent().data("id");
      foods = foods.map(f => f.id === foodId ? { ...f, rating: selectedRating } : f);
      loadFoods();
    });
  }

  function generateStars(rating) {
    let stars = "";
    for (let i = 1; i <= 5; i++) {
      stars += `<span data-value="${i}" class="${i <= rating ? "filled-star" : "empty-star"}">★</span>`;
    }
    return stars;
  }

  loadFoods();

  // Dropdown toggle functionality

  // Toggle sort dropdown on sort-by button click
  $('.sort-by-btn').click(function(e) {
    e.stopPropagation();  // Prevent event bubbling
    $('.sort-dropdown').slideToggle(300);
  });
  
  // Toggle hamburger dropdown on hamburger button click
  $('.hamburger').click(function(e) {
    e.stopPropagation();
    $('.hamburger-dropdown').slideToggle(300);
  });

  // Prevent clicks within dropdown from closing it
  $('.sort-dropdown, .hamburger-dropdown').click(function(e) {
    e.stopPropagation();
  });

  // Hide dropdowns when clicking outside
  $(document).click(function() {
    $('.sort-dropdown').slideUp(300);
    $('.hamburger-dropdown').slideUp(300);
  });
});
