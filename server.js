const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cors = require('cors');


// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(cors());

// Connect Database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', 
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

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// User login
app.post("/api/login", (req, res) => {
  const {email, password} = req.body;

  db.query("SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
    if (err) return res.status(500).json({message: 'Server error'});

    if (result.length === 0) {
      return res.status(401).json({message: 'Invalid email or password'});
    }

    const user = result[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({message: 'Invalid email or password'});
    }

    res.json({success: true, message: "Login successful', user: {id: user.user_id, email: user.email}});
 });
});

      
// Forgot & reset password
app.post("/api/requestReset", (req, res) => {
  const {email} = req.body; 

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
    if (err) throw err; 
    if (result.length === 0 return res.json({message: "Email not found!"});

    res.json({message: "reset link sent to email"});
  });
});

// Create new account
app.post("/api/createAccount", async (req, res) => {
  const {email, password} = req.body; 

  try { 
    const saltRounds = 10; 
    const hashedPassword = await bcrypt.hash(password, saltRounds); 

    const sql = "INSERT INTO users (email, password) VALUES (?, ?)";
    db.query(sql, [email, hashedPassword], (err, result) => {
      if (err) return res.status(500).json({message: "Server error"});
      res.json({success: true, message: "Account created!"});
  });
  } catch (error) {
    res.status(500).json({message: "Error creating account"});
  }
});
