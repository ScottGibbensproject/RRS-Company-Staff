require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const authRoutes = require('./auth');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'rrs-dashboard-secret-change-me',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true if using HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Auth middleware - protect all routes except login
const requireAuth = (req, res, next) => {
  const publicPaths = ['/login', '/login.html', '/auth/login', '/css/', '/js/'];
  // Internal API endpoints used by summary aggregation
  const internalApiPaths = ['/api/gmail/summary', '/api/gmail/emails', '/api/gcloud/summary', '/api/gmail/callback', '/api/gmail/auth'];
  const isPublic = publicPaths.some(p => req.path.startsWith(p) || req.path === '/');
  const isInternalApi = internalApiPaths.includes(req.path);

  if (req.path === '/') {
    return res.redirect('/login.html');
  }

  if (isPublic || isInternalApi) {
    return next();
  }

  if (req.session && req.session.authenticated) {
    return next();
  }

  // API requests get 401, browser requests get redirected
  if (req.path.startsWith('/api/')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  res.redirect('/login.html');
};

app.use(requireAuth);

// Static files
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

// Dashboard route (protected)
app.get('/dashboard', (req, res) => {
  if (!req.session.authenticated) {
    return res.redirect('/login.html');
  }
  res.sendFile(path.join(__dirname, '../public/dashboard.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║           RRS Dashboard Server Started                ║
╠═══════════════════════════════════════════════════════╣
║  Local:    http://localhost:${PORT}                      ║
║  Status:   Running                                    ║
╚═══════════════════════════════════════════════════════╝
  `);
});
