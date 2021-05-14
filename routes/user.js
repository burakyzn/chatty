const express = require('express'); 
const router  = express.Router(); 

const userController = require('../controllers/user'); 

router.post('/register', userController.register);
router.post('/setAvatar', userController.setAvatar); 
router.get('/getRoomList', userController.getRoomList);

module.exports = router;