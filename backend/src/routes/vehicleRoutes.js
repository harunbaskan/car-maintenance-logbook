const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const authMiddleware = require('../middleware/authMiddleware');
const {
  validateCreateVehicle,
  validateUpdateVehicle
} = require('../validators/vehicleValidator');

// TUM endpoint'ler korumali - authMiddleware tum route'lara uygulanir
router.use(authMiddleware);

// GET /api/vehicles - Kullanicinin tum araclarini listele
router.get('/', vehicleController.getAllVehicles);

// GET /api/vehicles/:id - Tek aracin detayini getir
router.get('/:id', vehicleController.getVehicleById);

// POST /api/vehicles - Yeni arac ekle (Joi validation)
router.post('/', validateCreateVehicle, vehicleController.createVehicle);

// PUT /api/vehicles/:id - Arac guncelle (Joi validation)
router.put('/:id', validateUpdateVehicle, vehicleController.updateVehicle);

// DELETE /api/vehicles/:id - Arac sil
router.delete('/:id', vehicleController.deleteVehicle);

module.exports = router;