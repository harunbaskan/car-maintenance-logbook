const mongoose = require('mongoose');

const maintenanceRecordSchema = new mongoose.Schema(
  {
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: [true, 'vehicleId gerekli']
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'userId gerekli']
    },
    type: {
      type: String,
      enum: {
        values: [
          'Yag degisimi',
          'Lastik degisimi',
          'Fren bakimi',
          'Aku degisimi',
          'Periyodik bakim',
          'Muayene',
          'Sigorta',
          'Kasko',
          'Diger'
        ],
        message: 'Bakim tipi gecersiz'
      },
      required: [true, 'Bakim tipi gerekli']
    },
    date: {
      type: Date,
      required: [true, 'Bakim tarihi gerekli'],
      default: Date.now
    },
    kmAtService: {
      type: Number,
      required: [true, 'Bakim sirasindaki km gerekli'],
      min: [0, 'Kilometre 0 veya pozitif olmali']
    },
    cost: {
      type: Number,
      required: [true, 'Maliyet gerekli'],
      min: [0, 'Maliyet 0 veya pozitif olmali']
    },
    serviceName: {
      type: String,
      trim: true,
      maxlength: [100, 'Servis adi en fazla 100 karakter olabilir']
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notlar en fazla 500 karakter olabilir']
    }
  },
  {
    timestamps: true
  }
);

// Performans icin index (sik kullanilan sorgular)
maintenanceRecordSchema.index({ vehicleId: 1, date: -1 });
maintenanceRecordSchema.index({ userId: 1, date: -1 });

const MaintenanceRecord = mongoose.model('MaintenanceRecord', maintenanceRecordSchema);

module.exports = MaintenanceRecord;