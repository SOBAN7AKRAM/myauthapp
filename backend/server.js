const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configure express-session middleware (required for Passport OAuth)
app.use(session({
  secret: 'your_session_secret',
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect('mongodb://localhost:27017/myauthdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define User schema and model
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: String,
});
const User = mongoose.model('User', UserSchema);

// Secret key for JWT
const JWT_SECRET = 'your_jwt_secret_key';

// Passport session setup.
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Configure Passport with GoogleStrategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID, 
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;
      let user = await User.findOne({ email });
      if (user) {
        return done(null, user);
      } else {
        user = await User.create({
          email: email,
          name: profile.displayName,
          password: '',
        });
        return done(null, user);
      }
    } catch (err) {
      return done(err, null);
    }
  }
));

// Routes

app.get("/hello", (req, res) => {
  res.send("Hello World!");
});

// Registration Route
app.post('/register', async (req, res) => {
  const { email, name, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({ email, name, password: hashedPassword });
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    return res.json({ status: 'ok', user, token });
  } catch (error) {
    res.json({ status: 'error', error: 'User already exists' });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ status: 'error', error: 'Invalid login' });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (isPasswordValid) {
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    return res.json({ status: 'ok', token });
  } else {
    return res.json({ status: 'error', error: 'Invalid login' });
  }
});

// Protected Route (example using JWT token)
app.get('/protected', async (req, res) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ status: 'ok', data: `Hello ${decoded.email}` });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Google OAuth Routes

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id, email: req.user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.redirect(`myapp://auth?token=${token}`);
  }
);

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

