const express = require('express'); 
const router  = express.Router(); 

const messageController = require('../controllers/message'); 

router.get('/getPublicMessageList', messageController.getPublicMessageList);
router.get('/getPrivateMessageList', messageController.getPrivateMessageList);

module.exports = router;