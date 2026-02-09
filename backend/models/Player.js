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
    }
}, {
    timestamps: true
});

// Index for efficient team-based queries
playerSchema.index({ teamId: 1 });
playerSchema.index({ goals: -1 });

export default mongoose.model('Player', playerSchema);
