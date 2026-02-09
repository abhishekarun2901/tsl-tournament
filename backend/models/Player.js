import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: true
    },
    department: {
        type: String,
        enum: ['ME', 'EC', 'CSE', 'EE', 'CE', 'IC', 'Unknown'],
        default: 'Unknown'
    },
    jerseyNumber: {
        type: Number,
        default: null
    },
    goals: {
        type: Number,
        default: 0
    },
    cleanSheets: {
        type: Number,
        default: 0
    },
    isGoalkeeper: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Index for efficient queries
playerSchema.index({ teamId: 1 });
playerSchema.index({ goals: -1 });
playerSchema.index({ cleanSheets: -1 });

export default mongoose.model('Player', playerSchema);
