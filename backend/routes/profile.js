const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = mongoose.model('User');
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

// GET /me - get current user's profile
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate('studentClubProfile')
      .populate('sponsorProfile');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({
      email: user.email,
      role: user.role,
      studentClubProfile: user.studentClubProfile,
      sponsorProfile: user.sponsorProfile
    });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /me - update current user's profile
router.put('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.role === 'studentClub') {
      let profile = user.studentClubProfile
        ? await StudentClubProfile.findById(user.studentClubProfile)
        : new StudentClubProfile({});
      Object.assign(profile, req.body);
      await profile.save();
      if (!user.studentClubProfile) {
        user.studentClubProfile = profile._id;
        await user.save();
      }
      res.json({ studentClubProfile: profile });
    } else if (user.role === 'sponsor') {
      let profile = user.sponsorProfile
        ? await SponsorProfile.findById(user.sponsorProfile)
        : new SponsorProfile({});
      Object.assign(profile, req.body);
      await profile.save();
      if (!user.sponsorProfile) {
        user.sponsorProfile = profile._id;
        await user.save();
      }
      res.json({ sponsorProfile: profile });
    } else {
      res.status(400).json({ error: 'Invalid role' });
    }
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 