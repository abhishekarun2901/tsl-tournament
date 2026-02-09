# TSL Tournament Organizer Guide

> Complete step-by-step instructions for managing the Thekkinkad Super League tournament.

---

## 📋 Table of Contents

1. [Accessing the Admin Panel](#1-accessing-the-admin-panel)
2. [Managing Match Status & Scores](#2-managing-match-status--scores)
3. [Adding Goal Scorers](#3-adding-goal-scorers)
4. [Removing Goals (Corrections)](#4-removing-goals-corrections)
5. [Editing Fixtures](#5-editing-fixtures)
6. [Managing Golden Boot & Glove Awards](#6-managing-golden-boot--glove-awards)
7. [Managing Goalkeeper Clean Sheets](#7-managing-goalkeeper-clean-sheets)
8. [Recalculating Standings](#8-recalculating-standings)
9. [Viewing Teams & Players](#9-viewing-teams--players)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. Accessing the Admin Panel

### Steps:
1. Navigate to `/update-tournament` in your browser
2. Enter the **Secret Key** (provided by the developer)
3. Click **"Access Dashboard"**

### Notes:
- Your login will be saved in the browser
- Use **"Logout"** button to end your session
- Keep the secret key confidential!

---

## 2. Managing Match Status & Scores

### Changing Match Status:

1. Go to the **"Matches"** tab
2. Click on any match card to expand it
3. Under **"Match Status"**, click one of:
   - **Upcoming** - Match hasn't started
   - **Live** - Match is currently being played
   - **Finished** - Match has ended

### Updating Scores:

1. Expand the match card
2. Under **"Update Score"**, enter the score numbers
3. Click **"Update"**

> ⚠️ **Important:** After marking a match as "Finished", the standings table will automatically recalculate.

---

## 3. Adding Goal Scorers

### Steps:

1. Go to **"Matches"** tab
2. Click on the match to expand
3. Under **"Add Goal Scorer"**:
   - **Select Team** - Choose which team scored
   - **Select Player** - Choose the goal scorer
   - **Enter Minute** - When the goal was scored (1-120)
4. Click **"Add"**

### Notes:
- The score updates automatically when you add a goal
- You can select any team (useful for own goals)
- Player's goal count is automatically updated

---

## 4. Removing Goals (Corrections)

### Steps:

1. Go to **"Matches"** tab
2. Expand the match containing the incorrect goal
3. Find the goal in the **"Goal Scorers"** list
4. Click the **🗑️ trash icon** next to the goal

### What happens:
- Goal is removed from the match
- Score is automatically adjusted
- Player's goal count is reduced by 1

---

## 5. Editing Fixtures

### Steps:

1. Go to **"Fixtures"** tab
2. Find the match you want to edit
3. Click **"Edit"**
4. You can change:
   - **Team A** - First team
   - **Team B** - Second team
   - **Match #** - Order/sequence number
   - **Match Time** - Date and time of the match
5. Click **"Save"**

### Use Cases:
- Correct team pairings
- Reorder match sequence
- Update match times
- Fix scheduling errors

---

## 6. Managing Golden Boot & Glove Awards

### Overview:

The Awards page can display:
- **Golden Boot** 👟 - Top goal scorers
- **Golden Glove** 🧤 - Best goalkeepers (by clean sheets)

### Enabling/Disabling Awards:

1. Go to **"Settings"** tab
2. Toggle **"Golden Boot"** on/off
3. Toggle **"Golden Glove"** on/off

### Notes:
- Awards are **hidden by default**
- Enable them only when ready to show publicly
- Both can be enabled simultaneously (shows as tabs)
- If only one is enabled, it shows without tabs

---

## 7. Managing Goalkeeper Clean Sheets

### Steps:

1. Go to **"🧤 Keepers"** tab
2. Find the goalkeeper
3. Use the **+** and **-** buttons to adjust clean sheets

### When to add a clean sheet:
- After a match where the goalkeeper's team didn't concede any goals
- The goalkeeper played the full match (or majority)

### Important:
- Clean sheets are tracked separately from goals
- Make sure goalkeepers are marked as such in the database
- If no goalkeepers appear, contact the developer

---

## 8. Recalculating Standings

### When to use:
- If standings appear incorrect
- After manual score edits
- After any data corrections

### Steps:

1. Click **"Recalculate Standings"** (top-right button)
2. Wait for confirmation message

### What it recalculates:
- Matches played (P)
- Wins, Draws, Losses (W/D/L)
- Goals For/Against (GF/GA)
- Goal Difference (GD)
- Points (3 for win, 1 for draw)

---

## 9. Viewing Teams & Players

### Teams Tab:
- View all 8 teams
- See pool assignments
- View managers

### Players Tab:
- View all players
- See team assignments
- Check department
- View goal counts
- 🧤 icon indicates goalkeepers

---

## 10. Troubleshooting

### "Failed to load data"
- Check your internet connection
- Verify the server is running
- Try refreshing the page

### Goals not updating correctly
- Use "Recalculate Standings" button
- Check if match status is correct
- Verify the goal was added to correct team

### Can't see Golden Boot/Glove on public site
- Go to Settings tab
- Enable the relevant award toggle
- Changes are instant

### Standings look wrong
- Click "Recalculate Standings"
- Check all match statuses are correct
- Verify scores are accurate

### Need to contact support?
- Take a screenshot of the issue
- Note the time and action that caused it
- Contact the developer with details

---

## Quick Reference

| Action | Tab | Steps |
|--------|-----|-------|
| Start a match | Matches | Click match → Status → Live |
| End a match | Matches | Click match → Status → Finished |
| Add goal | Matches | Click match → Add Goal Scorer → Add |
| Remove goal | Matches | Click match → Goal list → 🗑️ |
| Change teams | Fixtures | Find match → Edit → Change teams → Save |
| Show awards | Settings | Toggle Golden Boot/Glove on |
| Add clean sheet | 🧤 Keepers | Find keeper → Click + |
| Fix standings | Header | Click "Recalculate Standings" |

---

## Best Practices

1. **Keep matches updated in real-time** - Change status to "Live" when match starts
2. **Add goals as they happen** - Don't wait until end of match
3. **Mark finished immediately** - When match ends, change to "Finished"
4. **Double-check before saving** - Especially for fixture changes
5. **Enable awards at the right time** - Usually after a few matches
6. **Backup before major changes** - Note current state if making bulk edits

---

*Last updated: February 2024*
