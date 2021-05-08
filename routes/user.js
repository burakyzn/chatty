const express = require('express'); 
const router  = express.Router(); 

const userController = require('../controllers/user'); 

router.get('/setNickname', userController.setNickname);
router.post('/setAvatar', userController.setAvatar); 

module.exports = router;