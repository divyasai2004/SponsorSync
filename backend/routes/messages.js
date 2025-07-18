const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = mongoose.model('User');
const MessageThread = mongoose.model('MessageThread');

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

// GET / - get all threads for user
router.get('/', auth, async (req, res) => {
  try {
    const threads = await MessageThread.find({ participants: req.user.userId }).populate('participants', 'email role');
    res.json({ threads });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /:threadId - get messages in a thread
router.get('/:threadId', auth, async (req, res) => {
  try {
    const thread = await MessageThread.findById(req.params.threadId).populate('participants', 'email role');
    if (!thread || !thread.participants.some(p => p._id.equals(req.user.userId))) {
      return res.status(404).json({ error: 'Thread not found' });
    }
    res.json({ messages: thread.messages });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST / - start new thread or send message
router.post('/', auth, async (req, res) => {
  try {
    const { recipientId, message } = req.body;
    if (!recipientId || !message) return res.status(400).json({ error: 'recipientId and message required' });
    let thread = await MessageThread.findOne({
      participants: { $all: [req.user.userId, recipientId], $size: 2 }
    });
    if (!thread) {
      thread = new MessageThread({ participants: [req.user.userId, recipientId], messages: [] });
    }
    thread.messages.push({ sender: req.user.userId, text: message, timestamp: new Date() });
    await thread.save();
    res.json({ thread });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 