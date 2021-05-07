const express = require("express");
const userRoutes = require('./user.js');

const router = express.Router();

router.use("/user", userRoutes);

module.exports = router;