#!/usr/bin/env node
const http = require('http');

async function main() {
    let input = '';
    process.stdin.setEncoding('utf8');
    await new Promise((resolve) => {
        process.stdin.on('readable', () => {
            let chunk;
            while ((chunk = process.stdin.read()) !== null) input += chunk;
        });
        process.stdin.on('end', resolve);
        setTimeout(resolve, 1000);
    });

    let payload = {};
    try { if (input.trim()) payload = JSON.parse(input); } catch (e) {}

    const projectPath = process.env.CLAUDE_WORKING_DIRECTORY || process.cwd();
    const hourKey = new Date().toISOString().slice(0, 13).replace(/[-T:]/g, '');
    const pathKey = projectPath.replace(/[^a-zA-Z0-9]/g, '_').slice(-50);
    const sessionId = payload.session_id || payload.conversation_id ||
                      process.env.CLAUDE_SESSION_ID || ('session_' + pathKey + '_' + hourKey);

    const summary = payload.transcript_summary || payload.summary ||
                    (payload.last_assistant_message ? payload.last_assistant_message.substring(0, 500) : 'Session completed');

    const data = JSON.stringify({
        event_type: 'session_end',
        project_path: projectPath,
        session_id: sessionId,
        payload: { summary: summary, stop_reason: payload.stop_reason || 'completed', ended_at: new Date().toISOString() }
    });

    return new Promise((resolve) => {
        const req = http.request({
            hostname: 'localhost', port: 3001, path: '/api/hooks/event', method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) },
            timeout: 2000
        }, () => resolve());
        req.on('error', () => resolve());
        req.on('timeout', () => { req.destroy(); resolve(); });
        req.write(data);
        req.end();
    });
}

main().then(() => process.exit(0)).catch(() => process.exit(0));
