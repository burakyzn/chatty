const userController = require('../controllers/userController');
const express = require('express');
const router = express.Router();

router.post('/register', userController.register);

module.exports = router;
