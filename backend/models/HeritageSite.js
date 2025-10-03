const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const heritageSiteSchema = new Schema({
    site_id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    image_array: { type: [String], default: [] },
    description: { type: String, required: true },
    youtube_video_id: { type: String },
    location: { type: String, required: true },
    geotag: {
        type: { type: String },
        era: { type: String },
        latitude: { type: Number },
        longitude: { type: Number }
    },
    tags: { type: [String] },
}, { timestamps: true });

module.exports = mongoose.model('HeritageSite', heritageSiteSchema);
