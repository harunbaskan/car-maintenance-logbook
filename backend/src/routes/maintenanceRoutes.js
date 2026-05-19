const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenanceController');
const authMiddleware = require('../middleware/authMiddleware');
const {
  validateCreateMaintenance,
  validateUpdateMaintenance
} = require('../validators/maintenanceValidator');

// Tum endpoint'ler korumali
router.use(authMiddleware);

// GET /api/maintenance - Kullanicinin tum bakim kayitlarini listele
router.get('/', maintenanceController.getAllMaintenance);

// GET /api/maintenance/vehicle/:vehicleId/summary - Maliyet ozeti (BONUS)
router.get('/vehicle/:vehicleId/summary', maintenanceController.getMaintenanceSummary);

// GET /api/maintenance/vehicle/:vehicleId - Bir aracin bakimlarini listele
router.get('/vehicle/:vehicleId', maintenanceController.getMaintenanceByVehicle);

// GET /api/maintenance/:id - Tek bakim kaydi detayi
router.get('/:id', maintenanceController.getMaintenanceById);

// POST /api/maintenance/vehicle/:vehicleId - Yeni bakim kaydi ekle
router.post(
  '/vehicle/:vehicleId',
  validateCreateMaintenance,
  maintenanceController.createMaintenance
);

// PUT /api/maintenance/:id - Bakim kaydi guncelle
router.put(
  '/:id',
  validateUpdateMaintenance,
  maintenanceController.updateMaintenance
);

// DELETE /api/maintenance/:id - Bakim kaydi sil
router.delete('/:id', maintenanceController.deleteMaintenance);

module.exports = router;