const express = require('express');
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Monitored email accounts
const MONITORED_EMAILS = (process.env.GMAIL_MONITORED_EMAILS || '')
  .split(',')
  .map(email => email.trim().toLowerCase())
  .filter(email => email);

// Token storage path
const TOKEN_PATH = path.join(__dirname, '../../gmail-tokens.json');
const CREDENTIALS_PATH = path.join(__dirname, '../../gmail-credentials.json');

// OAuth2 client
let oauth2Client = null;

// Initialize OAuth2 client
function getOAuth2Client() {
  if (oauth2Client) return oauth2Client;

  const clientId = process.env.GMAIL_CLIENT_ID;
  const clientSecret = process.env.GMAIL_CLIENT_SECRET;
  const redirectUri = process.env.GMAIL_REDIRECT_URI || 'http://localhost:3000/api/gmail/callback';

  if (!clientId || !clientSecret) {
    // Try to load from credentials file
    if (fs.existsSync(CREDENTIALS_PATH)) {
      const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
      const { client_id, client_secret, redirect_uris } = credentials.installed || credentials.web;
      oauth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    } else {
      throw new Error('Gmail credentials not configured');
    }
  } else {
    oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
  }

  // Load saved tokens if they exist
  if (fs.existsSync(TOKEN_PATH)) {
    const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH));
    oauth2Client.setCredentials(tokens);
  }

  return oauth2Client;
}

// Check if authenticated
function isAuthenticated() {
  try {
    const client = getOAuth2Client();
    return !!client.credentials.access_token;
  } catch {
    return false;
  }
}

// Get Gmail service for a specific user
function getGmailService(userEmail = 'me') {
  const auth = getOAuth2Client();
  return google.gmail({ version: 'v1', auth });
}

// Start OAuth flow
router.get('/auth', (req, res) => {
  try {
    const client = getOAuth2Client();
    const authUrl = client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/gmail.readonly',
        'https://www.googleapis.com/auth/gmail.labels'
      ],
      prompt: 'consent'
    });
    res.redirect(authUrl);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// OAuth callback
router.get('/callback', async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send('No authorization code provided');
  }

  try {
    const client = getOAuth2Client();
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    // Save tokens for future use
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));

    res.send(`
      <html>
        <body style="font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; background: #0f172a; color: white;">
          <div style="text-align: center;">
            <h1>✓ Gmail Connected!</h1>
            <p>You can close this window and return to the dashboard.</p>
            <script>setTimeout(() => window.close(), 2000);</script>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send(`Authentication failed: ${error.message}`);
  }
});

// Get unread count
async function getUnreadCount(gmail) {
  try {
    const res = await gmail.users.labels.get({
      userId: 'me',
      id: 'INBOX'
    });
    return res.data.messagesUnread || 0;
  } catch (error) {
    console.error('Failed to get unread count:', error.message);
    return 0;
  }
}

// Get recent emails
async function getRecentEmails(gmail, maxResults = 20) {
  try {
    const res = await gmail.users.messages.list({
      userId: 'me',
      maxResults,
      q: 'is:unread'
    });

    if (!res.data.messages) return [];

    const emails = await Promise.all(
      res.data.messages.slice(0, maxResults).map(async (msg) => {
        const detail = await gmail.users.messages.get({
          userId: 'me',
          id: msg.id,
          format: 'metadata',
          metadataHeaders: ['From', 'Subject', 'Date']
        });

        const headers = detail.data.payload.headers;
        const getHeader = (name) => headers.find(h => h.name === name)?.value || '';

        return {
          id: msg.id,
          from: getHeader('From'),
          subject: getHeader('Subject'),
          date: getHeader('Date'),
          snippet: detail.data.snippet,
          labelIds: detail.data.labelIds
        };
      })
    );

    return emails;
  } catch (error) {
    console.error('Failed to get emails:', error.message);
    return [];
  }
}

// Summary endpoint
router.get('/summary', async (req, res) => {
  if (!isAuthenticated()) {
    return res.json({
      unread: 0,
      status: 'pending',
      authUrl: '/api/gmail/auth',
      message: 'Click to connect Gmail'
    });
  }

  try {
    const gmail = getGmailService();
    // Get actual unread message count from list
    const listRes = await gmail.users.messages.list({
      userId: 'me',
      q: 'is:unread',
      maxResults: 100
    });
    const unread = listRes.data.resultSizeEstimate || (listRes.data.messages?.length || 0);

    res.json({
      unread,
      status: 'connected',
      accounts: MONITORED_EMAILS.length || 1
    });
  } catch (error) {
    console.error('Gmail summary error:', error.message);

    // If token expired, prompt re-auth
    if (error.message.includes('invalid_grant') || error.message.includes('Token')) {
      if (fs.existsSync(TOKEN_PATH)) {
        fs.unlinkSync(TOKEN_PATH);
      }
      return res.json({
        unread: 0,
        status: 'pending',
        authUrl: '/api/gmail/auth',
        message: 'Session expired - click to reconnect'
      });
    }

    res.json({
      unread: 0,
      status: 'error',
      error: error.message
    });
  }
});

// Get emails endpoint
router.get('/emails', async (req, res) => {
  if (!isAuthenticated()) {
    return res.json([]);
  }

  try {
    const gmail = getGmailService();
    const emails = await getRecentEmails(gmail);

    // Format for dashboard
    const formatted = emails.map(email => {
      // Parse "From" header - could be "Name <email>" or just "email"
      let fromName = email.from;
      const match = email.from.match(/^(.+?)\s*<(.+)>$/);
      if (match) {
        fromName = match[1].replace(/"/g, '');
      }

      // Handle date parsing safely
      let emailTime;
      try {
        emailTime = email.date ? new Date(email.date).toISOString() : new Date().toISOString();
      } catch {
        emailTime = new Date().toISOString();
      }

      return {
        id: email.id,
        type: 'email',
        icon: '📧',
        title: fromName,
        subtitle: email.subject || '(No subject)',
        preview: email.snippet,
        time: emailTime,
        priority: email.labelIds?.includes('IMPORTANT'),
        source: 'gmail',
        isRead: !email.labelIds?.includes('UNREAD')
      };
    });

    res.json(formatted);
  } catch (error) {
    console.error('Gmail emails error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Status endpoint
router.get('/status', (req, res) => {
  const hasCredentials = !!(
    (process.env.GMAIL_CLIENT_ID && process.env.GMAIL_CLIENT_SECRET) ||
    fs.existsSync(CREDENTIALS_PATH)
  );

  if (!hasCredentials) {
    return res.json({
      status: 'not_configured',
      message: 'Gmail credentials not found'
    });
  }

  if (!isAuthenticated()) {
    return res.json({
      status: 'pending',
      authUrl: '/api/gmail/auth',
      message: 'Click to connect Gmail'
    });
  }

  res.json({
    status: 'connected',
    accounts: MONITORED_EMAILS
  });
});

// Disconnect endpoint
router.post('/disconnect', (req, res) => {
  if (fs.existsSync(TOKEN_PATH)) {
    fs.unlinkSync(TOKEN_PATH);
  }
  res.json({ success: true });
});

module.exports = router;
