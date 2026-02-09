import express from 'express';
import { Team, Player, Match, Standing } from '../models/index.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all admin routes
router.use(authMiddleware);

// POST /api/admin/verify - Verify secret key
router.post('/verify', (req, res) => {
    res.json({ success: true, message: 'Secret key verified' });
});

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

// POST /api/admin/player - Add a new player
router.post('/player', async (req, res) => {
    try {
        const { name, teamId, position, jerseyNumber } = req.body;

        const player = new Player({ name, teamId, position, jerseyNumber });
        await player.save();

        res.status(201).json(player);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create player', details: error.message });
    }
});

// PUT /api/admin/player/:id - Update a player
router.put('/player/:id', async (req, res) => {
    try {
        const { name, teamId, position, jerseyNumber, goals } = req.body;

        const player = await Player.findByIdAndUpdate(
            req.params.id,
            { name, teamId, position, jerseyNumber, goals },
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

// POST /api/admin/match - Create a new match
router.post('/match', async (req, res) => {
    try {
        const { teamA, teamB, matchTime, matchday } = req.body;

        const match = new Match({
            teamA,
            teamB,
            matchTime,
            matchday,
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
        const { playerId, minute } = req.body;

        const match = await Match.findById(req.params.id);
        if (!match) {
            return res.status(404).json({ error: 'Match not found' });
        }

        // Find and remove the goal
        const goalIndex = match.goalscorers.findIndex(
            g => g.playerId.toString() === playerId && g.minute === minute
        );

        if (goalIndex === -1) {
            return res.status(404).json({ error: 'Goal not found' });
        }

        const goal = match.goalscorers[goalIndex];

        // Update score
        if (goal.teamId.toString() === match.teamA.toString()) {
            match.scoreA = Math.max(0, match.scoreA - 1);
        } else {
            match.scoreB = Math.max(0, match.scoreB - 1);
        }

        match.goalscorers.splice(goalIndex, 1);
        await match.save();

        // Update player's goal count
        await Player.findByIdAndUpdate(playerId, { $inc: { goals: -1 } });

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
