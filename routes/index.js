const express = require('express');
const userRoutes = require('./user');
const messageRoutes = require('./message');

const router = express.Router();

router.use('/user', userRoutes);
router.use('/message', messageRoutes);

module.exports = router;
