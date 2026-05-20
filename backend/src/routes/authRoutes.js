const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Kullanici kayit ve giris islemleri
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Yeni kullanici kaydi
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, email, password]
 *             properties:
 *               username:
 *                 type: string
 *                 example: harun
 *               email:
 *                 type: string
 *                 example: harun@test.com
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       201:
 *         description: Kullanici basariyla olusturuldu
 *       400:
 *         description: Email veya username zaten kayitli
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Kullanici girisi (JWT token doner)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: harun@test.com
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Giris basarili, JWT token doner
 *       401:
 *         description: Email veya sifre hatali
 */
router.post('/login', authController.login);

module.exports = router;