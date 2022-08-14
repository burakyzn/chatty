const express = require('express');
const router = express.Router();

const chatController = require('../controllers/chatController');

router.get('/publicMessages', chatController.getPublicMessages);
router.get('/privateMessages/:nickname', chatController.getPrivateMessages);

module.exports = router;
