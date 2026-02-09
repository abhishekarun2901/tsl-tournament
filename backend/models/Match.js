import mongoose from 'mongoose';

const goalScorerSchema = new mongoose.Schema({
    playerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
        required: true
    },
    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: true
    },
    minute: {
        type: Number,
        required: true
    },
    isOwnGoal: {
        type: Boolean,
        default: false
    }
}, { _id: false });

const matchSchema = new mongoose.Schema({
    teamA: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: true
    },
    teamB: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: true
    },
    scoreA: {
        type: Number,
        default: 0
    },
    scoreB: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['upcoming', 'live', 'finished'],
        default: 'upcoming'
    },
    matchTime: {
        type: Date,
        required: true
    },
    matchday: {
        type: Number,
        default: 1
    },
    matchNumber: {
        type: Number,
        default: 1
    },
    currentMinute: {
        type: Number,
        default: 0
    },
    goalscorers: [goalScorerSchema],
    cards: [{
        playerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Player'
        },
        teamId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Team'
        },
        cardType: {
            type: String,
            enum: ['yellow', 'red']
        },
        minute: Number
    }]
}, {
    timestamps: true
});

// Index for efficient queries
matchSchema.index({ status: 1, matchTime: 1 });
matchSchema.index({ matchday: 1 });
matchSchema.index({ matchNumber: 1 });

export default mongoose.model('Match', matchSchema);
