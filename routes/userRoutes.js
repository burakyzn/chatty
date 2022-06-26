const userController = require('../controllers/userController');
const express = require('express');
const router = express.Router();

router.get('/nickname', userController.getNickname);
router.post('/register', userController.register);

module.exports = router;
