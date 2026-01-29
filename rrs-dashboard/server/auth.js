const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

// Login endpoint
router.post('/login', async (req, res) => {
  const { password } = req.body;
  const storedHash = process.env.DASHBOARD_PASSWORD_HASH;

  if (!storedHash) {
    // If no hash is set, check against plain password (for initial setup)
    const plainPassword = process.env.DASHBOARD_PASSWORD || 'changeme';
    if (password === plainPassword) {
      req.session.authenticated = true;
      return res.json({ success: true, redirect: '/dashboard.html' });
    }
  } else {
    // Compare with hashed password
    const match = await bcrypt.compare(password, storedHash);
    if (match) {
      req.session.authenticated = true;
      return res.json({ success: true, redirect: '/dashboard.html' });
    }
  }

  res.status(401).json({ success: false, error: 'Invalid password' });
});

// Logout endpoint
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ success: true, redirect: '/login.html' });
  });
});

// Check auth status
router.get('/status', (req, res) => {
  res.json({ authenticated: !!req.session.authenticated });
});

// Utility: Generate password hash (for setup)
router.get('/hash/:password', async (req, res) => {
  // Only allow this in development
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'Not available in production' });
  }
  const hash = await bcrypt.hash(req.params.password, 10);
  res.json({
    hash,
    instruction: 'Add this to your .env file as DASHBOARD_PASSWORD_HASH'
  });
});

module.exports = router;
