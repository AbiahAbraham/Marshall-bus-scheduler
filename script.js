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
    
    const cardNumber = document.getElementById("card").value;
    const cvv = document.getElementById("cvv").value;
    const time = document.getElementById("time").value;

    if (!cardNumber || !cvv || !time) {
        alert("Please fill in all fields.");
        return;
    }

    alert(`Booking confirmed for Dial-a-Ride.`);
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


//price calculator for a dial-a-ride
function priceCalculator() {
    console.log("priceCalculator function executed");

    const adult = parseFloat(document.getElementById("adult_passengers").value) || 0;
    const child = parseFloat(document.getElementById("children_passengers").value) || 0;
    
    console.log("Adults", adult, "Children", child);

    let price = 0; 

    const time = document.getElementById("time").value; //time of booking 
    const fourthirty = new Date(); //4:30 
    fourthirty.setHours(16, 30, 0, 0);

    const [hours, minutes] = time.split(":").map(Number);
    const bookingTime = new Date();
    bookingTime.setHours(hours, minutes, 0, 0);

    //calculate the price
    if (bookingTime < fourthirty){
        price = adult*2 + child;
    }
    else {
        price = adult*2.5 + child;
    }

    //set the price value
    document.getElementById("amount").value = price.toFixed(2); 
}

//check if card is expired
function expired(){
    const today = new Date();
    const exp = document.getElementById("date");
    if (today > exp){
        alert("This card is expired.");
    }
}

//forgot password & reset password 
document.addEventListener("DOMContentLoaded", function() {
    //Handle forgot password form submission
    const forgotPasswordForm = document.getElementById("forgotPasswordForm");
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener("submit", async function (event) {
            event.preventDefault();
            const email = document.getElementById("email").value; 

            const response = await fetch("/api/requestReset", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({email}),
            });

            const data = await response.json();
            document.getElementById("message").innerText = data.message;
        })
    }

    //Handle reset password form submission
    const resetPasswordForm = document.getElementById("ResetPasswordForm");
    if (resetPasswordForm){
        document.getElementById("token").value = new URLSearchParams(window.location.search).get("token");

        resetPasswordForm.addEventListener("submit", async function (event) {
            event.preventDefault();
            const token = document.getElementById("token").value; 
            const newPassword = document.getElementById("newPassword").value; 

            const response = await fetch("/api/resetPassword", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({token, newPassword}),
            });

            const data = await response.json(); 
            document.getElementById("message").innerText = data.message;
        });
    }
});

//handle login to booking/payment 
document.getElementByID("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault(); 

    const email = document.getElementByID("email").value;
    const password = document.getElementById("password").value; 
    const errorMessage = document.getElementByID("errorMessage"); 

    try {
        const response = await fetch("/api/login", {
            method: "POST", 
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email, password}),
        });

        const data = await response.json();

        if (response.ok) {
            alert("Login successful!"); 
            window.location.href = "booking.html";
        } else {
            errorMessage.textContent = "Server error. Please try again.";
        }
    } catch (error) {
        errorMessage.textContent = "Server error. Please try again.";
    }
}); 

<script>
    document.getElementById("booking-form").onsubmit = function(event) {
        event.preventDefault(); // Prevents default form submission
        window.location.href = "payment.html"; // Redirect to payment page
    };
</script>
