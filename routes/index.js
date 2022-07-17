const express = require('express');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const chatRoutes = require('./chatRoutes');
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/user', authMiddleware, userRoutes);
router.use('/chat', authMiddleware, chatRoutes);

module.exports = router;
