/**
 * Database Connection and Helpers
 */

const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'database', 'tracker.db');

let db = null;

function getDb() {
    if (!db) {
        db = new Database(DB_PATH);
        db.pragma('foreign_keys = ON');
    }
    return db;
}

// Project helpers
const projects = {
    getAll() {
        const db = getDb();
        return db.prepare(`
            SELECT p.*,
                (SELECT COUNT(*) FROM sessions WHERE project_id = p.id) as session_count,
                (SELECT SUM(duration_seconds) FROM sessions WHERE project_id = p.id) as total_seconds,
                (SELECT MAX(started_at) FROM sessions WHERE project_id = p.id) as last_session
            FROM projects p
            ORDER BY p.updated_at DESC
        `).all();
    },

    getById(id) {
        const db = getDb();
        return db.prepare(`
            SELECT p.*,
                (SELECT COUNT(*) FROM sessions WHERE project_id = p.id) as session_count,
                (SELECT SUM(duration_seconds) FROM sessions WHERE project_id = p.id) as total_seconds,
                (SELECT MAX(started_at) FROM sessions WHERE project_id = p.id) as last_session
            FROM projects p
            WHERE p.id = ?
        `).get(id);
    },

    getByPath(projectPath) {
        const db = getDb();
        // Normalize path for comparison
        const normalizedPath = projectPath.replace(/\\/g, '/').replace(/\/$/, '');
        return db.prepare(`
            SELECT * FROM projects
            WHERE REPLACE(REPLACE(path, '\\', '/'), '/$', '') = ?
        `).get(normalizedPath);
    },

    create(data) {
        const db = getDb();
        const stmt = db.prepare(`
            INSERT INTO projects (name, path, description, github_url, hosting_url, hosting_provider, color)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
        const result = stmt.run(
            data.name,
            data.path.replace(/\\/g, '/').replace(/\/$/, ''),
            data.description || null,
            data.github_url || null,
            data.hosting_url || null,
            data.hosting_provider || null,
            data.color || '#3b82f6'
        );
        return this.getById(result.lastInsertRowid);
    },

    update(id, data) {
        const db = getDb();
        const fields = [];
        const values = [];

        if (data.name !== undefined) { fields.push('name = ?'); values.push(data.name); }
        if (data.description !== undefined) { fields.push('description = ?'); values.push(data.description); }
        if (data.github_url !== undefined) { fields.push('github_url = ?'); values.push(data.github_url); }
        if (data.hosting_url !== undefined) { fields.push('hosting_url = ?'); values.push(data.hosting_url); }
        if (data.hosting_provider !== undefined) { fields.push('hosting_provider = ?'); values.push(data.hosting_provider); }
        if (data.status !== undefined) { fields.push('status = ?'); values.push(data.status); }
        if (data.color !== undefined) { fields.push('color = ?'); values.push(data.color); }

        fields.push('updated_at = CURRENT_TIMESTAMP');
        values.push(id);

        db.prepare(`UPDATE projects SET ${fields.join(', ')} WHERE id = ?`).run(...values);
        return this.getById(id);
    },

    delete(id) {
        const db = getDb();
        return db.prepare('DELETE FROM projects WHERE id = ?').run(id);
    }
};

// Session helpers
const sessions = {
    getAll(limit = 50, projectId = null) {
        const db = getDb();
        let query = `
            SELECT s.*, p.name as project_name, p.color as project_color
            FROM sessions s
            JOIN projects p ON s.project_id = p.id
        `;
        const params = [];

        if (projectId) {
            query += ' WHERE s.project_id = ?';
            params.push(projectId);
        }

        query += ' ORDER BY s.started_at DESC LIMIT ?';
        params.push(limit);

        return db.prepare(query).all(...params);
    },

    getById(id) {
        const db = getDb();
        return db.prepare(`
            SELECT s.*, p.name as project_name, p.color as project_color
            FROM sessions s
            JOIN projects p ON s.project_id = p.id
            WHERE s.id = ?
        `).get(id);
    },

    getBySessionId(sessionId) {
        const db = getDb();
        return db.prepare('SELECT * FROM sessions WHERE session_id = ?').get(sessionId);
    },

    create(data) {
        const db = getDb();
        const stmt = db.prepare(`
            INSERT INTO sessions (project_id, session_id, model_used)
            VALUES (?, ?, ?)
        `);
        const result = stmt.run(data.project_id, data.session_id, data.model || null);
        return this.getById(result.lastInsertRowid);
    },

    end(id, data) {
        const db = getDb();
        db.prepare(`
            UPDATE sessions
            SET ended_at = CURRENT_TIMESTAMP,
                duration_seconds = CAST((julianday(CURRENT_TIMESTAMP) - julianday(started_at)) * 86400 AS INTEGER),
                summary = ?,
                status = ?
            WHERE id = ?
        `).run(data.summary || null, data.status || 'completed', id);
        return this.getById(id);
    },

    getToolUsage(sessionId) {
        const db = getDb();
        return db.prepare(`
            SELECT tool_name, COUNT(*) as count,
                   SUM(CASE WHEN success = 1 THEN 1 ELSE 0 END) as success_count
            FROM tool_usage
            WHERE session_id = ?
            GROUP BY tool_name
            ORDER BY count DESC
        `).all(sessionId);
    },

    getFileChanges(sessionId) {
        const db = getDb();
        return db.prepare(`
            SELECT * FROM file_changes
            WHERE session_id = ?
            ORDER BY created_at DESC
        `).all(sessionId);
    }
};

// Tool usage helpers
const toolUsage = {
    log(data) {
        const db = getDb();
        const stmt = db.prepare(`
            INSERT INTO tool_usage (session_id, tool_name, tool_input, success)
            VALUES (?, ?, ?, ?)
        `);
        return stmt.run(data.session_id, data.tool_name, data.tool_input || null, data.success ? 1 : 0);
    },

    getByProject(projectId) {
        const db = getDb();
        return db.prepare(`
            SELECT tu.tool_name, COUNT(*) as count,
                   SUM(CASE WHEN tu.success = 1 THEN 1 ELSE 0 END) as success_count
            FROM tool_usage tu
            JOIN sessions s ON tu.session_id = s.id
            WHERE s.project_id = ?
            GROUP BY tu.tool_name
            ORDER BY count DESC
        `).all(projectId);
    }
};

// File changes helpers
const fileChanges = {
    log(data) {
        const db = getDb();
        const stmt = db.prepare(`
            INSERT INTO file_changes (session_id, file_path, change_type)
            VALUES (?, ?, ?)
        `);
        return stmt.run(data.session_id, data.file_path, data.change_type);
    },

    getByProject(projectId) {
        const db = getDb();
        return db.prepare(`
            SELECT fc.*, s.started_at as session_date
            FROM file_changes fc
            JOIN sessions s ON fc.session_id = s.id
            WHERE s.project_id = ?
            ORDER BY fc.created_at DESC
            LIMIT 100
        `).all(projectId);
    },

    getStatsByProject(projectId) {
        const db = getDb();
        return db.prepare(`
            SELECT change_type, COUNT(*) as count
            FROM file_changes fc
            JOIN sessions s ON fc.session_id = s.id
            WHERE s.project_id = ?
            GROUP BY change_type
        `).all(projectId);
    }
};

// Notes helpers
const notes = {
    getAll(projectId = null, type = null, limit = 50) {
        const db = getDb();
        let query = `
            SELECT n.*, p.name as project_name
            FROM notes n
            JOIN projects p ON n.project_id = p.id
            WHERE 1=1
        `;
        const params = [];

        if (projectId) {
            query += ' AND n.project_id = ?';
            params.push(projectId);
        }
        if (type && type !== 'all') {
            query += ' AND n.note_type = ?';
            params.push(type);
        }

        query += ' ORDER BY n.created_at DESC LIMIT ?';
        params.push(limit);

        return db.prepare(query).all(...params);
    },

    getById(id) {
        const db = getDb();
        return db.prepare('SELECT * FROM notes WHERE id = ?').get(id);
    },

    create(data) {
        const db = getDb();
        const stmt = db.prepare(`
            INSERT INTO notes (project_id, session_id, title, content, note_type)
            VALUES (?, ?, ?, ?, ?)
        `);
        const result = stmt.run(
            data.project_id,
            data.session_id || null,
            data.title || null,
            data.content,
            data.note_type || 'general'
        );
        return this.getById(result.lastInsertRowid);
    },

    update(id, data) {
        const db = getDb();
        const fields = [];
        const values = [];

        if (data.title !== undefined) { fields.push('title = ?'); values.push(data.title); }
        if (data.content !== undefined) { fields.push('content = ?'); values.push(data.content); }
        if (data.note_type !== undefined) { fields.push('note_type = ?'); values.push(data.note_type); }

        fields.push('updated_at = CURRENT_TIMESTAMP');
        values.push(id);

        db.prepare(`UPDATE notes SET ${fields.join(', ')} WHERE id = ?`).run(...values);
        return this.getById(id);
    },

    delete(id) {
        const db = getDb();
        return db.prepare('DELETE FROM notes WHERE id = ?').run(id);
    }
};

// Activity log helpers
const activityLog = {
    log(data) {
        const db = getDb();
        const stmt = db.prepare(`
            INSERT INTO activity_log (project_id, session_id, activity_type, title, description, metadata)
            VALUES (?, ?, ?, ?, ?, ?)
        `);
        return stmt.run(
            data.project_id,
            data.session_id || null,
            data.activity_type,
            data.title,
            data.description || null,
            data.metadata ? JSON.stringify(data.metadata) : null
        );
    },

    getAll(limit = 100, projectId = null, type = null) {
        const db = getDb();
        let query = `
            SELECT a.*, p.name as project_name, p.color as project_color
            FROM activity_log a
            JOIN projects p ON a.project_id = p.id
            WHERE 1=1
        `;
        const params = [];

        if (projectId) {
            query += ' AND a.project_id = ?';
            params.push(projectId);
        }
        if (type) {
            query += ' AND a.activity_type = ?';
            params.push(type);
        }

        query += ' ORDER BY a.created_at DESC LIMIT ?';
        params.push(limit);

        return db.prepare(query).all(...params);
    }
};

// Tasks helpers
const tasks = {
    getAll(filters = {}) {
        const db = getDb();
        let query = `
            SELECT t.*, p.name as project_name, p.color as project_color
            FROM tasks t
            LEFT JOIN projects p ON t.project_id = p.id
            WHERE 1=1
        `;
        const params = [];

        if (filters.project_id) {
            query += ' AND t.project_id = ?';
            params.push(filters.project_id);
        }
        if (filters.status && filters.status !== 'all') {
            query += ' AND t.status = ?';
            params.push(filters.status);
        }
        if (filters.priority) {
            query += ' AND t.priority = ?';
            params.push(filters.priority);
        }

        query += ' ORDER BY CASE t.priority WHEN \'urgent\' THEN 1 WHEN \'high\' THEN 2 WHEN \'medium\' THEN 3 ELSE 4 END, t.due_date ASC NULLS LAST, t.created_at DESC';

        if (filters.limit) {
            query += ' LIMIT ?';
            params.push(filters.limit);
        }

        return db.prepare(query).all(...params);
    },

    getById(id) {
        const db = getDb();
        return db.prepare(`
            SELECT t.*, p.name as project_name, p.color as project_color
            FROM tasks t
            LEFT JOIN projects p ON t.project_id = p.id
            WHERE t.id = ?
        `).get(id);
    },

    create(data) {
        const db = getDb();
        const stmt = db.prepare(`
            INSERT INTO tasks (project_id, title, description, status, priority, due_date, reminder_id)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
        const result = stmt.run(
            data.project_id || null,
            data.title,
            data.description || null,
            data.status || 'pending',
            data.priority || 'medium',
            data.due_date || null,
            data.reminder_id || null
        );
        return this.getById(result.lastInsertRowid);
    },

    update(id, data) {
        const db = getDb();
        const fields = [];
        const values = [];

        if (data.title !== undefined) { fields.push('title = ?'); values.push(data.title); }
        if (data.description !== undefined) { fields.push('description = ?'); values.push(data.description); }
        if (data.status !== undefined) {
            fields.push('status = ?');
            values.push(data.status);
            if (data.status === 'completed') {
                fields.push('completed_at = CURRENT_TIMESTAMP');
            }
        }
        if (data.priority !== undefined) { fields.push('priority = ?'); values.push(data.priority); }
        if (data.due_date !== undefined) { fields.push('due_date = ?'); values.push(data.due_date); }
        if (data.project_id !== undefined) { fields.push('project_id = ?'); values.push(data.project_id); }
        if (data.reminder_id !== undefined) { fields.push('reminder_id = ?'); values.push(data.reminder_id); }

        fields.push('updated_at = CURRENT_TIMESTAMP');
        values.push(id);

        db.prepare(`UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`).run(...values);
        return this.getById(id);
    },

    delete(id) {
        const db = getDb();
        return db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
    },

    getStats() {
        const db = getDb();
        const total = db.prepare('SELECT COUNT(*) as count FROM tasks').get();
        const pending = db.prepare('SELECT COUNT(*) as count FROM tasks WHERE status = ?').get('pending');
        const inProgress = db.prepare('SELECT COUNT(*) as count FROM tasks WHERE status = ?').get('in_progress');
        const completed = db.prepare('SELECT COUNT(*) as count FROM tasks WHERE status = ?').get('completed');
        const overdue = db.prepare(`
            SELECT COUNT(*) as count FROM tasks
            WHERE status NOT IN ('completed', 'cancelled')
            AND due_date < date('now')
        `).get();

        return {
            total: total.count,
            pending: pending.count,
            in_progress: inProgress.count,
            completed: completed.count,
            overdue: overdue.count
        };
    }
};

// Dashboard helpers
const dashboard = {
    getSummary() {
        const db = getDb();

        const projectCount = db.prepare('SELECT COUNT(*) as count FROM projects WHERE status = ?').get('active');
        const activeSessions = db.prepare('SELECT COUNT(*) as count FROM sessions WHERE status = ?').get('active');
        const todaySessions = db.prepare(`
            SELECT COUNT(*) as count FROM sessions
            WHERE date(started_at) = date('now')
        `).get();
        const totalSeconds = db.prepare('SELECT SUM(duration_seconds) as total FROM sessions').get();

        return {
            projects_count: projectCount.count,
            active_sessions: activeSessions.count,
            today_sessions: todaySessions.count,
            total_seconds: totalSeconds.total || 0
        };
    },

    getToolStats() {
        const db = getDb();
        return db.prepare(`
            SELECT tool_name, COUNT(*) as count
            FROM tool_usage
            GROUP BY tool_name
            ORDER BY count DESC
            LIMIT 10
        `).all();
    }
};

module.exports = {
    getDb,
    projects,
    sessions,
    toolUsage,
    fileChanges,
    notes,
    activityLog,
    tasks,
    dashboard
};
