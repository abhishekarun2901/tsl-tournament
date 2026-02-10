import express from 'express';
import { Team, Player, Match, Standing, Settings } from '../models/index.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all admin routes
router.use(authMiddleware);

// POST /api/admin/verify - Verify secret key
router.post('/verify', (req, res) => {
    res.json({ success: true, message: 'Secret key verified' });
});

// =====================
// SETTINGS ENDPOINTS
// =====================

// GET /api/admin/settings - Get all settings
router.get('/settings', async (req, res) => {
    try {
        const settings = await Settings.getSettings();
        res.json(settings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch settings', details: error.message });
    }
});

// PUT /api/admin/settings - Update settings
router.put('/settings', async (req, res) => {
    try {
        const { showGoldenBoot, showGoldenGlove, showGoldenBall, goldenBallPlayer } = req.body;

        if (showGoldenBoot !== undefined) {
            await Settings.setSetting('showGoldenBoot', showGoldenBoot);
        }
        if (showGoldenGlove !== undefined) {
            await Settings.setSetting('showGoldenGlove', showGoldenGlove);
        }
        if (showGoldenBall !== undefined) {
            await Settings.setSetting('showGoldenBall', showGoldenBall);
        }
        if (goldenBallPlayer !== undefined) {
            await Settings.setSetting('goldenBallPlayer', goldenBallPlayer);
        }

        const settings = await Settings.getSettings();
        res.json(settings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update settings', details: error.message });
    }
});

// =====================
// TEAM ENDPOINTS
// =====================

// POST /api/admin/team - Add a new team
router.post('/team', async (req, res) => {
    try {
        const { name, logo, manager, captain, pool } = req.body;

        const team = new Team({ name, logo, manager, captain, pool });
        await team.save();

        // Create initial standing for the team
        const standing = new Standing({ teamId: team._id });
        await standing.save();

        res.status(201).json(team);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create team', details: error.message });
    }
});

// PUT /api/admin/team/:id - Update a team
router.put('/team/:id', async (req, res) => {
    try {
        const { name, logo, manager, captain, pool } = req.body;

        const team = await Team.findByIdAndUpdate(
            req.params.id,
            { name, logo, manager, captain, pool },
            { new: true }
        );

        if (!team) {
            return res.status(404).json({ error: 'Team not found' });
        }

        res.json(team);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update team', details: error.message });
    }
});

// =====================
// PLAYER ENDPOINTS
// =====================

// POST /api/admin/player - Add a new player
router.post('/player', async (req, res) => {
    try {
        const { name, teamId, department, jerseyNumber, isGoalkeeper } = req.body;

        const player = new Player({ name, teamId, department, jerseyNumber, isGoalkeeper });
        await player.save();

        res.status(201).json(player);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create player', details: error.message });
    }
});

// PUT /api/admin/player/:id - Update a player
router.put('/player/:id', async (req, res) => {
    try {
        const { name, teamId, department, jerseyNumber, goals, assists, cleanSheets, isGoalkeeper } = req.body;

        const player = await Player.findByIdAndUpdate(
            req.params.id,
            { name, teamId, department, jerseyNumber, goals, assists, cleanSheets, isGoalkeeper },
            { new: true }
        );

        if (!player) {
            return res.status(404).json({ error: 'Player not found' });
        }

        res.json(player);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update player', details: error.message });
    }
});

// PATCH /api/admin/player/:id/cleansheet - Add clean sheet to goalkeeper
router.patch('/player/:id/cleansheet', async (req, res) => {
    try {
        const { increment } = req.body; // +1 or -1

        const player = await Player.findByIdAndUpdate(
            req.params.id,
            { $inc: { cleanSheets: increment || 1 } },
            { new: true }
        ).populate('teamId', 'name logo');

        if (!player) {
            return res.status(404).json({ error: 'Player not found' });
        }

        res.json(player);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update clean sheets', details: error.message });
    }
});

// PATCH /api/admin/player/:id/assist - Update player assists
router.patch('/player/:id/assist', async (req, res) => {
    try {
        const { increment, value } = req.body; // increment: +1/-1, or value: set directly

        let player;
        if (value !== undefined) {
            // Direct set
            player = await Player.findByIdAndUpdate(
                req.params.id,
                { assists: Math.max(0, parseInt(value)) },
                { new: true }
            ).populate('teamId', 'name logo');
        } else {
            // Increment/decrement
            player = await Player.findByIdAndUpdate(
                req.params.id,
                { $inc: { assists: increment || 1 } },
                { new: true }
            ).populate('teamId', 'name logo');
        }

        if (!player) {
            return res.status(404).json({ error: 'Player not found' });
        }

        res.json(player);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update assists', details: error.message });
    }
});

// =====================
// MATCH ENDPOINTS
// =====================

// POST /api/admin/match - Create a new match
router.post('/match', async (req, res) => {
    try {
        const { teamA, teamB, matchTime, matchday, matchNumber } = req.body;

        const match = new Match({
            teamA,
            teamB,
            matchTime,
            matchday,
            matchNumber,
            status: 'upcoming',
            scoreA: 0,
            scoreB: 0
        });
        await match.save();

        const populatedMatch = await Match.findById(match._id)
            .populate('teamA', 'name logo')
            .populate('teamB', 'name logo');

        res.status(201).json(populatedMatch);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create match', details: error.message });
    }
});

// PUT /api/admin/match/:id - Update entire match (teams, time, number)
router.put('/match/:id', async (req, res) => {
    try {
        const { teamA, teamB, matchTime, matchday, matchNumber } = req.body;

        const match = await Match.findByIdAndUpdate(
            req.params.id,
            { teamA, teamB, matchTime, matchday, matchNumber },
            { new: true }
        )
            .populate('teamA', 'name logo')
            .populate('teamB', 'name logo')
            .populate('goalscorers.playerId', 'name')
            .populate('goalscorers.teamId', 'name');

        if (!match) {
            return res.status(404).json({ error: 'Match not found' });
        }

        res.json(match);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update match', details: error.message });
    }
});

// DELETE /api/admin/match/:id - Delete a match
router.delete('/match/:id', async (req, res) => {
    try {
        const match = await Match.findByIdAndDelete(req.params.id);

        if (!match) {
            return res.status(404).json({ error: 'Match not found' });
        }

        res.json({ success: true, message: 'Match deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete match', details: error.message });
    }
});

// PATCH /api/admin/match/:id/status - Update match status
router.patch('/match/:id/status', async (req, res) => {
    try {
        const { status, currentMinute } = req.body;

        const updateData = { status };
        if (currentMinute !== undefined) {
            updateData.currentMinute = currentMinute;
        }

        const match = await Match.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        )
            .populate('teamA', 'name logo')
            .populate('teamB', 'name logo')
            .populate('goalscorers.playerId', 'name')
            .populate('goalscorers.teamId', 'name');

        if (!match) {
            return res.status(404).json({ error: 'Match not found' });
        }

        // If match is finished, recalculate standings
        if (status === 'finished') {
            await recalculateStandings();
        }

        res.json(match);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update match status', details: error.message });
    }
});

// PATCH /api/admin/match/:id/score - Update match score
router.patch('/match/:id/score', async (req, res) => {
    try {
        const { scoreA, scoreB, currentMinute } = req.body;

        const updateData = {};
        if (scoreA !== undefined) updateData.scoreA = scoreA;
        if (scoreB !== undefined) updateData.scoreB = scoreB;
        if (currentMinute !== undefined) updateData.currentMinute = currentMinute;

        const match = await Match.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        )
            .populate('teamA', 'name logo')
            .populate('teamB', 'name logo')
            .populate('goalscorers.playerId', 'name')
            .populate('goalscorers.teamId', 'name');

        if (!match) {
            return res.status(404).json({ error: 'Match not found' });
        }

        // Recalculate standings if match is finished
        if (match.status === 'finished') {
            await recalculateStandings();
        }

        res.json(match);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update score', details: error.message });
    }
});

// POST /api/admin/match/:id/goal - Add a goal scorer
router.post('/match/:id/goal', async (req, res) => {
    try {
        const { playerId, teamId, minute, isOwnGoal } = req.body;

        const match = await Match.findById(req.params.id);
        if (!match) {
            return res.status(404).json({ error: 'Match not found' });
        }

        // Add goal to match
        match.goalscorers.push({ playerId, teamId, minute, isOwnGoal: isOwnGoal || false });

        // Update score based on which team scored
        if (teamId.toString() === match.teamA.toString()) {
            match.scoreA += 1;
        } else if (teamId.toString() === match.teamB.toString()) {
            match.scoreB += 1;
        }

        await match.save();

        // Update player's goal count
        await Player.findByIdAndUpdate(playerId, { $inc: { goals: 1 } });

        const populatedMatch = await Match.findById(match._id)
            .populate('teamA', 'name logo')
            .populate('teamB', 'name logo')
            .populate('goalscorers.playerId', 'name')
            .populate('goalscorers.teamId', 'name');

        res.json(populatedMatch);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add goal', details: error.message });
    }
});

// DELETE /api/admin/match/:id/goal - Remove a goal
router.delete('/match/:id/goal', async (req, res) => {
    try {
        const { goalIndex } = req.body;

        const match = await Match.findById(req.params.id);
        if (!match) {
            return res.status(404).json({ error: 'Match not found' });
        }

        if (goalIndex < 0 || goalIndex >= match.goalscorers.length) {
            return res.status(404).json({ error: 'Goal not found' });
        }

        const goal = match.goalscorers[goalIndex];

        // Update score
        if (goal.teamId.toString() === match.teamA.toString()) {
            match.scoreA = Math.max(0, match.scoreA - 1);
        } else {
            match.scoreB = Math.max(0, match.scoreB - 1);
        }

        // Remove goal and update player stats
        const playerId = goal.playerId;
        match.goalscorers.splice(goalIndex, 1);
        await match.save();

        // Update player's goal count
        await Player.findByIdAndUpdate(playerId, { $inc: { goals: -1 } });

        // Recalculate standings if match is finished
        if (match.status === 'finished') {
            await recalculateStandings();
        }

        const populatedMatch = await Match.findById(match._id)
            .populate('teamA', 'name logo')
            .populate('teamB', 'name logo')
            .populate('goalscorers.playerId', 'name')
            .populate('goalscorers.teamId', 'name');

        res.json(populatedMatch);
    } catch (error) {
        res.status(500).json({ error: 'Failed to remove goal', details: error.message });
    }
});

// POST /api/admin/match/:id/card - Add a card
router.post('/match/:id/card', async (req, res) => {
    try {
        const { playerId, teamId, cardType, minute } = req.body;

        const match = await Match.findById(req.params.id);
        if (!match) {
            return res.status(404).json({ error: 'Match not found' });
        }

        match.cards.push({ playerId, teamId, cardType, minute });
        await match.save();

        const populatedMatch = await Match.findById(match._id)
            .populate('teamA', 'name logo')
            .populate('teamB', 'name logo')
            .populate('goalscorers.playerId', 'name')
            .populate('goalscorers.teamId', 'name')
            .populate('cards.playerId', 'name');

        res.json(populatedMatch);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add card', details: error.message });
    }
});

// PATCH /api/admin/matches/reorder - Reorder matches
router.patch('/matches/reorder', async (req, res) => {
    try {
        const { matchOrders } = req.body; // Array of { matchId, matchNumber }

        for (const order of matchOrders) {
            await Match.findByIdAndUpdate(order.matchId, { matchNumber: order.matchNumber });
        }

        const matches = await Match.find()
            .populate('teamA', 'name logo')
            .populate('teamB', 'name logo')
            .sort({ matchNumber: 1 });

        res.json(matches);
    } catch (error) {
        res.status(500).json({ error: 'Failed to reorder matches', details: error.message });
    }
});

// POST /api/admin/recalculate-standings - Manually recalculate standings
router.post('/recalculate-standings', async (req, res) => {
    try {
        await recalculateStandings();
        const standings = await Standing.find()
            .populate('teamId', 'name logo pool')
            .sort({ points: -1, gd: -1, gf: -1 });

        res.json({ success: true, standings });
    } catch (error) {
        res.status(500).json({ error: 'Failed to recalculate standings', details: error.message });
    }
});

// Helper function to recalculate all standings
async function recalculateStandings() {
    const teams = await Team.find();
    const finishedMatches = await Match.find({ status: 'finished' });

    // Store current positions before recalculation
    const currentStandings = await Standing.find()
        .sort({ points: -1, gd: -1, gf: -1 });

    const positionMap = {};
    currentStandings.forEach((standing, index) => {
        positionMap[standing.teamId.toString()] = index + 1;
    });

    for (const team of teams) {
        const teamId = team._id.toString();

        let played = 0, won = 0, draw = 0, lost = 0, gf = 0, ga = 0;

        for (const match of finishedMatches) {
            const isTeamA = match.teamA.toString() === teamId;
            const isTeamB = match.teamB.toString() === teamId;

            if (!isTeamA && !isTeamB) continue;

            played++;

            if (isTeamA) {
                gf += match.scoreA;
                ga += match.scoreB;

                if (match.scoreA > match.scoreB) won++;
                else if (match.scoreA < match.scoreB) lost++;
                else draw++;
            } else {
                gf += match.scoreB;
                ga += match.scoreA;

                if (match.scoreB > match.scoreA) won++;
                else if (match.scoreB < match.scoreA) lost++;
                else draw++;
            }
        }

        const gd = gf - ga;
        const points = (won * 3) + draw;
        const previousPosition = positionMap[teamId] || null;

        await Standing.findOneAndUpdate(
            { teamId: team._id },
            { played, won, draw, lost, gf, ga, gd, points, previousPosition },
            { upsert: true }
        );
    }
}

export default router;
