const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');

router.post('/register', userController.register);
router.post('/authVerify', userController.authVerify);
router.post('/setAvatar', userController.setAvatar);
router.get('/getRoomList', userController.getRoomList);

module.exports = router;
