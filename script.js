//https://medium.com/@satyamv57/20-javascript-tips-and-tricks-you-can-use-right-now-e698880db0f1 
console.log("script.js is loaded");

// List of schedules
const schedules = [
    // Add more schedules
];

//schedule
function displaySchedule() {
    const tableBody = document.querySelector("#scheduleTable tbody");
    schedules.forEach(schedule => {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${schedule.busNumber}</td><td>${schedule.route}</td><td>${schedule.departure}</td><td>${schedule.arrival}</td>`;
        tableBody.appendChild(row);
    });
}
document.addEventListener("DOMContentLoaded", function() {
    displaySchedule();
})

//booking
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

// bookingForm 
document.addEventListener("DOMContentLoaded", function() {
    const bookingForm = document.getElementById("bookingForm");
    if (bookingForm) {
        bookingForm.addEventListener("submit", function(e){
            e.preventDefault();
            priceCalculator();//call priceCalculator on bookingForm submit button

            const price = parseFloat(document.getElementById("amount").value).toFixed(2); //get calculated price

            localStorage.setItem("bookingPrice", price); //store price in localStorage 

            window.location.href = "payment.html" //redirect to payment.html
        });
    } else {
        console.log("Booking form not found.");
    }
});

//routes 
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
document.addEventListener("DOMContentLoaded", function() {
    const price = localStorage.getItem("bookingPrice");

    if (price) {
        document.getElementById("amount").value = price;
    } else {
        console.log("No price found in localStorage");
    }

    const paymentForm = document.getElementById("paymentForm");
    if (paymentForm) {
        paymentForm.addEventListener("submit", function(event) {
            event.preventDefault();
            const amount = document.getElementById("amount").value;
            const cardNumber = document.getElementById("card").value;
            const expiration = document.getElementById("expiration").value;
            const cvv = document.getElementById("cvv").value;

            if (!amount || !cardNumber || !expiration || !cvv) { //all are required to submit
                alert("Please fill in all payment details.");
                return;
            }
            if (!expired()) {
                alert("This card is expired");
                return;
            }

            alert("Payment Successful!");
            window.location.href = "booking.html";
    });
}
});

//check if card is expired
function expired(){
    const today = new Date();
    const expInput = document.getElementById("expiration").value;
    if (!expInput) {
        return false;
    }
    const [year, month] = expInput.split("-").map(Number);
    const expDate = new Date(year, month, 0); //last day of the previous month
    return today <= expDate; 
}



//price calculator for a dial-a-ride
function priceCalculator() {
    console.log("priceCalculator function executed");

    const adult = parseFloat(document.getElementById("adult_passengers").value) || 0;
    const child = parseFloat(document.getElementById("children_passengers").value) || 0;
    
    console.log("Adults", adult, "Children", child);

    let price = 0; 

    const time = document.getElementById("time").value; //time of booking 
    if (!time) {
        console.log("No time selected");
        return; 
    }

    const [hours, minutes] = time.split(":").map(Number);
    const totalMinutes = (hours*60) + minutes; //use totalMinutes to get ride of the Date issue for calculating
    const fourthirtyMinutes = (16*60) + 30; //4:30pm minutes

    //calculate the price
    if (totalMinutes < fourthirtyMinutes) {
        price = (adult*2) + child; 
    } else {
        price = (adult*2.5) + child; 
    }

    console.log("Calculated price: ", price);

    localStorage.setItem("bookingPrice", price.toFixed(2));

    // set the price value in payment.html
    document.getElementById("amount").value = price.toFixed(2); 
}




//forgot password & reset password https://medium.com/@kanishksinghmaurya/reset-password-forget-password-implementation-using-node-js-mongodb-nodemailer-jwt-7b2fe9597ca1
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

            if (response.ok) {
                setTimeout(() => {
                    window.location.href = "login.html";
                }, 2000); //wait 2 seconds before going to login.html
            }
        });
    }
});

//handle login to booking/payment https://codeshack.io/basic-login-system-nodejs-express-mysql/
document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const email = document.getElementById("email").value; 
            const password = document.getElementById("password").value;

            try {
                const response = await fetch("/api/login", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({email, password})
                });
                const data = await response.json();
    
                if (response.ok) {
                    alert(data.message);
                    window.location.href = "booking.html";
                } else {
                    document.getElementById("errorMessage").innerText = data.message;
                }
            } catch (error) {
                document.getElementById("errorMessage").innerText = "Error: " + error.message;
            }
        });
    }
});
//handle logout of booking/payment
document.addEventListener("DOMContentLoaded", function() {
    const logoutBtn = document.getElementById("logoutBtn"); 

    if (logoutBtn) {
        logoutBtn.addEventListener("click", function() {
            alert("You have been logged out!");
            window.location.href = "index.html"; //redirect to home page
        });
    }
});

//handle account creation
document.addEventListener("DOMContentLoaded", function() {
    const accountForm = document.getElementById("createAccountForm");

    if (accountForm) {
        accountForm.addEventListener("submit", async function (event) {
            event.preventDefault(); 

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
                    alert("Account created!");
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

// Function to update clock every second
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
    

    // Update clock element with the new time
    document.getElementById('clock').textContent = `${hours}:${minutes}:${seconds} ${ampm}`;
}

// Clock is updated once DOM is loaded & updated every second
document.addEventListener("DOMContentLoaded", function() {
    updateClock(); // Initial call to set the clock immediately
    setInterval(updateClock, 1000); // Update the clock every second
});
//We used AI to help troubleshoot and solve errors in our code. 
