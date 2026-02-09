# Organizer Workflow Guide

This guide explains how to use the hidden organizer page to manage the tournament.

## Accessing the Organizer Page

1. Navigate to: `https://your-site.com/update-tournament`
2. Enter your secret key (set in `ADMIN_SECRET` environment variable)
3. Click "Access Dashboard"

> ⚠️ Keep your secret key secure. Anyone with this key can modify tournament data.

---

## Managing Matches

### Updating Match Status

1. Find the match in the list
2. Click on the match card to expand it
3. Click one of the status buttons:
   - **Upcoming** - Match hasn't started
   - **Live** - Match is currently in progress
   - **Finished** - Match has ended

> When a match is set to "Finished", standings are automatically recalculated.

### Updating Score

1. Expand the match card
2. Modify the score inputs for each team
3. Click "Update Score"

### Adding Goal Scorers

1. Expand the match card
2. In "Add Goal Scorer" section:
   - Select the scoring team
   - Select the player who scored
   - Enter the minute of the goal
3. Click "Add Goal"

> Adding a goal automatically:
> - Increments the match score
> - Increments the player's goal count

---

## Live Match Workflow

When a match is about to start:

1. **Set status to "Live"**
   - The match will appear in the "Live Now" section on the homepage
   - A pulsing red indicator shows the match is live

2. **Update score as goals are scored**
   - Add goal scorer with the minute
   - Score updates automatically

3. **When match ends, set status to "Finished"**
   - Standings are recalculated
   - Match moves to "Recent Results"

---

## Points Table

The points table is **automatically calculated** based on finished matches.

- You cannot manually edit standings
- To recalculate standings, click "Recalculate Standings" button

### Points System
| Result | Points |
|--------|--------|
| Win | 3 |
| Draw | 1 |
| Loss | 0 |

---

## Tips

1. **Keep the page open during live matches** for quick updates
2. **Refresh data** by logging out and back in
3. **Double-check goal scorers** - they affect the Top Scorers leaderboard
4. **Test on mobile** - the organizer page is responsive

---

## Troubleshooting

### "Invalid secret key"
- Check that your secret matches the `ADMIN_SECRET` in backend `.env`

### Changes not showing on public site
- Wait 10 seconds for automatic polling refresh
- Or manually refresh the public page

### Wrong score
- Update the score using the score inputs
- Goal scorers don't automatically correct if you change the score manually
