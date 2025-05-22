const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;  // Declare PORT once

app.use(cors());
app.use(bodyParser.json());

// MongoDB Atlas connection URI from environment variable or fallback (replace placeholders)
const mongoAtlasUri = process.env.MONGODB_URI || 
  "mongodb+srv://shandeep4621:shandeep4621@cluster0.dpijowj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB Atlas (no deprecated options)
mongoose.connect(mongoAtlasUri)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch(err => {
    console.error("MongoDB Atlas connection error:", err);
    process.exit(1); // Exit if DB connection fails
  });

// Define User model
const User = mongoose.model('User', new mongoose.Schema({
  username: String,
  email: String,
  password: String,
}));

// Register route
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    res.json({ message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user info (example fetch)
app.get('/api/user', async (req, res) => {
  try {
    const user = await User.findOne({});
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user information' });
  }
});

// Update user info (example update)
app.put('/api/user', async (req, res) => {
  const { username, email } = req.body;
  try {
    await User.updateOne({}, { username, email });
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user information' });
  }
});

// Logout endpoint
app.post('/api/logout', (req, res) => {
  res.sendStatus(200);
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
