#!/usr/bin/env node
const http = require('http');
const API_HOST = 'localhost';
const API_PORT = 3001;

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

    const toolName = payload.tool_name || process.env.CLAUDE_TOOL_NAME || 'unknown';
    const toolInput = payload.tool_input || {};
    const toolResponse = payload.tool_response || {};
    const projectPath = process.env.CLAUDE_WORKING_DIRECTORY || process.cwd();

    const hourKey = new Date().toISOString().slice(0, 13).replace(/[-T:]/g, '');
    const pathKey = projectPath.replace(/[^a-zA-Z0-9]/g, '_').slice(-50);
    const sessionId = payload.session_id || payload.conversation_id ||
                      process.env.CLAUDE_SESSION_ID || ('session_' + pathKey + '_' + hourKey);

    const eventData = {
        event_type: 'tool_use',
        project_path: projectPath,
        session_id: sessionId,
        payload: {
            tool_name: toolName,
            tool_input: JSON.stringify(toolInput).substring(0, 500),
            success: !toolResponse.error && !toolResponse.is_error
        }
    };

    if (['Write', 'NotebookEdit'].includes(toolName) && (toolInput.file_path || toolInput.notebook_path)) {
        eventData.payload.file_change = { file_path: toolInput.file_path || toolInput.notebook_path, change_type: 'created' };
    } else if (['Edit'].includes(toolName) && toolInput.file_path) {
        eventData.payload.file_change = { file_path: toolInput.file_path, change_type: 'modified' };
    }

    const data = JSON.stringify(eventData);

    return new Promise((resolve) => {
        const req = http.request({
            hostname: API_HOST, port: API_PORT, path: '/api/hooks/event', method: 'POST',
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
