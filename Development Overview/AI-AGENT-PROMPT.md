# Development Overview - AI Agent Context

## Project Summary
This is a static website for displaying software development updates, hosted on Netlify. It serves as a public-facing "Development Overview" page for Rate Remover Software that can be embedded on the company website.

## Purpose
- Display changelog entries (dated software updates)
- Show features currently in development ("In Progress")
- Announce planned features ("Upcoming Features")
- Professional SaaS-style presentation with tabbed interface

## File Structure
```
changelog/
├── index.html      # Public-facing page (deploy this)
├── admin.html      # Local admin tool for adding entries (NOT deployed)
├── data.json       # All content data (must be updated before deploy)
├── styles.css      # Styling with dark mode support
├── app.js          # Shared rendering functions
└── AI-AGENT-PROMPT.md  # This file
```

## Data Structure (data.json)
```json
{
  "changelog": [
    {
      "id": "unique-id",
      "date": "YYYY-MM-DD",
      "title": "Update Title",
      "description": "What changed..."
    }
  ],
  "inProgress": [
    {
      "id": "unique-id",
      "title": "Feature Title",
      "description": "What's being built..."
    }
  ],
  "upcoming": [
    {
      "id": "unique-id",
      "title": "Feature Title",
      "description": "What's planned..."
    }
  ]
}
```

**Key differences:**
- `changelog` entries have a `date` field
- `inProgress` and `upcoming` entries do NOT have dates

## User Workflow
1. User opens `admin.html` locally in browser
2. User adds/edits entries using the form interface
3. User copies exported JSON from admin page
4. User pastes JSON into `data.json`
5. User drags `changelog` folder to Netlify to deploy

## Tech Stack
- Pure HTML/CSS/JavaScript (no build tools)
- No backend - static files only
- localStorage used in admin.html for local state
- Hosted on Netlify via drag-and-drop deploy

## Styling Notes
- Uses CSS custom properties for theming
- Automatic dark mode via `prefers-color-scheme`
- Mobile responsive
- Accent color: `#2563eb` (blue)
- Font: System font stack

## Common Tasks

### Adding a new entry type/section
1. Add new array to data.json structure
2. Add new tab button in both index.html and admin.html
3. Add rendering logic in the JavaScript sections
4. Add any new CSS styles needed

### Changing the accent color
Edit `--color-accent` in styles.css (both light and dark mode sections)

### Modifying the layout
- Tabs are in `.tabs` container
- Content sections use `.tab-content` class
- Changelog uses `.timeline` with `.update-entry` items
- In Progress/Upcoming use `.feature-card` items

## Embedding
The page can be embedded via iframe:
```html
<iframe src="https://[netlify-url].netlify.app" width="100%" height="600" frameborder="0"></iframe>
```

## Related Documentation
See `RRS-Knowledge-Base.md` in the parent folder, Section 13, for deployment instructions.

## Important Notes
- `admin.html` is a local tool only - it should work when opened directly in a browser
- The admin page stores data in localStorage (browser-specific, not shared)
- Always export JSON from admin and paste into `data.json` before deploying
- IDs are generated using `Date.now().toString()` for uniqueness
