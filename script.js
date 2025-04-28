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

// Global variable to save scheduled ride time
let scheduledRideTime = null;

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
    
    scheduledRideTime = time; // Save booking time for reminders
}

document.addEventListener("DOMContentLoaded", () => {
    const bookingForm = document.querySelector("#bookingForm"); // fixed the missing #
    if (bookingForm) {
        bookingForm.addEventListener("submit", handleBooking);
    }
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

// Price calculator for a dial-a-ride booking
function priceCalculator() {
    console.log("priceCalculator function executed");

    const adult = parseFloat(document.getElementById("adult_passengers").value) || 0;
    const child = parseFloat(document.getElementById("children_passengers").value) || 0;
    
    console.log("Adults", adult, "Children", child);

    let price = 0; 

    const time = document.getElementById("time").value;
    const fourthirty = new Date();
    fourthirty.setHours(16, 30, 0, 0);

    const [hours, minutes] = time.split(":").map(Number);
    const bookingTime = new Date();
    bookingTime.setHours(hours, minutes, 0, 0);

    if (bookingTime < fourthirty){
        price = adult * 2 + child;
    } else {
        price = adult * 2.5 + child;
    }

    document.getElementById("amount").value = price.toFixed(2); 
}

// Check if card is expired
function expired() {
    const today = new Date();
    const exp = new Date(document.getElementById("date").value); // Fixed
    if (today > exp) {
        alert("This card is expired.");
    }
}

// Forgot password & reset password
document.addEventListener("DOMContentLoaded", function() {
    const forgotPasswordForm = document.getElementById("forgotPasswordForm");
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener("submit", async function(event) {
            event.preventDefault();
            const email = document.getElementById("email").value;

            const response = await fetch("/api/requestReset", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            document.getElementById("message").innerText = data.message;
        });
    }

    const resetPasswordForm = document.getElementById("ResetPasswordForm");
    if (resetPasswordForm) {
        document.getElementById("token").value = new URLSearchParams(window.location.search).get("token");

        resetPasswordForm.addEventListener("submit", async function(event) {
            event.preventDefault();
            const token = document.getElementById("token").value;
            const newPassword = document.getElementById("newPassword").value;

            const response = await fetch("/api/resetPassword", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, newPassword }),
            });

            const data = await response.json();
            document.getElementById("message").innerText = data.message;
        });
    }
});

// Login submission
document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.querySelector("#loginForm");

    if (loginForm) {
        console.log("Login form found. Setting up event listener.");

        loginForm.addEventListener("submit", async function(event) {
            event.preventDefault();
            console.log("Login form submitted.");

            const email = document.querySelector("#loginForm #email").value;
            const password = document.querySelector("#loginForm #password").value;

            console.log("Email:", email, "Password:", password);

            try {
                const response = await fetch("/api/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
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

// Handle account creation
document.addEventListener("DOMContentLoaded", function() {
    const accountForm = document.getElementById("createAccountForm");

    if (accountForm) {
        accountForm.addEventListener("submit", async function(event) {
            event.preventDefault();

            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const repeatPassword = document.getElementById("repeat_password").value;

            if (password !== repeatPassword) {
                alert("Passwords do not match.");
                return;
            }

            try {
                const response = await fetch("/api/createAccount", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                });

                if (response.ok) {
                    alert("Account created successfully!");
                    window.location.href = "login.html";
                } else {
                    const errorText = await response.text();
                    throw new Error(errorText);
                }
            } catch (error) {
                alert("Error: " + error.message);
            }
        });
    }
});

// Redirect booking form to payment
document.getElementById("booking-form").onsubmit = function(event) {
    event.preventDefault();
    window.location.href = "payment.html";
};

// Clock
function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    let ampm = "AM";
    if (hours >= 12) {
        ampm = "PM";
    }

    hours = hours % 12;
    if (hours === 0) {
        hours = 12;
    }

    document.getElementById('clock').textContent = `${hours}:${minutes}:${seconds} ${ampm}`;
}
updateClock();
setInterval(updateClock, 1000);

// === NEW: Reminder check for scheduled ride! ===
setInterval(function() {
    if (!scheduledRideTime) {
        return;
    }

    const now = new Date();
    const [rideHours, rideMinutes] = scheduledRideTime.split(":").map(Number);
    const rideTime = new Date();
    rideTime.setHours(rideHours, rideMinutes, 0, 0);

    const diffMs = rideTime - now;
    const diffMinutes = diffMs / (1000 * 60);

    if (diffMinutes <= 10 && diffMinutes > 0) {
        alert(`Reminder: Your scheduled ride is in ${Math.ceil(diffMinutes)} minutes!`);
        scheduledRideTime = null; // Clear so it doesn't keep sending reminders
    }
}, 60000); // check every 60 seconds

