const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    imageUrl: { type: String, required: true },
    tags: { type: [String], index: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    heritageSite: { type: Schema.Types.ObjectId, ref: 'HeritageSite' },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
