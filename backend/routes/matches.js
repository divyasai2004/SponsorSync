const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = mongoose.model('User');
const Match = mongoose.model('Match');
const StudentClubProfile = mongoose.model('StudentClubProfile');
const SponsorProfile = mongoose.model('SponsorProfile');

const router = express.Router();

// Auth middleware
function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Helper: calculate match %
function calculateMatchPercent(studentProfile, sponsorProfile) {
  let score = 0;
  let total = 0;
  // Target Audience
  total++;
  if (
    studentProfile.targetAudience &&
    sponsorProfile.targetAudience &&
    studentProfile.targetAudience.toLowerCase() === sponsorProfile.targetAudience.toLowerCase()
  ) score++;
  // Industry
  total++;
  if (
    studentProfile.theme &&
    sponsorProfile.industry &&
    studentProfile.theme.toLowerCase() === sponsorProfile.industry.toLowerCase()
  ) score++;
  // Goals
  total++;
  if (
    studentProfile.sponsorshipRequirements &&
    sponsorProfile.goals &&
    studentProfile.sponsorshipRequirements.toLowerCase().includes(sponsorProfile.goals.toLowerCase())
  ) score++;
  // Region (optional)
  total++;
  if (
    studentProfile.region &&
    sponsorProfile.region &&
    studentProfile.region.toLowerCase() === sponsorProfile.region.toLowerCase()
  ) score++;
  return Math.round((score / total) * 100);
}

// GET / - get matches for current user, with match %
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate('studentClubProfile')
      .populate('sponsorProfile');
    let matches = await Match.find({ $or: [ { studentClub: req.user.userId }, { sponsor: req.user.userId } ] })
      .populate('studentClub', 'email studentClubProfile')
      .populate('sponsor', 'email sponsorProfile');
    // Filtering
    const { industry, audience } = req.query;
    matches = await Promise.all(matches.map(async match => {
      let percent = 0;
      let studentProfile = null;
      let sponsorProfile = null;
      if (user.role === 'studentClub') {
        studentProfile = user.studentClubProfile || (await StudentClubProfile.findOne({ user: user._id }));
        sponsorProfile = await SponsorProfile.findOne({ user: match.sponsor._id });
      } else {
        sponsorProfile = user.sponsorProfile || (await SponsorProfile.findOne({ user: user._id }));
        studentProfile = await StudentClubProfile.findOne({ user: match.studentClub._id });
      }
      if (studentProfile && sponsorProfile) {
        percent = calculateMatchPercent(studentProfile, sponsorProfile);
      }
      return { ...match.toObject(), matchPercent: percent, studentProfile, sponsorProfile };
    }));
    // Apply filters
    if (industry) {
      matches = matches.filter(m => {
        const sp = m.sponsorProfile || {};
        return sp.industry && sp.industry.toLowerCase() === industry.toLowerCase();
      });
    }
    if (audience) {
      matches = matches.filter(m => {
        const sp = m.sponsorProfile || m.studentProfile || {};
        return sp.targetAudience && sp.targetAudience.toLowerCase() === audience.toLowerCase();
      });
    }
    res.json({ matches });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 