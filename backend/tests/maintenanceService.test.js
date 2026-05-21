// Modelleri manuel mock'la (mongoose compile sorununu onler)
jest.mock('../src/models/MaintenanceRecord', () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  findOneAndUpdate: jest.fn(),
  findOneAndDelete: jest.fn(),
  aggregate: jest.fn()
}));

jest.mock('../src/models/Vehicle', () => ({
  findOne: jest.fn()
}));

const MaintenanceRecord = require('../src/models/MaintenanceRecord');
const Vehicle = require('../src/models/Vehicle');
const maintenanceService = require('../src/services/maintenanceService');

describe('maintenanceService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getMaintenanceByVehicle', () => {
    it('arac sahibiyse bakim kayitlarini dondurmeli', async () => {
      Vehicle.findOne.mockResolvedValue({ _id: 'veh1', userId: 'user123' });
      const mockRecords = [
        { _id: 'm1', type: 'Yag degisimi', cost: 800 },
        { _id: 'm2', type: 'Lastik degisimi', cost: 4500 }
      ];
      MaintenanceRecord.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockRecords)
      });

      const result = await maintenanceService.getMaintenanceByVehicle('veh1', 'user123');

      expect(result).toHaveLength(2);
      expect(Vehicle.findOne).toHaveBeenCalledWith({ _id: 'veh1', userId: 'user123' });
    });

    it('arac sahibi degilse hata firlatmali', async () => {
      Vehicle.findOne.mockResolvedValue(null);

      await expect(
        maintenanceService.getMaintenanceByVehicle('veh1', 'user123')
      ).rejects.toThrow('Arac bulunamadi veya bu araca erisim yetkiniz yok');
    });

    it('tip filtresi uygulanmali', async () => {
      Vehicle.findOne.mockResolvedValue({ _id: 'veh1', userId: 'user123' });
      const sortMock = jest.fn().mockResolvedValue([]);
      MaintenanceRecord.find.mockReturnValue({ sort: sortMock });

      await maintenanceService.getMaintenanceByVehicle('veh1', 'user123', { type: 'Yag degisimi' });

      expect(MaintenanceRecord.find).toHaveBeenCalledWith({
        vehicleId: 'veh1',
        userId: 'user123',
        type: 'Yag degisimi'
      });
    });
  });

  describe('getMaintenanceById', () => {
    it('kayit bulunursa dondurmeli', async () => {
      const mockRecord = { _id: 'm1', type: 'Yag degisimi' };
      MaintenanceRecord.findOne.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockRecord)
      });

      const result = await maintenanceService.getMaintenanceById('m1', 'user123');

      expect(result.type).toBe('Yag degisimi');
      expect(MaintenanceRecord.findOne).toHaveBeenCalledWith({ _id: 'm1', userId: 'user123' });
    });

    it('kayit bulunamazsa hata firlatmali', async () => {
      MaintenanceRecord.findOne.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null)
      });

      await expect(
        maintenanceService.getMaintenanceById('yok', 'user123')
      ).rejects.toThrow('Bakim kaydi bulunamadi veya bu kayda erisim yetkiniz yok');
    });
  });

  describe('createMaintenance', () => {
    it('arac sahibiyse yeni kayit olusturmali', async () => {
      Vehicle.findOne.mockResolvedValue({ _id: 'veh1', userId: 'user123' });
      const mockCreated = { _id: 'm1', type: 'Yag degisimi', vehicleId: 'veh1', userId: 'user123' };
      MaintenanceRecord.create.mockResolvedValue(mockCreated);

      const result = await maintenanceService.createMaintenance('veh1', 'user123', {
        type: 'Yag degisimi',
        date: '2024-03-15',
        kmAtService: 78000,
        cost: 800
      });

      expect(result.type).toBe('Yag degisimi');
      expect(MaintenanceRecord.create).toHaveBeenCalled();
    });

    it('arac sahibi degilse hata firlatmali', async () => {
      Vehicle.findOne.mockResolvedValue(null);

      await expect(
        maintenanceService.createMaintenance('veh1', 'user123', { type: 'Yag degisimi' })
      ).rejects.toThrow('Arac bulunamadi veya bu araca erisim yetkiniz yok');
    });
  });

  describe('updateMaintenance', () => {
    it('kayit guncellenmeli', async () => {
      const mockUpdated = { _id: 'm1', cost: 900 };
      MaintenanceRecord.findOneAndUpdate.mockResolvedValue(mockUpdated);

      const result = await maintenanceService.updateMaintenance('m1', 'user123', { cost: 900 });

      expect(result.cost).toBe(900);
      expect(MaintenanceRecord.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: 'm1', userId: 'user123' },
        { cost: 900 },
        { new: true, runValidators: true }
      );
    });

    it('kayit bulunamazsa hata firlatmali', async () => {
      MaintenanceRecord.findOneAndUpdate.mockResolvedValue(null);

      await expect(
        maintenanceService.updateMaintenance('yok', 'user123', { cost: 900 })
      ).rejects.toThrow('Bakim kaydi bulunamadi veya bu kayda erisim yetkiniz yok');
    });
  });

  describe('deleteMaintenance', () => {
    it('kayit silinmeli', async () => {
      MaintenanceRecord.findOneAndDelete.mockResolvedValue({ _id: 'm1' });

      const result = await maintenanceService.deleteMaintenance('m1', 'user123');

      expect(result.message).toBe('Bakim kaydi silindi');
      expect(MaintenanceRecord.findOneAndDelete).toHaveBeenCalledWith({ _id: 'm1', userId: 'user123' });
    });

    it('kayit bulunamazsa hata firlatmali', async () => {
      MaintenanceRecord.findOneAndDelete.mockResolvedValue(null);

      await expect(
        maintenanceService.deleteMaintenance('yok', 'user123')
      ).rejects.toThrow('Bakim kaydi bulunamadi veya bu kayda erisim yetkiniz yok');
    });
  });
});