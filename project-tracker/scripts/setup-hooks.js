#!/usr/bin/env node
/**
 * Claude Code Hooks Setup Script
 * Installs hooks to track sessions automatically
 *
 * Run: npm run setup-hooks
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

// Paths
const HOOKS_DIR = path.join(__dirname, '..', 'hooks');
const CLAUDE_SETTINGS_PATH = path.join(os.homedir(), '.claude', 'settings.json');

// Hook configurations
const HOOKS_CONFIG = {
    hooks: {
        SessionStart: [
            {
                matcher: "",
                hooks: [
                    {
                        type: "command",
                        command: `node "${path.join(HOOKS_DIR, 'session-start.js').replace(/\\/g, '\\\\')}"`
                    }
                ]
            }
        ],
        PostToolUse: [
            {
                matcher: "",
                hooks: [
                    {
                        type: "command",
                        command: `node "${path.join(HOOKS_DIR, 'post-tool-use.js').replace(/\\/g, '\\\\')}"`
                    }
                ]
            }
        ],
        Stop: [
            {
                matcher: "",
                hooks: [
                    {
                        type: "command",
                        command: `node "${path.join(HOOKS_DIR, 'session-stop.js').replace(/\\/g, '\\\\')}"`
                    }
                ]
            }
        ]
    }
};

function main() {
    console.log('='.repeat(50));
    console.log('  Project Tracker - Hook Setup');
    console.log('='.repeat(50));
    console.log('');

    // Check if Claude settings directory exists
    const claudeDir = path.dirname(CLAUDE_SETTINGS_PATH);
    if (!fs.existsSync(claudeDir)) {
        console.log(`Creating Claude config directory: ${claudeDir}`);
        fs.mkdirSync(claudeDir, { recursive: true });
    }

    // Read existing settings or create new
    let settings = {};
    if (fs.existsSync(CLAUDE_SETTINGS_PATH)) {
        console.log('Found existing Claude settings.');
        const backup = CLAUDE_SETTINGS_PATH + '.backup.' + Date.now();
        fs.copyFileSync(CLAUDE_SETTINGS_PATH, backup);
        console.log(`Backup created: ${backup}`);

        try {
            settings = JSON.parse(fs.readFileSync(CLAUDE_SETTINGS_PATH, 'utf8'));
        } catch (e) {
            console.log('Warning: Could not parse existing settings, starting fresh.');
            settings = {};
        }
    } else {
        console.log('No existing Claude settings found. Creating new file.');
    }

    // Merge hooks
    if (!settings.hooks) {
        settings.hooks = {};
    }

    // Add our hooks
    for (const [hookType, hookArray] of Object.entries(HOOKS_CONFIG.hooks)) {
        if (!settings.hooks[hookType]) {
            settings.hooks[hookType] = [];
        }

        // Check if our hook already exists
        const ourCommand = hookArray[0].hooks[0].command;
        const exists = settings.hooks[hookType].some(h =>
            h.hooks && h.hooks.some(hh => hh.command && hh.command.includes('project-tracker'))
        );

        if (!exists) {
            settings.hooks[hookType].push(...hookArray);
            console.log(`Added ${hookType} hook`);
        } else {
            console.log(`${hookType} hook already exists, skipping`);
        }
    }

    // Write settings
    fs.writeFileSync(CLAUDE_SETTINGS_PATH, JSON.stringify(settings, null, 2));

    console.log('');
    console.log('Hooks installed successfully!');
    console.log('');
    console.log('Settings file:', CLAUDE_SETTINGS_PATH);
    console.log('');
    console.log('The following hooks are now active:');
    console.log('  - SessionStart: Logs when you start working');
    console.log('  - PostToolUse: Tracks tool usage and file changes');
    console.log('  - Stop: Logs session completion');
    console.log('');
    console.log('IMPORTANT: Make sure the Project Tracker server is running:');
    console.log('  cd project-tracker && npm start');
    console.log('');
    console.log('Dashboard will be available at: http://localhost:3001');
    console.log('='.repeat(50));
}

main();
