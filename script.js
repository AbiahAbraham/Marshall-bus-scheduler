// Add JavaScript code for your web site here and call it from index.html.
// Assuming you have a list of schedules
const schedules = [
    { busNumber: '101', route: 'A to B', departure: '08:00', arrival: '10:00' },
    { busNumber: '102', route: 'B to C', departure: '09:00', arrival: '11:00' },
    // Add more schedules
];

function displaySchedule() {
    const tableBody = document.querySelector("#scheduleTable tbody");
    schedules.forEach(schedule => {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${schedule.busNumber}</td><td>${schedule.route}</td><td>${schedule.departure}</td><td>${schedule.arrival}</td>`;
        tableBody.appendChild(row);
    });
}

// Call the function when the page loads
document.addEventListener("DOMContentLoaded", displaySchedule);


function handleBooking(event) {
    event.preventDefault();
    
    const busNumber = document.getElementById("bus-number").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;

    if (!busNumber || !date || !time) {
        alert("Please fill in all fields.");
        return;
    }

    alert(`Booking confirmed for Bus ${busNumber} on ${date} at ${time}.`);
}

// Add event listener for the booking form
document.addEventListener("DOMContentLoaded", () => {
    const bookingForm = document.querySelector("form");
    bookingForm.addEventListener("submit", handleBooking);
});

const routes = ["Route A", "Route B", "Route C"];

function displayRoutes() {
    const routeList = document.getElementById("routeList");
    routes.forEach(route => {
        const listItem = document.createElement("li");
        listItem.textContent = route;
        routeList.appendChild(listItem);
    });
}

// Call the function when the page loads
document.addEventListener("DOMContentLoaded", displayRoutes);
function handlePayment(event) {
    event.preventDefault();

    const amount = document.getElementById("amount").value;
    const cardNumber = document.getElementById("card").value;
    const expiration = document.getElementById("expiration").value;
    const cvv = document.getElementById("CVV").value;

    if (!amount || !cardNumber || !expiration || !cvv) {
        alert("Please fill in all payment details.");
        return;
    }

    alert("Payment Successful!");
}

// Add event listener for the payment form
document.addEventListener("DOMContentLoaded", () => {
    const paymentForm = document.querySelector("form");
    paymentForm.addEventListener("submit", handlePayment);
});

<script>
    document.getElementById("booking-form").onsubmit = function(event) {
        event.preventDefault(); // Prevents default form submission
        window.location.href = "payment.html"; // Redirect to payment page
    };
</script>
