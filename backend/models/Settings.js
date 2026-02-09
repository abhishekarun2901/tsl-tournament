import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true
    },
    value: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    }
}, { timestamps: true });

// Default settings
settingsSchema.statics.getSettings = async function () {
    const settings = await this.find({});
    const result = {
        showGoldenBoot: false,
        showGoldenGlove: false
    };

    settings.forEach(s => {
        result[s.key] = s.value;
    });

    return result;
};

settingsSchema.statics.setSetting = async function (key, value) {
    return this.findOneAndUpdate(
        { key },
        { key, value },
        { upsert: true, new: true }
    );
};

export default mongoose.model('Settings', settingsSchema);
