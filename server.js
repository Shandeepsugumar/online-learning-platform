const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Atlas URI with fallback and database name
const mongoAtlasUri =
  process.env.MONGODB_URI ||
  "mongodb+srv://shandeep4621:shandeep4621@cluster0.dpijowj.mongodb.net/online-learning?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB
mongoose.connect(mongoAtlasUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// Register
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    res.json({ message: 'Login successful' });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get one user (example)
app.get('/api/user', async (req, res) => {
  try {
    const user = await User.findOne({});
    if (!user) return res.status(404).json({ message: 'No user found' });
    res.json(user);
  } catch (error) {
    console.error('Fetch Error:', error);
    res.status(500).json({ error: 'Failed to fetch user information' });
  }
});

// Update user
app.put('/api/user', async (req, res) => {
  const { username, email } = req.body;
  try {
    const updated = await User.updateOne({}, { username, email });
    if (updated.modifiedCount === 0) {
      return res.status(400).json({ message: 'No changes applied' });
    }
    res.sendStatus(200);
  } catch (error) {
    console.error('Update Error:', error);
    res.status(500).json({ error: 'Failed to update user information' });
  }
});

// Logout
app.post('/api/logout', (req, res) => {
  res.sendStatus(200);
});

// Global error handling
process.on('uncaughtException', err => {
  console.error('❗ Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❗ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start server
try {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running at http://0.0.0.0:${PORT}`);
  });
} catch (error) {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
}
