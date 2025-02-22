$(document).ready(function () {
    let restaurants = [
        { id: 1, name: "A2B Restaurant", address: "2, GST Road, Thailavaram Village, Chennai - Trichy Hwy, Maraimalai Nagar, Guduvancheri, Tamil Nadu 603202", amount_donated: "30 kg", rating: 4 },
        { id: 2, name: "Saravana Bhavan", address: "T.Nagar, Chennai, Tamil Nadu", amount_donated: "20 kg", rating: 5 }
    ];

    function loadRestaurants() {
        $("#restaurant-list").empty();

        // Add Column Headers
        $("#restaurant-list").append(`
            <div class="restaurant-header">
                <div>S.No</div>
                <div>Restaurant Name</div>
                <div>Address</div>
                <div>Amount Donated</div>
                <div>Rating</div>
            </div>
        `);

        // Add Restaurants
        restaurants.forEach((restaurant, index) => {
            $("#restaurant-list").append(`
                <div class="restaurant-container">
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

        // Handle Star Click for Rating
        $(".rating span").click(function () {
            let selectedRating = $(this).data("value");
            let restaurantId = $(this).parent().data("id");

            // Update UI with new rating
            restaurants = restaurants.map(r => r.id === restaurantId ? { ...r, rating: selectedRating } : r);
            loadRestaurants(); // Refresh UI
        });
    }

    function generateStars(rating) {
        let stars = "";
        for (let i = 1; i <= 5; i++) {
            stars += `<span data-value="${i}" class="${i <= rating ? "filled-star" : "empty-star"}">★</span>`;
        }
        return stars;
    }

    loadRestaurants();
});
