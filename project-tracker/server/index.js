/**
 * Project Tracker Server
 * Tracks Claude Code sessions across multiple projects
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || 'localhost';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// Request logging
app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
        console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
    }
    next();
});

// API Routes
app.use('/api/projects', require('./routes/projects'));
app.use('/api/sessions', require('./routes/sessions'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/activity', require('./routes/activity'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/hooks', require('./routes/hooks'));

// Serve project detail page
app.get('/project/:id', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'project.html'));
});

// Fallback to index
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).json({ error: err.message });
});

// Start server
app.listen(PORT, HOST, () => {
    console.log(`
╔════════════════════════════════════════════════╗
║         Project Tracker Dashboard              ║
╠════════════════════════════════════════════════╣
║  Server running at:                            ║
║  http://${HOST}:${PORT}                            ║
║                                                ║
║  API Endpoints:                                ║
║  - GET  /api/projects                          ║
║  - GET  /api/tasks                             ║
║  - POST /api/hooks/event                       ║
║  - GET  /api/dashboard/summary                 ║
╚════════════════════════════════════════════════╝
    `);
});
