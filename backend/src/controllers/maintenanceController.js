const maintenanceService = require('../services/maintenanceService');

/**
 * GET /api/maintenance - Kullanicinin tum bakim kayitlarini getir
 * Query: ?type=...
 */
const getAllMaintenance = async (req, res) => {
  try {
    const filters = { type: req.query.type };
    const records = await maintenanceService.getAllMaintenanceByUser(req.user.userId, filters);
    
    res.status(200).json({
      success: true,
      count: records.length,
      data: records
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * GET /api/maintenance/vehicle/:vehicleId - Bir aracin tum bakimlarini getir
 * Query: ?type=...
 */
const getMaintenanceByVehicle = async (req, res) => {
  try {
    const filters = { type: req.query.type };
    const records = await maintenanceService.getMaintenanceByVehicle(
      req.params.vehicleId,
      req.user.userId,
      filters
    );

    res.status(200).json({
      success: true,
      count: records.length,
      data: records
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * GET /api/maintenance/:id - Tek bakim kaydinin detayini getir
 */
const getMaintenanceById = async (req, res) => {
  try {
    const record = await maintenanceService.getMaintenanceById(req.params.id, req.user.userId);
    res.status(200).json({
      success: true,
      data: record
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * POST /api/maintenance/vehicle/:vehicleId - Yeni bakim kaydi olustur
 */
const createMaintenance = async (req, res) => {
  try {
    const record = await maintenanceService.createMaintenance(
      req.params.vehicleId,
      req.user.userId,
      req.body
    );

    res.status(201).json({
      success: true,
      message: 'Bakim kaydi basariyla olusturuldu',
      data: record
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * PUT /api/maintenance/:id - Bakim kaydini guncelle
 */
const updateMaintenance = async (req, res) => {
  try {
    const record = await maintenanceService.updateMaintenance(
      req.params.id,
      req.user.userId,
      req.body
    );

    res.status(200).json({
      success: true,
      message: 'Bakim kaydi basariyla guncellendi',
      data: record
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * DELETE /api/maintenance/:id - Bakim kaydini sil
 */
const deleteMaintenance = async (req, res) => {
  try {
    const result = await maintenanceService.deleteMaintenance(req.params.id, req.user.userId);
    
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

/**
 * GET /api/maintenance/vehicle/:vehicleId/summary - Aracin bakim maliyet ozeti
 * BONUS ozellik
 */
const getMaintenanceSummary = async (req, res) => {
  try {
    const summary = await maintenanceService.getMaintenanceCostByVehicle(
      req.params.vehicleId,
      req.user.userId
    );

    res.status(200).json({
      success: true,
      data: summary
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getAllMaintenance,
  getMaintenanceByVehicle,
  getMaintenanceById,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
  getMaintenanceSummary
};