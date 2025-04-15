// Add JavaScript code for your web site here and call it from index.html.

console.log("script.js is loaded"); // script.js loaded

// Bus schedules
const schedules = [
    { busNumber: '101', route: 'A to B', departure: '08:00', arrival: '10:00' },
    { busNumber: '102', route: 'B to C', departure: '09:00', arrival: '11:00' },
    // Add more schedules
];

// Show schedule in table
function displaySchedule() {
    const tableBody = document.querySelector("#scheduleTable tbody");
    schedules.forEach(schedule => {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${schedule.busNumber}</td><td>${schedule.route}</td><td>${schedule.departure}</td><td>${schedule.arrival}</td>`;
        tableBody.appendChild(row);
    });
}
document.addEventListener("DOMContentLoaded", displaySchedule);


// Booking form confirmation
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

document.addEventListener("DOMContentLoaded", () => {
    const bookingForm = document.querySelector("form");
    bookingForm.addEventListener("submit", handleBooking);
});


// Available routes
const routes = ["Route A", "Route B", "Route C"];

function displayRoutes() {
    const routeList = document.getElementById("routeList");
    routes.forEach(route => {
        const listItem = document.createElement("li");
        listItem.textContent = route;
        routeList.appendChild(listItem);
    });
}
document.addEventListener("DOMContentLoaded", displayRoutes);

// Payment form 
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


// Price calculator for a dial-a-ride bookings
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

// Check if card is expired
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

// Login submission to booking/payment 
document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.querySelector("#loginForm");

    if (loginForm) {
        console.log("Login form found. Setting up event listener."); 
        
        loginForm.addEventListener("submit", async function (event) {
            event.preventDefault();
            console.log("Login form submitted.");

            const email = document.querySelector("#loginForm #email").value; 
            const password = document.querySelector("#loginForm #password").value;

            console.log("Email:", email, "Password:", password); 

            try {
                const response = await fetch("/api/login", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({email, password})
                });

                const data = await response.json();
                console.log("Server response:", data);

                if (response.ok) {
                    alert(data.message);
                    window.location.href = "booking.html";
                } else {
                    document.getElementById("errorMessage").innerText = data.message;
                }
            } catch (error) {
                console.error("Login error:", error);
                document.getElementById("errorMessage").innerText = "Something went wrong.";
            }
            });
        } else {
            console.warn("Login form not found.");
    }
});

// Account creation
document.addEventListener("DOMContentLoaded", function() {
    const createButton = document.querySelector(".create_account_button");

    if (createButton) {
        createButton.addEventListener("click", async function () {
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const repeatPassword = document.getElementById("repeat_password").value;

            if (password !== repeatPassword){
                alert("Passwords do not match.");
                return;
            }

            try {
                const response = await fetch("/api/createAccount", {
                    method: "POST",
                    headers: {"Content-Type": "application/json",},
                    body: JSON.stringify({email, password}),
                });
                if (response.ok) {
                    alert("Account created successfully!");
                    window.location.href = "login.html";
                } else {
                    const errorText = await response.text()
                    throw new Error(errorText);
                }
            } catch (error) {
                alert("Error: " + error.message);
            }
        });
    }
});




document.getElementById("booking-form").onsubmit = function(event) {
    event.preventDefault(); // Prevents default form submission
    window.location.href = "payment.html"; // Redirect to payment page
};
