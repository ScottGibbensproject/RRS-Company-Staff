# Google Drive for Desktop - Best Practices Guide

> For the RRS Team: Scott, Nicole, Elisabeth

---

## 1. Installation

1. Download from: https://www.google.com/drive/download/
2. Sign in with your Google account
3. Choose **"Stream files"** (recommended) or **"Mirror files"**
   - **Stream:** Files stay in cloud, downloaded on demand (saves disk space)
   - **Mirror:** Full copy on your computer (works offline)

---

## 2. Where Files Live

After installation, you'll see Google Drive in File Explorer:

- **Windows:** Look for "Google Drive" in the left sidebar, or `G:\My Drive`
- **Mac:** Look for "Google Drive" in Finder sidebar

The `RRS Company` folder will live inside your Google Drive.

---

## 3. Sync Status Icons

Look for these icons on files/folders:

| Icon | Meaning |
|------|---------|
| ✓ (checkmark) | Synced and up to date |
| ↻ (arrows) | Currently syncing |
| ☁ (cloud) | Online only (not downloaded) |
| ⚠ (warning) | Sync problem - needs attention |

**If you see a warning icon, check the Google Drive menu in your system tray.**

---

## 4. Golden Rules for Team Sync

### Rule 1: Wait for the Checkmark
After saving a file, wait for the sync icon to show a checkmark before closing your laptop or walking away.

### Rule 2: One Editor at a Time
- Don't have two people edit the same file simultaneously
- If you're editing a file, let others know (Slack/text)
- Exception: Google Docs/Sheets handle simultaneous editing fine

### Rule 3: Check Sync Before Meetings
Before a team meeting, click the Google Drive icon in your system tray and confirm "Everything is up to date."

### Rule 4: Don't Rename While Others Are Editing
Renaming or moving a file while someone else has it open can cause conflicts.

### Rule 5: Use Google Docs for Collaborative Editing
For files you edit together often, consider converting to Google Docs format - it handles real-time collaboration better than Word/Markdown files.

---

## 5. Handling Sync Conflicts

If two people edit the same file before syncing, Google Drive creates a duplicate:

```
RRS-Knowledge-Base.md
RRS-Knowledge-Base (Nicole's conflicted copy).md
```

**To resolve:**
1. Open both files
2. Compare the differences
3. Merge the changes into one file
4. Delete the conflicted copy

---

## 6. Offline Access (Mirror Mode)

If you chose "Stream files" but need offline access:
1. Right-click the `RRS Company` folder
2. Select "Available offline"
3. Files will download and stay synced

---

## 7. Checking Sync Status

**Windows:** Click the Google Drive icon in the system tray (bottom-right)
**Mac:** Click the Google Drive icon in the menu bar (top-right)

You'll see:
- Files currently syncing
- Any errors
- "Up to date" when everything is synced

---

## 8. Troubleshooting

### Files not syncing?
1. Check your internet connection
2. Click the Google Drive icon > look for errors
3. Try: Pause sync, then Resume
4. Restart Google Drive (right-click icon > Quit, then reopen)

### Out of storage?
- Check storage at: https://drive.google.com/settings/storage
- RRS should have a shared workspace or enough storage on Scott's account

### Conflicted copies appearing?
- See "Handling Sync Conflicts" above
- Consider using Google Docs for frequently-edited files

---

## 9. Folder Structure for RRS Company

```
RRS Company/
├── RRS-Knowledge-Base.md    <- Main reference doc
├── changelog/               <- Software update logs
├── processes/               <- Process documentation (including this guide)
├── rrs-dashboard/           <- Dashboard app files
└── [other folders as needed]
```

**Do not rename or reorganize the top-level folders without team agreement.**

---

## 10. Quick Reference

| Task | How |
|------|-----|
| Check sync status | Click Google Drive icon in system tray |
| Force sync | Right-click file > "Sync now" (or just wait) |
| Make file available offline | Right-click > "Available offline" |
| See version history | Right-click > "View history" (or on drive.google.com) |
| Resolve conflict | Open both files, merge manually, delete duplicate |

---

## Questions?

Ask Scott or check Google's help: https://support.google.com/drive

---

*Last updated: December 30, 2025*
