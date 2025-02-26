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

app.get("/hello", (req, res) => {
  res.send("Hello World!");
});

// Registration Route
app.post('/register', async (req, res) => {
  const { email, name, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({email, name, password: hashedPassword });
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

// Protected Route
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

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
