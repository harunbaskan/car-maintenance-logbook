const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const authMiddleware = require('../middleware/authMiddleware');
const {
  validateCreateVehicle,
  validateUpdateVehicle
} = require('../validators/vehicleValidator');

/**
 * @swagger
 * tags:
 *   name: Vehicles
 *   description: Arac yonetimi (CRUD). Tum endpoint'ler JWT token gerektirir.
 */

router.use(authMiddleware);

/**
 * @swagger
 * /api/vehicles:
 *   get:
 *     summary: Kullanicinin tum araclarini listele
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Araclar listesi
 *       401:
 *         description: Token gerekli
 */
router.get('/', vehicleController.getAllVehicles);

/**
 * @swagger
 * /api/vehicles/{id}:
 *   get:
 *     summary: Tek bir aracin detayini getir
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Arac ID
 *     responses:
 *       200:
 *         description: Arac detayi
 *       404:
 *         description: Arac bulunamadi
 */
router.get('/:id', vehicleController.getVehicleById);

/**
 * @swagger
 * /api/vehicles:
 *   post:
 *     summary: Yeni arac ekle
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [make, model, year, plate, currentKm, fuelType]
 *             properties:
 *               make:
 *                 type: string
 *                 example: BMW
 *               model:
 *                 type: string
 *                 example: M3
 *               year:
 *                 type: number
 *                 example: 2022
 *               plate:
 *                 type: string
 *                 example: 34ABC123
 *               currentKm:
 *                 type: number
 *                 example: 25000
 *               fuelType:
 *                 type: string
 *                 enum: [Benzin, Dizel, LPG, Elektrik, Hibrit]
 *                 example: Benzin
 *     responses:
 *       201:
 *         description: Arac olusturuldu
 *       400:
 *         description: Validation hatasi
 */
router.post('/', validateCreateVehicle, vehicleController.createVehicle);

/**
 * @swagger
 * /api/vehicles/{id}:
 *   put:
 *     summary: Arac bilgilerini guncelle
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentKm:
 *                 type: number
 *                 example: 30000
 *     responses:
 *       200:
 *         description: Arac guncellendi
 *       404:
 *         description: Arac bulunamadi
 */
router.put('/:id', validateUpdateVehicle, vehicleController.updateVehicle);

/**
 * @swagger
 * /api/vehicles/{id}:
 *   delete:
 *     summary: Arac sil
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Arac silindi
 *       404:
 *         description: Arac bulunamadi
 */
router.delete('/:id', vehicleController.deleteVehicle);

module.exports = router;