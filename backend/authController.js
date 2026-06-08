
const bcrypt = require('bcryptjs');
const userModel = require('./userModel');

// Password must be at least 5 characters long with uppercase, lowercase, and a number
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{5,}$/;

async function signup(req, res) {
  const { user_f_name, user_l_name, username, email, password, role = 'user' } = req.body;

  if (!PASSWORD_REGEX.test(password)) {
    return res.status(400).json({
      error: 'Password must be at least 5 characters long and include uppercase, lowercase letters, and a digit.'
    });
  }

  try {
    const existingUser = await userModel.findByUsername(username);
    console.log('🔍 Checking if user exists:', existingUser);

    if (existingUser) {
      return res.status(400).json({ error: 'Username taken. Please choose another username.' });
    }

    const existingEmail = await userModel.findByEmail(email);
if (existingEmail) {
  return res.status(400).json({ error: 'Email address already registered. Please Login instead.' });
}

    const hashedPassword = await bcrypt.hash(password, 10);
    await userModel.createUser({
      user_f_name,
      user_l_name,
      username,
      email,
      password: hashedPassword,
      role
    });

    console.log('✅ User created:', username);
    res.status(201).json({ message: 'Signup successful. You can now log in.' });
  } catch (err) {
    console.error('❌ Error during signup:', err);
    res.status(500).json({ error: 'Server error during signup. Try again later.' });
  }
}

async function login(req, res) {
  const { username, password, role = 'user' } = req.body;

  try {
    const user = await userModel.findByUsername(username);
    console.log('🔐 Attempt login for:', username);

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    if (user.role !== role) {
      return res.status(403).json({ error: 'Access denied: role mismatch' });
    }

    // Store user info in session
    req.session.user = {
      id: user.user_id,
      username: user.username,
      role: user.role,
      user_f_name: user.user_f_name,
      user_l_name: user.user_l_name
    };

    const redirectPath = user.role === 'admin' ? '/cms_dashboard.html' : '/homepage.html'
    console.log('✅ Login successful:', username);
    res.json({ message: 'Login successful', redirect: redirectPath });
  } catch (err) {
    console.error('❌ Error during login:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
}

function logout(req, res) {
  req.session.destroy(err => {
    if (err) {
      console.error('❌ Logout error:', err);
      return res.status(500).json({ error: 'Could not log out.' });
    }

    res.clearCookie('connect.sid');
    console.log('👋 Logout successful');
    res.status(200).json({ message: 'Logout successful' }); // ✅ Explicit 200 status
  });
}

module.exports = { signup, login, logout };
