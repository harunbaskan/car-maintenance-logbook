const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenanceController');
const authMiddleware = require('../middleware/authMiddleware');
const {
  validateCreateMaintenance,
  validateUpdateMaintenance
} = require('../validators/maintenanceValidator');

/**
 * @swagger
 * tags:
 *   name: Maintenance
 *   description: Bakim kayitlari yonetimi. Tum endpoint'ler JWT token gerektirir.
 */

router.use(authMiddleware);

/**
 * @swagger
 * /api/maintenance:
 *   get:
 *     summary: Kullanicinin tum bakim kayitlarini listele
 *     tags: [Maintenance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Bakim tipine gore filtrele
 *     responses:
 *       200:
 *         description: Bakim kayitlari listesi
 */
router.get('/', maintenanceController.getAllMaintenance);

/**
 * @swagger
 * /api/maintenance/vehicle/{vehicleId}/summary:
 *   get:
 *     summary: Aracin bakim maliyet ozeti (tipe gore gruplu)
 *     tags: [Maintenance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: vehicleId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Maliyet ozeti (byType, grandTotal, totalRecords)
 */
router.get('/vehicle/:vehicleId/summary', maintenanceController.getMaintenanceSummary);

/**
 * @swagger
 * /api/maintenance/vehicle/{vehicleId}:
 *   get:
 *     summary: Bir aracin tum bakim kayitlarini listele
 *     tags: [Maintenance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: vehicleId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bakim kayitlari
 *       404:
 *         description: Arac bulunamadi
 */
router.get('/vehicle/:vehicleId', maintenanceController.getMaintenanceByVehicle);

/**
 * @swagger
 * /api/maintenance/{id}:
 *   get:
 *     summary: Tek bakim kaydi detayi
 *     tags: [Maintenance]
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
 *         description: Bakim kaydi detayi
 *       404:
 *         description: Kayit bulunamadi
 */
router.get('/:id', maintenanceController.getMaintenanceById);

/**
 * @swagger
 * /api/maintenance/vehicle/{vehicleId}:
 *   post:
 *     summary: Yeni bakim kaydi ekle
 *     tags: [Maintenance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: vehicleId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [type, date, kmAtService, cost]
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [Yag degisimi, Lastik degisimi, Fren bakimi, Aku degisimi, Periyodik bakim, Muayene, Sigorta, Kasko, Diger]
 *                 example: Yag degisimi
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2024-03-15
 *               kmAtService:
 *                 type: number
 *                 example: 78000
 *               cost:
 *                 type: number
 *                 example: 800
 *               serviceName:
 *                 type: string
 *                 example: Hizli Servis
 *               notes:
 *                 type: string
 *                 example: 5W30 motor yagi
 *     responses:
 *       201:
 *         description: Bakim kaydi olusturuldu
 *       400:
 *         description: Validation hatasi
 */
router.post('/vehicle/:vehicleId', validateCreateMaintenance, maintenanceController.createMaintenance);

/**
 * @swagger
 * /api/maintenance/{id}:
 *   put:
 *     summary: Bakim kaydini guncelle
 *     tags: [Maintenance]
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
 *               cost:
 *                 type: number
 *                 example: 900
 *     responses:
 *       200:
 *         description: Bakim kaydi guncellendi
 *       404:
 *         description: Kayit bulunamadi
 */
router.put('/:id', validateUpdateMaintenance, maintenanceController.updateMaintenance);

/**
 * @swagger
 * /api/maintenance/{id}:
 *   delete:
 *     summary: Bakim kaydini sil
 *     tags: [Maintenance]
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
 *         description: Bakim kaydi silindi
 *       404:
 *         description: Kayit bulunamadi
 */
router.delete('/:id', maintenanceController.deleteMaintenance);

module.exports = router;