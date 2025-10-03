// backend/models/Badge.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BadgeSchema = new Schema({
  key: { type: String, unique: true, required: true },
  name: String,
  description: String,
  icon: String
});

module.exports = mongoose.model('Badge', BadgeSchema);
