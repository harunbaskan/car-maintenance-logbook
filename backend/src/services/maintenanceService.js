const MaintenanceRecord = require('../models/MaintenanceRecord');
const Vehicle = require('../models/Vehicle');

/**
 * Yardimci fonksiyon: Aracin kullaniciya ait olup olmadigini kontrol et
 */
const verifyVehicleOwnership = async (vehicleId, userId) => {
  const vehicle = await Vehicle.findOne({ _id: vehicleId, userId });
  if (!vehicle) {
    throw new Error('Arac bulunamadi veya bu araca erisim yetkiniz yok');
  }
  return vehicle;
};

/**
 * Bir aracin tum bakim kayitlarini getir
 */
const getMaintenanceByVehicle = async (vehicleId, userId, filters = {}) => {
  // Once araca erisim kontrolu
  await verifyVehicleOwnership(vehicleId, userId);

  // Sorgu olustur
  const query = { vehicleId, userId };

  // Filtreleme: Tip ile filtrele
  if (filters.type) {
    query.type = filters.type;
  }

  const records = await MaintenanceRecord.find(query).sort({ date: -1 });
  return records;
};

/**
 * Kullanicinin tum bakim kayitlarini getir (tum araclar)
 */
const getAllMaintenanceByUser = async (userId, filters = {}) => {
  const query = { userId };

  if (filters.type) {
    query.type = filters.type;
  }

  const records = await MaintenanceRecord.find(query)
    .populate('vehicleId', 'make model plate')
    .sort({ date: -1 });
  
  return records;
};

/**
 * Tek bir bakim kaydinin detayini getir
 */
const getMaintenanceById = async (recordId, userId) => {
  const record = await MaintenanceRecord.findOne({ _id: recordId, userId })
    .populate('vehicleId', 'make model plate year');

  if (!record) {
    throw new Error('Bakim kaydi bulunamadi veya bu kayda erisim yetkiniz yok');
  }

  return record;
};

/**
 * Yeni bakim kaydi olustur
 */
const createMaintenance = async (vehicleId, userId, recordData) => {
  // Once aracin sahibi olup olmadigini kontrol et
  await verifyVehicleOwnership(vehicleId, userId);

  const record = await MaintenanceRecord.create({
    ...recordData,
    vehicleId,
    userId
  });

  return record;
};

/**
 * Bakim kaydini guncelle
 */
const updateMaintenance = async (recordId, userId, updateData) => {
  const record = await MaintenanceRecord.findOneAndUpdate(
    { _id: recordId, userId },
    updateData,
    { new: true, runValidators: true }
  );

  if (!record) {
    throw new Error('Bakim kaydi bulunamadi veya bu kayda erisim yetkiniz yok');
  }

  return record;
};

/**
 * Bakim kaydini sil
 */
const deleteMaintenance = async (recordId, userId) => {
  const record = await MaintenanceRecord.findOneAndDelete({ _id: recordId, userId });

  if (!record) {
    throw new Error('Bakim kaydi bulunamadi veya bu kayda erisim yetkiniz yok');
  }

  return { id: record._id, message: 'Bakim kaydi silindi' };
};

/**
 * Aracin toplam bakim maliyetini hesapla
 * BONUS OZELLIK: Hocanin istegi - "ekstra ozellik"
 */
const getMaintenanceCostByVehicle = async (vehicleId, userId) => {
  await verifyVehicleOwnership(vehicleId, userId);

  const result = await MaintenanceRecord.aggregate([
    {
      $match: {
        vehicleId: new (require('mongoose').Types.ObjectId)(vehicleId),
        userId: new (require('mongoose').Types.ObjectId)(userId)
      }
    },
    {
      $group: {
        _id: '$type',
        totalCost: { $sum: '$cost' },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { totalCost: -1 }
    }
  ]);

  const grandTotal = result.reduce((sum, item) => sum + item.totalCost, 0);

  return {
    byType: result,
    grandTotal,
    totalRecords: result.reduce((sum, item) => sum + item.count, 0)
  };
};

module.exports = {
  getMaintenanceByVehicle,
  getAllMaintenanceByUser,
  getMaintenanceById,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
  getMaintenanceCostByVehicle
};