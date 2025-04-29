const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const app = express();
const port = 3000;


// Set up incoming request helpers & frontend files
app.use(express.json());
app.use(express.static(path.join(__dirname))); //HTML, CSS, JavaScript
app.use(bodyParser.json()); //Parse incoming JSON
app.use(cors()); //Frontend-backend communication

// Connect MySQL Database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '#', //my password for the local host removed
  database: 'marshall_bus_scheduler',
}); 

db.connect((err) => {
  if (err) throw err; 
  console.log('Database connected');
}); 

// Route for homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route for login page
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname,  'public', 'login.html'));
});

// User login 
app.post("/api/login", (req, res) => {
  const {email, password} = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
    if (err) {
        console.error(err); //log error on the server
        return res.status(500).json({message: 'Server error'});
    }

    if (result.length === 0) {
      return res.status(401).json({message: 'Invalid email or password'});
    }

    const user = result[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({message: 'Invalid email or password'});
    }

    // login happened successfully
    res.json({success: true, 
              message: "Login is successful", 
              user: {id: user.user_id, email: user.email}});
 });
});

      
// Request reset password 
// https://www.nodemailer.com/ & https://www.youtube.com/watch?v=ssbcgA2n9UY
app.post("/api/requestReset", (req, res) => {
  const {email} = req.body; 

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({message: "Server error"});
    }
    if (result.length === 0) { //user email was not found
      return res.json({message: "If the email exists, a reset link will be sent to the email."});
    }

    const token = crypto.randomBytes(32).toString("hex"); //creates a secure reset token
    const expiry = Date.now() + 3600000; //token can be used for 1 hour

    db.query("UPDATE users SET resetToken = ?, resetTokenExpiry = ? WHERE email = ?", [token, expiry, email], (err) => {
      if (err) {
        console.error("Database error while updating token: ", err);
        return res.status(500).json({message: "Failed to update token in the database."});
      }
      console.log(`Password reset link: http://localhost:3000/resetPassword.html?token=${token}`);

      const resetLink =  `http://localhost:3000/resetPassword.html?token=${token}`;
      const transporter = nodemailer.createTransport({ //email transporter
        service: "gmail",
        auth: {
          user: "#", //my gmail that will send the reset password email
          pass: "#", //my App password, removed for security & email will not work now
        },
      });

      //creates the email
      const mailOptions = {
        from: "#", //my gmail that will send the reset password email
        to: email,
        subject: "Reset your password",
        text: `Click this link to reset your password: ${resetLink}`,
      };
      //sends the email 
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error); 
          return res.status(500).json({message: "Failed to send reset email"});
        }
        console.log("Resent email sent: " + info.response);
        res.json({message: "If the email exists, a reset link will be sent to the email."});
      });
    });
  });
});

// Reset password
app.post("/api/resetPassword", async (req, res) => {
  const {token, newPassword} = req.body;

  const sql = "SELECT * FROM users WHERE resetToken = ? AND resetTokenExpiry > ?"; //user with reset token that is not expired
  db.query(sql, [token, Date.now()], async (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({message: "Server error"});
    }
    if (result.length === 0) {
      return res.status(400).json({message: "Token is invalid or expired"});
    }

    const user = result[0];
    const hashedPassword = await bcrypt.hash(newPassword, 10); //hash the new password

    const updateSql = "UPDATE users SET password = ?, resetToken = NULL, resetTokenExpiry = NULL WHERE user_id = ?";
    db.query(updateSql, [hashedPassword, user.user_id], (updateErr) => {
      if (updateErr) {
        console.error("Error updating password:", updateErr);
        return res.status(500).json({message: "Failed to reset password"});
      }
      res.json({message: "Password reset successful!"});
    });
  });
});

// Create new account
// https://kennethscoggins.medium.com/how-to-use-mysql-password-encryption-with-nodejs-express-and-bcrypt-ad9ede661109 
app.post("/api/createAccount", async (req, res) => {
  const {email, password} = req.body; 

  try { 
    const saltRounds = 10; 
    const hashedPassword = await bcrypt.hash(password, saltRounds); 

    const sql = "INSERT INTO users (email, password) VALUES (?, ?)";
    db.query(sql, [email, hashedPassword], (err, result) => {
      if (err) {return res.status(500).json({message: "Server error"});
      }
      res.json({success: true, message: "Account created!"});
  });
  } catch (error) {
    res.status(500).json({message: "Error creating account"});
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
