/**
 * Sessions API Routes
 */

const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/sessions - List recent sessions
router.get('/', (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 50;
        const projectId = req.query.project_id || null;
        const sessions = db.sessions.getAll(limit, projectId);
        res.json({ sessions });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/sessions/:id - Get session details
router.get('/:id', (req, res) => {
    try {
        const session = db.sessions.getById(req.params.id);
        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        const tools = db.sessions.getToolUsage(req.params.id);
        const files = db.sessions.getFileChanges(req.params.id);

        res.json({ session, tools, files });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
