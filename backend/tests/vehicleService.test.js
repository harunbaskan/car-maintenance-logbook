// Vehicle modelini manuel mock'la (mongoose compile sorununu onler)
jest.mock('../src/models/Vehicle', () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  findOneAndUpdate: jest.fn(),
  findOneAndDelete: jest.fn()
}));

const Vehicle = require('../src/models/Vehicle');
const vehicleService = require('../src/services/vehicleService');

describe('vehicleService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllVehicles', () => {
    it('kullanicinin tum araclarini dondurmeli', async () => {
      const mockVehicles = [
        { _id: 'v1', make: 'BMW', userId: 'user123' },
        { _id: 'v2', make: 'Toyota', userId: 'user123' }
      ];

      Vehicle.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockVehicles)
      });

      const result = await vehicleService.getAllVehicles('user123');

      expect(result).toHaveLength(2);
      expect(Vehicle.find).toHaveBeenCalledWith({ userId: 'user123' });
    });
  });

  describe('getVehicleById', () => {
    it('arac bulunursa dondurmeli', async () => {
      const mockVehicle = { _id: 'v1', make: 'BMW', userId: 'user123' };
      Vehicle.findOne.mockResolvedValue(mockVehicle);

      const result = await vehicleService.getVehicleById('v1', 'user123');

      expect(result.make).toBe('BMW');
      expect(Vehicle.findOne).toHaveBeenCalledWith({ _id: 'v1', userId: 'user123' });
    });

    it('arac bulunamazsa hata firlatmali', async () => {
      Vehicle.findOne.mockResolvedValue(null);

      await expect(
        vehicleService.getVehicleById('yok', 'user123')
      ).rejects.toThrow('Arac bulunamadi veya bu araca erisim yetkiniz yok');
    });
  });

  describe('createVehicle', () => {
    it('yeni arac olusturmali', async () => {
      Vehicle.findOne.mockResolvedValue(null);
      const mockCreated = { _id: 'v1', make: 'BMW', plate: '34ABC123', userId: 'user123' };
      Vehicle.create.mockResolvedValue(mockCreated);

      const result = await vehicleService.createVehicle('user123', {
        make: 'BMW',
        model: 'M3',
        plate: '34abc123',
        year: 2022,
        currentKm: 25000,
        fuelType: 'Benzin'
      });

      expect(result.make).toBe('BMW');
      expect(Vehicle.create).toHaveBeenCalled();
    });

    it('ayni plaka varsa hata firlatmali', async () => {
      Vehicle.findOne.mockResolvedValue({ plate: '34ABC123' });

      await expect(
        vehicleService.createVehicle('user123', {
          plate: '34abc123',
          make: 'BMW',
          model: 'M3',
          year: 2022,
          currentKm: 25000,
          fuelType: 'Benzin'
        })
      ).rejects.toThrow('Bu plakayla kayitli baska aracin var');
    });
  });

  describe('updateVehicle', () => {
    it('arac guncellenmeli', async () => {
      const mockUpdated = { _id: 'v1', currentKm: 30000, userId: 'user123' };
      Vehicle.findOneAndUpdate.mockResolvedValue(mockUpdated);

      const result = await vehicleService.updateVehicle('v1', 'user123', { currentKm: 30000 });

      expect(result.currentKm).toBe(30000);
      expect(Vehicle.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: 'v1', userId: 'user123' },
        { currentKm: 30000 },
        { new: true, runValidators: true }
      );
    });

    it('arac bulunamazsa hata firlatmali', async () => {
      Vehicle.findOneAndUpdate.mockResolvedValue(null);

      await expect(
        vehicleService.updateVehicle('yok', 'user123', { currentKm: 30000 })
      ).rejects.toThrow('Arac bulunamadi veya bu araca erisim yetkiniz yok');
    });
  });

  describe('deleteVehicle', () => {
    it('arac silinmeli', async () => {
      Vehicle.findOneAndDelete.mockResolvedValue({ _id: 'v1', userId: 'user123' });

      const result = await vehicleService.deleteVehicle('v1', 'user123');

      expect(result.message).toBe('Arac silindi');
      expect(Vehicle.findOneAndDelete).toHaveBeenCalledWith({ _id: 'v1', userId: 'user123' });
    });

    it('arac bulunamazsa hata firlatmali', async () => {
      Vehicle.findOneAndDelete.mockResolvedValue(null);

      await expect(
        vehicleService.deleteVehicle('yok', 'user123')
      ).rejects.toThrow('Arac bulunamadi veya bu araca erisim yetkiniz yok');
    });
  });
});