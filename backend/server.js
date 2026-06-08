require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const auth = require('./auth');
 
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'defaultSecretKey',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
});

app.use('/auth', auth);

function ensureLoggedIn(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/loginpagefinal.html');
  }
}

function ensureAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === 'admin') {
    next();
  } else {
    res.status(403).send('Forbidden: Admins only.');
  }
}

app.get('/admin_listedproducts', ensureLoggedIn, ensureAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'admin_listedproducts.html'));
});

app.get('/user_profile.html', ensureLoggedIn, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'user_profile.html'));
});

app.get('*', (req, res) => {
  res.status(404).send('Page not found');
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`); 
});
