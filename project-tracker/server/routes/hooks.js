/**
 * Hook Events API
 * Receives events from Claude Code hooks
 */

const express = require('express');
const router = express.Router();
const path = require('path');
const db = require('../db');

// POST /api/hooks/event - Unified event receiver
router.post('/event', (req, res) => {
    try {
        const { event_type, project_path, session_id, payload } = req.body;

        if (!event_type || !project_path) {
            return res.status(400).json({ error: 'event_type and project_path are required' });
        }

        // Normalize path
        const normalizedPath = project_path.replace(/\\/g, '/').replace(/\/$/, '');

        // Find or create project
        let project = db.projects.getByPath(normalizedPath);
        if (!project) {
            // Auto-register project
            const projectName = path.basename(normalizedPath);
            project = db.projects.create({
                name: projectName,
                path: normalizedPath
            });
            console.log(`Auto-registered project: ${projectName}`);

            db.activityLog.log({
                project_id: project.id,
                activity_type: 'project_registered',
                title: `Project "${projectName}" auto-registered`,
                description: `Path: ${normalizedPath}`
            });
        }

        // Handle event types
        switch (event_type) {
            case 'session_start':
                return handleSessionStart(res, project, session_id, payload);

            case 'session_end':
                return handleSessionEnd(res, project, session_id, payload);

            case 'tool_use':
                return handleToolUse(res, project, session_id, payload);

            default:
                return res.status(400).json({ error: `Unknown event type: ${event_type}` });
        }
    } catch (err) {
        console.error('Hook error:', err.message);
        // Always return success to not block Claude
        res.json({ success: false, error: err.message });
    }
});

function handleSessionStart(res, project, sessionId, payload) {
    // Check if session already exists
    let session = db.sessions.getBySessionId(sessionId);
    if (session) {
        return res.json({ success: true, session });
    }

    // Create new session
    session = db.sessions.create({
        project_id: project.id,
        session_id: sessionId,
        model: payload?.model
    });

    // Log activity
    db.activityLog.log({
        project_id: project.id,
        session_id: session.id,
        activity_type: 'session_start',
        title: 'Session started',
        description: `Started working on ${project.name}`
    });

    // Update project timestamp
    db.projects.update(project.id, {});

    console.log(`Session started: ${project.name} (${sessionId})`);
    res.json({ success: true, session });
}

function handleSessionEnd(res, project, sessionId, payload) {
    const session = db.sessions.getBySessionId(sessionId);
    if (!session) {
        return res.json({ success: false, error: 'Session not found' });
    }

    // End the session
    const updated = db.sessions.end(session.id, {
        summary: payload?.summary,
        status: payload?.stop_reason === 'interrupted' ? 'interrupted' : 'completed'
    });

    // Log activity
    db.activityLog.log({
        project_id: project.id,
        session_id: session.id,
        activity_type: 'session_end',
        title: 'Session ended',
        description: payload?.summary || `Completed work on ${project.name}`,
        metadata: { duration_seconds: updated.duration_seconds }
    });

    console.log(`Session ended: ${project.name} (${updated.duration_seconds}s)`);
    res.json({ success: true, session: updated });
}

function handleToolUse(res, project, sessionId, payload) {
    let session = db.sessions.getBySessionId(sessionId);

    // Auto-create session if it doesn't exist
    if (!session) {
        session = db.sessions.create({
            project_id: project.id,
            session_id: sessionId,
            model: 'unknown'
        });
        console.log(`Auto-created session for tool use: ${sessionId}`);
    }

    // Log tool usage
    db.toolUsage.log({
        session_id: session.id,
        tool_name: payload?.tool_name || 'unknown',
        tool_input: payload?.tool_input,
        success: payload?.success !== false
    });

    // Handle file changes if present
    if (payload?.file_change) {
        db.fileChanges.log({
            session_id: session.id,
            file_path: payload.file_change.file_path,
            change_type: payload.file_change.change_type
        });

        db.activityLog.log({
            project_id: project.id,
            session_id: session.id,
            activity_type: 'file_change',
            title: `File ${payload.file_change.change_type}`,
            description: payload.file_change.file_path
        });
    }

    res.json({ success: true });
}

module.exports = router;
