const Vehicle = require('../models/Vehicle');

/**
 * Bir kullanicinin tum araclarini getir
 * @param {String} userId - Sahibinin ID'si
 * @returns {Array} - Araclar listesi
 */
const getAllVehicles = async (userId) => {
  const vehicles = await Vehicle.find({ userId }).sort({ createdAt: -1 });
  return vehicles;
};

/**
 * Tek bir aracin detayini getir (sahip kontrolu ile)
 * @param {String} vehicleId - Arac ID
 * @param {String} userId - Sahibinin ID'si
 * @returns {Object} - Arac
 */
const getVehicleById = async (vehicleId, userId) => {
  const vehicle = await Vehicle.findOne({ _id: vehicleId, userId });

  if (!vehicle) {
    throw new Error('Arac bulunamadi veya bu araca erisim yetkiniz yok');
  }

  return vehicle;
};

/**
 * Yeni arac olustur
 * @param {String} userId - Sahibinin ID'si
 * @param {Object} vehicleData - { make, model, year, plate, currentKm, fuelType }
 * @returns {Object} - Olusturulan arac
 */
const createVehicle = async (userId, vehicleData) => {
  // Ayni kullanicinin ayni plakayla baska araci var mi?
  const existing = await Vehicle.findOne({
    userId,
    plate: vehicleData.plate.toUpperCase()
  });

  if (existing) {
    throw new Error('Bu plakayla kayitli baska aracin var');
  }

  const vehicle = await Vehicle.create({ ...vehicleData, userId });
  return vehicle;
};

/**
 * Arac bilgilerini guncelle (sahip kontrolu ile)
 * @param {String} vehicleId - Arac ID
 * @param {String} userId - Sahibinin ID'si
 * @param {Object} updateData - Guncellenecek alanlar
 * @returns {Object} - Guncellenmis arac
 */
const updateVehicle = async (vehicleId, userId, updateData) => {
  const vehicle = await Vehicle.findOneAndUpdate(
    { _id: vehicleId, userId },
    updateData,
    { new: true, runValidators: true }
  );

  if (!vehicle) {
    throw new Error('Arac bulunamadi veya bu araca erisim yetkiniz yok');
  }

  return vehicle;
};

/**
 * Arac sil (sahip kontrolu ile)
 * @param {String} vehicleId - Arac ID
 * @param {String} userId - Sahibinin ID'si
 * @returns {Object} - Silinen arac bilgisi
 */
const deleteVehicle = async (vehicleId, userId) => {
  const vehicle = await Vehicle.findOneAndDelete({ _id: vehicleId, userId });

  if (!vehicle) {
    throw new Error('Arac bulunamadi veya bu araca erisim yetkiniz yok');
  }

  return { id: vehicle._id, message: 'Arac silindi' };
};

module.exports = {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle
};