const express = require('express');
const userRoutes = require('./userRoutes');
const chatRoutes = require('./chatRoutes');

const router = express.Router();

router.use('/user', userRoutes);
router.use('/chat', chatRoutes);

module.exports = router;
