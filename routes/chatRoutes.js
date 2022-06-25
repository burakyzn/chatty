const express = require('express');
const router = express.Router();

const chatController = require('../controllers/chatController');

router.get('/publicMessages', chatController.getPublicMessages);

module.exports = router;
