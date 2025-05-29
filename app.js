const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs'); // To use EJS for rendering HTML
app.use(session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 } // Session expires after 1 minute for testing purposes
}));

// MongoDB Connection
mongoose.connect('mongodb+srv://shandeep4621:shandeep4621@cluster0.dpijowj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
});

// Create a model
const User = mongoose.model('User', userSchema);

// Routes
app.get('/', (req, res) => {
    res.redirect('/register');  // Redirect root to register
});

// Register Route
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/register.html'));
});

app.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });
        await newUser.save();
        res.redirect('/login');
    } catch (error) {
        console.error(error);
        res.redirect('/register');
    }
});

// Login Route
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/login.html'));
});

app.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user && await bcrypt.compare(req.body.password, user.password)) {
            req.session.userId = user._id;
            res.redirect('/profile');
        } else {
            res.redirect('/login?error=Invalid credentials');
        }
    } catch (error) {
        console.error(error);
        res.redirect('/login');
    }
});

// Profile Route
app.get('/profile', async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    const user = await User.findById(req.session.userId);
    res.render('profile', { user });
});

// Update Profile Route
app.post('/updateProfile', async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    try {
        await User.findByIdAndUpdate(req.session.userId, {
            username: req.body.username,
            email: req.body.email
        });
        res.redirect('/profile');
    } catch (error) {
        console.error(error);
        res.redirect('/profile');
    }
});

// Logout Route
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/profile');
        }
        res.redirect('/login');
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
