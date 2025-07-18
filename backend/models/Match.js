const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema({
  studentClubProfile: { type: mongoose.Schema.Types.ObjectId, ref: 'StudentClubProfile', required: true },
  sponsorProfile: { type: mongoose.Schema.Types.ObjectId, ref: 'SponsorProfile', required: true },
  matchScore: { type: Number, required: true },
  messageThread: { type: mongoose.Schema.Types.ObjectId, ref: 'MessageThread' }
}, { timestamps: true });

module.exports = mongoose.model('Match', MatchSchema); 