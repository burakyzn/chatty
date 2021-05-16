const express = require('express');
const router = express.Router();

const messageController = require('../controllers/message');

router.get('/getPublicMessageList', messageController.getPublicMessageList);
router.get('/getPrivateMessageList', messageController.getPrivateMessageList);
router.get('/getRoomMessageList', messageController.getRoomMessageList);

module.exports = router;
