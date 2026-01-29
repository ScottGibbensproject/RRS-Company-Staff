# Project Tracker - AI Agent Context

## Project Summary
A Node.js/Express dashboard for tracking Claude Code development sessions across multiple projects. Uses SQLite for data persistence and provides a web UI for project management, task tracking, and activity monitoring.

## Purpose
- Track time spent in Claude Code sessions per project
- Manage tasks with priorities and due dates
- Log activity timeline (session starts/ends, tool usage, file changes)
- Store project notes and decisions
- Integrate with Claude Code via hooks for automatic session tracking

## File Structure
```
project-tracker/
├── server/
│   ├── index.js              # Express server entry (port 3001)
│   ├── db.js                 # Database helpers & queries
│   └── routes/
│       ├── projects.js       # Project CRUD endpoints
│       ├── sessions.js       # Session tracking
│       ├── tasks.js          # Task management
│       ├── notes.js          # Project notes
│       ├── activity.js       # Activity timeline
│       ├── dashboard.js      # Summary statistics
│       └── hooks.js          # Claude Code hook events
├── public/
│   ├── index.html            # Main dashboard page
│   ├── project.html          # Project detail page
│   ├── css/styles.css        # Styling
│   └── js/
│       ├── app.js            # Dashboard logic
│       └── project.js        # Project page logic
├── database/
│   ├── schema.sql            # Database schema
│   └── tracker.db            # SQLite database file
├── scripts/
│   ├── init-db.js            # Initialize database
│   ├── setup-hooks.js        # Configure Claude Code hooks
│   └── create-startup.ps1    # Windows startup script
├── package.json
└── .env                      # Environment variables
```

## Database Schema

### projects
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| name | TEXT | Display name |
| path | TEXT | Project folder path (unique) |
| description | TEXT | Optional description |
| github_url | TEXT | GitHub repository URL |
| hosting_url | TEXT | Live site URL |
| hosting_provider | TEXT | netlify, vercel, firebase, etc. |
| status | TEXT | active, archived, paused |
| color | TEXT | Hex color for UI |
| created_at, updated_at | DATETIME | Timestamps |

### sessions
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| project_id | INTEGER | FK to projects |
| session_id | TEXT | Claude Code session UUID |
| started_at | DATETIME | Session start time |
| ended_at | DATETIME | Session end time |
| duration_seconds | INTEGER | Calculated duration |
| summary | TEXT | Session summary |
| status | TEXT | active, completed, interrupted |
| model_used | TEXT | Claude model used |

### tasks
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| project_id | INTEGER | FK to projects (optional) |
| title | TEXT | Task title |
| description | TEXT | Task details |
| status | TEXT | pending, in_progress, completed, cancelled |
| priority | TEXT | low, medium, high, urgent |
| due_date | DATE | Due date |
| completed_at | DATETIME | Completion timestamp |
| reminder_id | TEXT | External reminder ID |

### notes
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| project_id | INTEGER | FK to projects |
| session_id | INTEGER | FK to sessions (optional) |
| title | TEXT | Note title |
| content | TEXT | Note content |
| note_type | TEXT | general, todo, issue, milestone, decision |

### activity_log
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| project_id | INTEGER | FK to projects |
| session_id | INTEGER | FK to sessions (optional) |
| activity_type | TEXT | session_start, session_end, tool_use, file_change, note_added, project_registered, status_change, task_added, task_completed, task_updated |
| title | TEXT | Activity title |
| description | TEXT | Activity details |
| metadata | TEXT | JSON metadata |

### tool_usage
Tracks individual tool invocations within sessions.

### file_changes
Tracks files created, modified, or deleted during sessions.

## API Endpoints

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | List all projects |
| GET | `/api/projects/:id` | Get project by ID |
| POST | `/api/projects` | Create project |
| PUT | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | List tasks (filters: status, project_id, priority) |
| GET | `/api/tasks/:id` | Get task by ID |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |

### Sessions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sessions` | List sessions |
| GET | `/api/sessions/:id` | Get session with tool usage |
| POST | `/api/sessions` | Start session |
| PUT | `/api/sessions/:id/end` | End session |

### Other
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/activity` | Activity timeline |
| GET | `/api/dashboard/summary` | Dashboard stats |
| POST | `/api/hooks/event` | Claude Code hook events |
| GET/POST | `/api/notes` | Project notes |

## Tech Stack
| Component | Technology |
|-----------|------------|
| Runtime | Node.js 22+ |
| Framework | Express 4.x |
| Database | SQLite via better-sqlite3 |
| Frontend | Vanilla HTML/CSS/JS |
| Port | 3001 (configurable via .env) |

## Environment Variables (.env)
```
PORT=3001
HOST=localhost
DB_PATH=./database/tracker.db
```

## Common Tasks

### Start the server
```bash
npm start          # Production
npm run dev        # Development with auto-reload
```

### Initialize/reset database
```bash
npm run init-db
```

### Setup Claude Code hooks
```bash
npm run setup-hooks
```

### Add a new API endpoint
1. Create or edit route file in `server/routes/`
2. Add database helpers in `server/db.js` if needed
3. Register route in `server/index.js`

### Add a new database table
1. Add CREATE TABLE statement to `database/schema.sql`
2. Add helpers in `server/db.js`
3. Re-run `npm run init-db` (or manually add to existing DB)

### Modify the dashboard UI
1. Edit `public/index.html` for structure
2. Edit `public/css/styles.css` for styling
3. Edit `public/js/app.js` for behavior

## Claude Code Hooks Integration
The `/api/hooks/event` endpoint receives events from Claude Code hooks:
- `session_start` - When a Claude Code session begins
- `session_end` - When a session ends
- `tool_use` - When Claude uses a tool
- `file_change` - When files are created/modified/deleted

Hook configuration is stored in `.claude/settings.json` per project.

## Important Notes
- Database uses SQLite - no external database server needed
- All timestamps stored in UTC
- Foreign keys enabled for data integrity
- Auto-refresh every 30 seconds on dashboard
- Project paths normalized to forward slashes for cross-platform compatibility
