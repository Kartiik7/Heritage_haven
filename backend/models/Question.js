// backend/models/Question.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
  monumentId: { type: String, required: true }, // use same slug/id as HeritageSite
  text: { type: String, required: true },
  options: { type: [String], required: true },
  correctIndex: { type: Number, required: true } // never sent to client
}, { timestamps: true });

module.exports = mongoose.model('Question', QuestionSchema);
