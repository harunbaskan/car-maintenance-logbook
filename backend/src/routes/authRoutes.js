const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/register - Yeni kullanici kaydi
router.post('/register', authController.register);

// POST /api/auth/login - Kullanici girisi
router.post('/login', authController.login);

module.exports = router;