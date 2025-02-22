$(document).ready(function () {
    let orderHistory = [
        { orderId: "403-3501747-4070742", date: "17 January 2025", foodName: "Vegetable Biryani", amountDonated: "10 kg" },
        { orderId: "403-3501747-4070743", date: "18 January 2025", foodName: "Chapati", amountDonated: "15 kg" },
        { orderId: "403-3501747-4070744", date: "19 January 2025", foodName: "Paneer Butter Masala", amountDonated: "5 kg" }
    ];

    function loadOrderHistory() {
        $("#order-history-list").empty();

        // Add Column Headers
        $("#order-history-list").append(`
            <div class="order-header">
                <div>Order ID</div>
                <div>Date</div>
                <div>Food Name</div>
                <div>Amount Donated</div>
            </div>
        `);

        // Add Orders
        orderHistory.forEach((order) => {
            $("#order-history-list").append(`
                <div class="order-container">
                    <div class="order-content">
                        <div class="order-id">${order.orderId}</div>
                        <div class="order-date">${order.date}</div>
                        <div class="food-name">${order.foodName}</div>
                        <div class="amount-donated">${order.amountDonated}</div>
                    </div>
                </div>
            `);
        });
    }

    loadOrderHistory();
});
