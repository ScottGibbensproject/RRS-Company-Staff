/**
 * Projects API Routes
 */

const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/projects - List all projects
router.get('/', (req, res) => {
    try {
        const projects = db.projects.getAll();
        res.json({ projects });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/projects/lookup?path= - Find project by path
router.get('/lookup', (req, res) => {
    try {
        const { path } = req.query;
        if (!path) {
            return res.status(400).json({ error: 'Path is required' });
        }
        const project = db.projects.getByPath(path);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.json({ project });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/projects/:id - Get project details
router.get('/:id', (req, res) => {
    try {
        const project = db.projects.getById(req.params.id);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.json({ project });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/projects - Create project
router.post('/', (req, res) => {
    try {
        const { name, path, description, github_url, hosting_url, hosting_provider, color } = req.body;

        if (!name || !path) {
            return res.status(400).json({ error: 'Name and path are required' });
        }

        // Check if project already exists
        const existing = db.projects.getByPath(path);
        if (existing) {
            return res.status(409).json({ error: 'Project with this path already exists', project: existing });
        }

        const project = db.projects.create({
            name,
            path,
            description,
            github_url,
            hosting_url,
            hosting_provider,
            color
        });

        // Log activity
        db.activityLog.log({
            project_id: project.id,
            activity_type: 'project_registered',
            title: `Project "${name}" registered`,
            description: `Path: ${path}`
        });

        res.status(201).json({ project });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/projects/:id - Update project
router.put('/:id', (req, res) => {
    try {
        const project = db.projects.getById(req.params.id);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const updated = db.projects.update(req.params.id, req.body);
        res.json({ project: updated });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/projects/:id - Delete/archive project
router.delete('/:id', (req, res) => {
    try {
        const project = db.projects.getById(req.params.id);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // Archive instead of delete
        db.projects.update(req.params.id, { status: 'archived' });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/projects/:id/sessions - Get project sessions
router.get('/:id/sessions', (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 20;
        const sessions = db.sessions.getAll(limit, req.params.id);
        res.json({ sessions });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/projects/:id/tools - Get project tool usage
router.get('/:id/tools', (req, res) => {
    try {
        const tools = db.toolUsage.getByProject(req.params.id);
        res.json({ tools });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/projects/:id/files - Get project file changes
router.get('/:id/files', (req, res) => {
    try {
        const files = db.fileChanges.getByProject(req.params.id);
        const stats = db.fileChanges.getStatsByProject(req.params.id);
        res.json({ files, stats });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
