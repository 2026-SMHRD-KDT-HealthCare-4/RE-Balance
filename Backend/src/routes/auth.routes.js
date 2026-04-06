const express = require('express');
const router = express.Router(); // router 정의 확인
const authController = require('../controllers/auth.controller');

router.post('/login', authController.login); 
router.post('/register', authController.register);

module.exports = router;