# RRS Dashboard Platform - Project Plan

## Overview

A private web dashboard consolidating communications and CRM data from multiple sources into a single view, accessible from any device (including iPad) via Tailscale.

---

## Tech Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| Backend | Node.js + Express | API server, integrations |
| Frontend | HTML/CSS/JS (Vanilla or Alpine.js) | Responsive UI |
| Auth | Express sessions + bcrypt | Password protection |
| Deployment | Windows Service or PM2 | Keep running on your PC |
| Remote Access | Tailscale | Private secure access anywhere |

---

## Integrations

### 1. GoHighLevel (GHL)
- **API Docs:** https://highlevel.stoplight.io/
- **What we'll pull:**
  - Contacts/Leads
  - Conversations (SMS, email threads)
  - Opportunities/Pipeline
  - Tasks
- **Auth:** API Key (from Settings > Business Profile)

### 2. Vonage Business
- **API Docs:** https://developer.vonage.com/
- **What we'll pull:**
  - Call logs (inbound/outbound)
  - SMS history
  - Voicemails
- **Auth:** API Key + Secret (from Vonage Dashboard)

### 3. Microsoft Outlook
- **Method:** Microsoft Graph API
- **What we'll pull:**
  - Inbox emails (unread count, recent messages)
  - Calendar events (optional)
  - Flagged/important items
- **Auth:** OAuth 2.0 (Azure App Registration required)

### 4. Trello
- **API Docs:** https://developer.atlassian.com/cloud/trello/rest/
- **What we'll pull:**
  - Boards overview
  - Cards (tasks) with due dates
  - Cards assigned to you
  - Overdue items
  - Recent activity
- **Auth:** API Key + Token (from trello.com/power-ups/admin)

### 5. Userback
- **API Docs:** https://docs.userback.io/reference/overview
- **What we'll pull:**
  - New feedback submissions
  - Bug reports with screenshots
  - Unresolved items count
  - Recent activity
- **Auth:** API Token (from Userback Dashboard)

### 6. Google Cloud (App Engine)
- **API Docs:** https://cloud.google.com/monitoring/api/v3
- **What we'll pull:**
  - Memory usage (%)
  - CPU utilization
  - Instance count
  - Request latency
  - Error rate
- **Auth:** Service Account JSON key (from GCP Console)

---

## Dashboard Layout (Mobile-First)

```
┌─────────────────────────────────────────────────────────┐
│  RRS Dashboard                        [Refresh] [Logout]│
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐│
│  │ EMAILS  │ │ CALLS   │ │ LEADS   │ │ TASKS   │ │FEEDBACK │ │ CLOUD   ││
│  │12 unread│ │5 missed │ │ 8 new   │ │ 3 due   │ │ 2 new   │ │ 72% mem ││
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘│
│                                                         │
├─────────────────────────────────────────────────────────┤
│  PRIORITY INBOX                                         │
├─────────────────────────────────────────────────────────┤
│  ★ Email - John Smith - "Contract Review" - 10m ago    │
│  ★ Call - Missed - (555) 123-4567 - 25m ago            │
│  ★ Task - "Follow up with client" - Due today          │
│  ★ GHL - New Lead - ABC Auto Shop - 1h ago             │
│  ○ Email - Newsletter - "Weekly Update" - 2h ago       │
│  ○ SMS - Mike R - "Thanks for the info" - 3h ago       │
└─────────────────────────────────────────────────────────┘
```

---

## Project Structure

```
rrs-dashboard/
├── server/
│   ├── index.js           # Express server entry
│   ├── auth.js            # Login/session handling
│   ├── routes/
│   │   ├── api.js         # Main API routes
│   │   ├── outlook.js     # Outlook integration
│   │   ├── vonage.js      # Vonage integration
│   │   ├── ghl.js         # GoHighLevel integration
│   │   ├── trello.js      # Trello integration
│   │   ├── userback.js    # Userback integration
│   │   └── gcloud.js      # Google Cloud monitoring
│   └── config.js          # API keys (from .env)
├── public/
│   ├── index.html         # Dashboard page
│   ├── login.html         # Login page
│   ├── css/
│   │   └── styles.css     # Responsive styles
│   └── js/
│       └── app.js         # Frontend logic
├── .env                   # API keys (not committed)
├── .env.example           # Template for .env
├── package.json
└── README.md
```

---

## Implementation Phases

### Phase 1: Foundation
- [ ] Initialize Node.js project
- [ ] Set up Express server with static file serving
- [ ] Create login page with password auth
- [ ] Build basic dashboard HTML/CSS layout
- [ ] Test locally

### Phase 2: Outlook Integration
- [ ] Register Azure App for Microsoft Graph
- [ ] Implement OAuth flow
- [ ] Fetch inbox emails
- [ ] Display unread count + recent emails

### Phase 3: GoHighLevel Integration
- [ ] Get GHL API key
- [ ] Fetch contacts/leads
- [ ] Fetch conversations
- [ ] Display in dashboard

### Phase 4: Vonage Integration
- [ ] Get Vonage API credentials
- [ ] Fetch call logs
- [ ] Fetch SMS history
- [ ] Display in dashboard

### Phase 5: Trello Integration
- [ ] Get Trello API key + token
- [ ] Fetch boards and cards
- [ ] Show due/overdue tasks
- [ ] Display in dashboard

### Phase 6: Userback Integration
- [ ] Get Userback API token
- [ ] Fetch feedback submissions
- [ ] Show unresolved count
- [ ] Display in dashboard

### Phase 7: Google Cloud Monitoring
- [ ] Create GCP service account
- [ ] Download JSON key
- [ ] Fetch App Engine metrics (memory, CPU)
- [ ] Display with visual gauges

### Phase 8: Priority & Polish
- [ ] Combine all sources into unified "Priority Inbox"
- [ ] Add sorting/filtering
- [ ] Auto-refresh functionality
- [ ] Mobile/iPad responsive testing

### Phase 9: Deployment
- [ ] Install Tailscale on PC
- [ ] Configure server to run on startup (PM2)
- [ ] Install Tailscale on iPad
- [ ] Test remote access

---

## API Credentials Needed

Before we build, you'll need to gather:

### GoHighLevel
1. Log into GHL
2. Settings > Business Profile > API Key
3. Copy the API key

### Vonage Business
1. Log into developer.vonage.com
2. Create application or get existing API credentials
3. Copy API Key and API Secret

### Microsoft Outlook (Azure)
1. Go to portal.azure.com
2. Register a new App
3. Add Microsoft Graph permissions (Mail.Read)
4. Create client secret
5. Copy: Application ID, Tenant ID, Client Secret

### Trello
1. Go to trello.com/power-ups/admin
2. Create a new Power-Up (or use existing)
3. Generate API Key
4. Click "Token" link to generate user token
5. Copy: API Key and Token

### Userback
1. Log into Userback Dashboard
2. Go to Settings > Integrations or API
3. Generate API Token
4. Copy the token

### Google Cloud (App Engine)
1. Go to console.cloud.google.com
2. IAM & Admin > Service Accounts
3. Create service account with "Monitoring Viewer" role
4. Create key (JSON format)
5. Download the JSON file (keep secure!)

---

## Security Notes

- All API keys stored in `.env` file (never committed to git)
- Password-protected login required
- Tailscale = private network (not exposed to public internet)
- HTTPS handled by Tailscale automatically

---

## Next Steps

1. Confirm this plan looks good
2. Gather API credentials (list above)
3. I'll scaffold Phase 1 (foundation + login)
4. We iterate from there

---

*Plan created: December 23, 2025*
