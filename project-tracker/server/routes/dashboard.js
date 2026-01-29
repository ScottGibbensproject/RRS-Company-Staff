/**
 * Dashboard API Routes
 */

const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/dashboard/summary - Dashboard summary data
router.get('/summary', (req, res) => {
    try {
        const summary = db.dashboard.getSummary();
        const toolStats = db.dashboard.getToolStats();
        const recentActivity = db.activityLog.getAll(10);

        res.json({
            ...summary,
            tool_stats: toolStats,
            recent_activity: recentActivity
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
