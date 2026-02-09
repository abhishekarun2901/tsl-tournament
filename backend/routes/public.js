import express from 'express';
import { Team, Player, Match, Standing, Settings } from '../models/index.js';

const router = express.Router();

// GET /api/settings - Get public settings (for conditional display)
router.get('/settings', async (req, res) => {
    try {
        const settings = await Settings.getSettings();
        res.json(settings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch settings' });
    }
});

// GET /api/teams - Get all teams
router.get('/teams', async (req, res) => {
    try {
        const teams = await Team.find().sort({ pool: 1, name: 1 });
        res.json(teams);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch teams' });
    }
});

// GET /api/teams/:id - Get single team with players
router.get('/teams/:id', async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);
        if (!team) {
            return res.status(404).json({ error: 'Team not found' });
        }

        const players = await Player.find({ teamId: team._id }).sort({ name: 1 });

        res.json({ ...team.toObject(), players });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch team' });
    }
});

// GET /api/matches - Get all matches
router.get('/matches', async (req, res) => {
    try {
        const matches = await Match.find()
            .populate('teamA', 'name logo')
            .populate('teamB', 'name logo')
            .populate('goalscorers.playerId', 'name')
            .populate('goalscorers.teamId', 'name')
            .populate('cards.playerId', 'name')
            .sort({ matchNumber: 1, matchday: 1, matchTime: 1 });

        res.json(matches);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch matches' });
    }
});

// GET /api/matches/live - Get only live matches
router.get('/matches/live', async (req, res) => {
    try {
        const matches = await Match.find({ status: 'live' })
            .populate('teamA', 'name logo')
            .populate('teamB', 'name logo')
            .populate('goalscorers.playerId', 'name')
            .populate('goalscorers.teamId', 'name')
            .sort({ matchTime: 1 });

        res.json(matches);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch live matches' });
    }
});

// GET /api/matches/today - Get today's matches
router.get('/matches/today', async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const matches = await Match.find({
            matchTime: { $gte: today, $lt: tomorrow }
        })
            .populate('teamA', 'name logo')
            .populate('teamB', 'name logo')
            .populate('goalscorers.playerId', 'name')
            .populate('goalscorers.teamId', 'name')
            .sort({ matchTime: 1 });

        res.json(matches);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch today\'s matches' });
    }
});

// GET /api/standings - Get points table
router.get('/standings', async (req, res) => {
    try {
        const standings = await Standing.find()
            .populate('teamId', 'name logo pool')
            .sort({ points: -1, gd: -1, gf: -1 });

        res.json(standings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch standings' });
    }
});

// GET /api/players - Get all players
router.get('/players', async (req, res) => {
    try {
        const players = await Player.find()
            .populate('teamId', 'name logo')
            .sort({ name: 1 });

        res.json(players);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch players' });
    }
});

// GET /api/topscorers - Get top scorers (Golden Boot)
router.get('/topscorers', async (req, res) => {
    try {
        const topScorers = await Player.find({ goals: { $gt: 0 } })
            .populate('teamId', 'name logo')
            .sort({ goals: -1, name: 1 })
            .limit(20);

        res.json(topScorers);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch top scorers' });
    }
});

// GET /api/cleansheets - Get goalkeepers with clean sheets (Golden Glove)
router.get('/cleansheets', async (req, res) => {
    try {
        const goalkeepers = await Player.find({
            isGoalkeeper: true,
            cleanSheets: { $gt: 0 }
        })
            .populate('teamId', 'name logo')
            .sort({ cleanSheets: -1, name: 1 })
            .limit(20);

        res.json(goalkeepers);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch clean sheets' });
    }
});

export default router;
