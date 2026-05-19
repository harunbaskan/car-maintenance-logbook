const vehicleService = require('../services/vehicleService');

/**
 * GET /api/vehicles - Kullanicinin tum araclarini getir
 */
const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await vehicleService.getAllVehicles(req.user.userId);
    res.status(200).json({
      success: true,
      count: vehicles.length,
      data: vehicles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * GET /api/vehicles/:id - Tek bir aracin detayini getir
 */
const getVehicleById = async (req, res) => {
  try {
    const vehicle = await vehicleService.getVehicleById(req.params.id, req.user.userId);
    res.status(200).json({
      success: true,
      data: vehicle
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * POST /api/vehicles - Yeni arac ekle
 */
const createVehicle = async (req, res) => {
  try {
    const vehicle = await vehicleService.createVehicle(req.user.userId, req.body);
    res.status(201).json({
      success: true,
      message: 'Arac basariyla olusturuldu',
      data: vehicle
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * PUT /api/vehicles/:id - Arac bilgilerini guncelle
 */
const updateVehicle = async (req, res) => {
  try {
    const vehicle = await vehicleService.updateVehicle(
      req.params.id,
      req.user.userId,
      req.body
    );
    res.status(200).json({
      success: true,
      message: 'Arac basariyla guncellendi',
      data: vehicle
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * DELETE /api/vehicles/:id - Arac sil
 */
const deleteVehicle = async (req, res) => {
  try {
    const result = await vehicleService.deleteVehicle(req.params.id, req.user.userId);
    res.status(200).json({
      success: true,
      message: result.message,
      data: { id: result.id }
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle
};