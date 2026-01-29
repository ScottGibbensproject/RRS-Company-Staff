/**
 * Activity API Routes
 */

const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/activity - Get activity timeline
router.get('/', (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 100;
        const projectId = req.query.project_id || null;
        const type = req.query.type || null;

        const activities = db.activityLog.getAll(limit, projectId, type);
        res.json({ activities });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
