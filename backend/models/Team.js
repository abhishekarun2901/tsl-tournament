import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    logo: {
        type: String,
        default: ''
    },
    manager: {
        type: String,
        required: true
    },
    captain: {
        type: String,
        required: true
    },
    pool: {
        type: String,
        enum: ['A', 'B', 'N/A'],
        required: true
    }
}, {
    timestamps: true
});

export default mongoose.model('Team', teamSchema);
