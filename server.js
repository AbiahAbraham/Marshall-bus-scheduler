const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

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

// Forgot & reset password
app.post("/api/requestReset", (req, res) => {
  const {email} = req.body; 

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
    if (err) throw err; 
    if (result.length === 0 return res.json({message: "Email not found!"});

    res.json({message: "reset link sent to email"});
  });
});
