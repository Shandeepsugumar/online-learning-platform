const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const app = express();
const PORT = 5000;
app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI || "mongodb://mongo:27017/mydb");


const User = mongoose.model('User', new mongoose.Schema({
    username: String,
    email: String,
    password: String,
}));

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

app.get('/api/user', async (req, res) => {
    try {
      const newUser = await newUser.findOne({ username, email });
      res.json(newUser);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch user information' });
    }
});
  
app.put('/api/user', async (req, res) => {
    const { username, email } = req.body;
    try {
      await newUser.updateOne({}, { username, email });
      res.sendStatus(200);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update user information' });
    }
});
  
app.post('/api/logout', (req, res) => {
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});

