const userController = require('../controllers/userController');
const express = require('express');
const router = express.Router();

const multer = require('multer');
const memoStorage = multer.memoryStorage();
const upload = multer({ memoStorage });

router.get('/', userController.getUsers);
router.get('/me', userController.getUserDetails);
router.put('/avatar', upload.single('file'), userController.updateAvatar)
router.put('/about-me', userController.updateAboutMe)

module.exports = router;
