/**
 * Notes API Routes
 */

const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/notes - List notes
router.get('/', (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 50;
        const projectId = req.query.project_id || null;
        const type = req.query.type || null;
        const notes = db.notes.getAll(projectId, type, limit);
        res.json({ notes });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/notes/:id - Get note details
router.get('/:id', (req, res) => {
    try {
        const note = db.notes.getById(req.params.id);
        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }
        res.json({ note });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/notes - Create note
router.post('/', (req, res) => {
    try {
        const { project_id, session_id, title, content, note_type } = req.body;

        if (!project_id || !content) {
            return res.status(400).json({ error: 'project_id and content are required' });
        }

        const note = db.notes.create({
            project_id,
            session_id,
            title,
            content,
            note_type
        });

        // Log activity
        db.activityLog.log({
            project_id,
            session_id,
            activity_type: 'note_added',
            title: title || 'Note added',
            description: content.substring(0, 100)
        });

        res.status(201).json({ note });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/notes/:id - Update note
router.put('/:id', (req, res) => {
    try {
        const note = db.notes.getById(req.params.id);
        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }

        const updated = db.notes.update(req.params.id, req.body);
        res.json({ note: updated });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/notes/:id - Delete note
router.delete('/:id', (req, res) => {
    try {
        const note = db.notes.getById(req.params.id);
        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }

        db.notes.delete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
