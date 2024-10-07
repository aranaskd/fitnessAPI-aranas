const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');


// [SECTION] User Registration, All Access, Post Method
router.post("/register", userController.registerUser);

// [SECTION] User Authentication, All Access,
router.post("/login", userController.loginUser);

module.exports = router;
