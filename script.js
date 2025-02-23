document.addEventListener("DOMContentLoaded", () => {
    // Schedules Display Logic
    const schedules = [
        { busNumber: '101', route: 'A to B', departure: '08:00', arrival: '10:00' },
        { busNumber: '102', route: 'B to C', departure: '09:00', arrival: '11:00' },
        // Add more schedules
    ];

    const displaySchedule = () => {
        const tableBody = document.querySelector("#scheduleTable tbody");
        if (tableBody) {
            schedules.forEach(schedule => {
                const row = document.createElement("tr");
                row.innerHTML = `<td>${schedule.busNumber}</td><td>${schedule.route}</td><td>${schedule.departure}</td><td>${schedule.arrival}</td>`;
                tableBody.appendChild(row);
            });
        }
    };
    displaySchedule();

    // Booking Form Logic
    const bookingForm = document.getElementById("booking-form");
    if (bookingForm) {
        bookingForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const busNumber = document.getElementById("bus-number").value;
            const date = document.getElementById("date").value;
            const time = document.getElementById("time").value;

            if (!busNumber || !date || !time) {
                alert("Please fill in all fields.");
                return;
            }

            alert(`Booking confirmed for Bus ${busNumber} on ${date} at ${time}.`);
            window.location.href = "payment.html";
        });
    }

    // Routes Display Logic
    const routes = ["Route A", "Route B", "Route C"];
    const displayRoutes = () => {
        const routeList = document.getElementById("routeList");
        if (routeList) {
            routes.forEach(route => {
                const listItem = document.createElement("li");
                listItem.textContent = route;
                routeList.appendChild(listItem);
            });
        }
    };
    displayRoutes();

    // Payment Form Logic
    const paymentForm = document.getElementById("paymentForm");
    if (paymentForm) {
        const adultsInput = document.getElementById("adults");
        const childrenInput = document.getElementById("children");
        const totalAmountInput = document.getElementById("totalAmount");
        const cardInput = document.getElementById("card");
        const cardTypeDisplay = document.getElementById("cardType"); // Add a span or div for card type
        const expirationInput = document.getElementById("expiration");
        const cvvInput = document.getElementById("CVV");

        const baseAdultCost = 2.5;
        const childCost = 1.0;

        const updateTotalAmount = () => {
            const adults = parseInt(adultsInput.value) || 0;
            const children = parseInt(childrenInput.value) || 0;
            const totalCost = (adults * baseAdultCost) + (children * childCost);
            totalAmountInput.value = totalCost.toFixed(2);
        };

        const detectCardType = (cardNumber) => {
            if (/^4/.test(cardNumber)) return "Visa";
            if (/^5[1-5]/.test(cardNumber)) return "MasterCard";
            if (/^3[47]/.test(cardNumber)) return "American Express";
            if (/^6(?:011|5)/.test(cardNumber)) return "Discover";
            return "Unknown Card Type";
        };

        cardInput.addEventListener("input", () => {
            // Remove non-numeric characters
            let cardNumber = cardInput.value.replace(/\D/g, ""); // Only digits
        
            // Limit to 16 digits
            if (cardNumber.length > 16) cardNumber = cardNumber.slice(0, 16);
        
            // Format the card number with spaces (e.g., 1234 5678 9012 3456)
            cardInput.value = cardNumber.replace(/(\d{4})(?=\d)/g, "$1 ");
        
            // Detect card type and display it
            const cardType = detectCardType(cardNumber);
            cardTypeDisplay.textContent = cardType;
        });
        
        
        // Validate payment details
        const validatePaymentDetails = () => {
            let isValid = true;

            // Reset styles
            cardInput.style.border = "";
            expirationInput.style.border = "";
            cvvInput.style.border = "";

            const rawCardNumber = cardInput.value.replace(/\s+/g, "");
            if (!/^\d{16}$/.test(rawCardNumber)) {
                isValid = false;
                cardInput.style.border = "2px solid red";
            }

            const today = new Date();
            const [expYear, expMonth] = expirationInput.value.split("-");
            const expDate = new Date(expYear, expMonth - 1);
            if (isNaN(expDate.getTime()) || expDate < today) {
                isValid = false;
                expirationInput.style.border = "2px solid red";
            }

            if (!/^\d{3}$/.test(cvvInput.value)) {
                isValid = false;
                cvvInput.style.border = "2px solid red";
            }

            return isValid;
        };

        paymentForm.addEventListener("input", updateTotalAmount);
        paymentForm.addEventListener("submit", (event) => {
            event.preventDefault();

            if (!validatePaymentDetails()) {
                alert("Please correct the highlighted fields.");
                return;
            }

            const totalAmount = parseFloat(totalAmountInput.value);
            if (totalAmount === 0) {
                alert("Please select at least one person.");
                return;
            }

            alert(`Payment Successful! Total Amount: $${totalAmount}`);
        });

        updateTotalAmount();
    }
});
// Handle Create Account link click
document.getElementById('createAccountLink').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default link behavior
    
    // Redirect to the account creation page
    window.location.href = 'create_account.html'; // Adjust this URL to match your actual sign-up page
});

// Handle Forgot Password link click
document.getElementById('forgotPasswordLink').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default link behavior
    
    // Ask the user for their email to reset the password
    let email = prompt("Please enter your email address to reset your password:");

    // Simple validation (you can add more robust checks here)
    if (email) {
        alert("If an account with that email exists, we'll send you a reset link.");
        
        // Optionally, send a request to a server to handle the password reset logic (e.g., using AJAX or fetch)
        // For now, simulate with a simple message
    } else {
        alert("Please enter a valid email address.");
    }
});

// Form submission handler (for actual login)
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Fetch the entered username and password (You can replace this with actual validation logic)
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Simple form validation (ensure fields are not empty)
    if (username && password) {
        alert("Login successful for " + username); // Placeholder for actual login logic
    } else {
        alert("Please fill in both fields.");
    }
});

