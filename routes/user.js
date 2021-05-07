const express = require('express'); 
const router  = express.Router(); 

const userController = require('../controllers/user'); 

router.get('/setNickname', userController.setNickname); 

module.exports = router;