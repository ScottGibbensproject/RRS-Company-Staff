/**
 * Tasks API Routes
 */

const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/tasks - Get all tasks with optional filters
router.get('/', (req, res) => {
    try {
        const filters = {
            project_id: req.query.project_id,
            status: req.query.status,
            priority: req.query.priority,
            limit: req.query.limit ? parseInt(req.query.limit) : null
        };

        const tasks = db.tasks.getAll(filters);
        const stats = db.tasks.getStats();

        res.json({ tasks, stats });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/tasks/stats - Get task statistics
router.get('/stats', (req, res) => {
    try {
        const stats = db.tasks.getStats();
        res.json(stats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/tasks/:id - Get single task
router.get('/:id', (req, res) => {
    try {
        const task = db.tasks.getById(req.params.id);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json(task);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/tasks - Create new task
router.post('/', (req, res) => {
    try {
        const { title, description, project_id, priority, due_date, reminder_id } = req.body;

        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        const task = db.tasks.create({
            title,
            description,
            project_id,
            priority,
            due_date,
            reminder_id
        });

        // Log activity if associated with a project
        if (task.project_id) {
            db.activityLog.log({
                project_id: task.project_id,
                activity_type: 'task_added',
                title: 'Task added',
                description: task.title
            });
        }

        res.status(201).json(task);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/tasks/:id - Update task
router.put('/:id', (req, res) => {
    try {
        const existing = db.tasks.getById(req.params.id);
        if (!existing) {
            return res.status(404).json({ error: 'Task not found' });
        }

        const task = db.tasks.update(req.params.id, req.body);

        // Log completion if status changed to completed
        if (req.body.status === 'completed' && existing.status !== 'completed' && task.project_id) {
            db.activityLog.log({
                project_id: task.project_id,
                activity_type: 'task_completed',
                title: 'Task completed',
                description: task.title
            });
        }

        res.json(task);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/tasks/:id - Delete task
router.delete('/:id', (req, res) => {
    try {
        const task = db.tasks.getById(req.params.id);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        db.tasks.delete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/tasks/:id/complete - Quick complete a task
router.post('/:id/complete', (req, res) => {
    try {
        const existing = db.tasks.getById(req.params.id);
        if (!existing) {
            return res.status(404).json({ error: 'Task not found' });
        }

        const task = db.tasks.update(req.params.id, { status: 'completed' });

        if (task.project_id) {
            db.activityLog.log({
                project_id: task.project_id,
                activity_type: 'task_completed',
                title: 'Task completed',
                description: task.title
            });
        }

        res.json(task);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
