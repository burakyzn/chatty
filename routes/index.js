const express = require('express');
const userRoutes = require('./userRoutes');
const messageRoutes = require('./message');

const router = express.Router();

router.use('/user', userRoutes);
router.use('/message', messageRoutes);

module.exports = router;
