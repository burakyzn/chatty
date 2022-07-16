const userController = require('../controllers/userController');
const express = require('express');
const router = express.Router();

const multer = require('multer');
const memoStorage = multer.memoryStorage();
const upload = multer({ memoStorage });

router.get('/', userController.getUserDetails);
router.post('/register', userController.register);
router.post('/:nickname/avatar', upload.single('file'), userController.uploadAvatar)

module.exports = router;
