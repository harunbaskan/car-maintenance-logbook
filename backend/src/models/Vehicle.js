const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'userId gerekli']
    },
    make: {
      type: String,
      required: [true, 'Marka gerekli'],
      trim: true,
      maxlength: [50, 'Marka en fazla 50 karakter olabilir']
    },
    model: {
      type: String,
      required: [true, 'Model gerekli'],
      trim: true,
      maxlength: [50, 'Model en fazla 50 karakter olabilir']
    },
    year: {
      type: Number,
      required: [true, 'Yil gerekli'],
      min: [1900, 'Yil 1900 veya sonrasi olmali'],
      max: [new Date().getFullYear() + 1, 'Yil gelecek yildan buyuk olamaz']
    },
    plate: {
      type: String,
      required: [true, 'Plaka gerekli'],
      trim: true,
      uppercase: true,
      maxlength: [20, 'Plaka en fazla 20 karakter olabilir']
    },
    currentKm: {
      type: Number,
      required: [true, 'Guncel kilometre gerekli'],
      min: [0, 'Kilometre 0 veya pozitif olmali']
    },
    fuelType: {
      type: String,
      enum: {
        values: ['Benzin', 'Dizel', 'LPG', 'Elektrik', 'Hibrit'],
        message: 'Yakit tipi gecersiz'
      },
      required: [true, 'Yakit tipi gerekli']
    }
  },
  {
    timestamps: true
  }
);

// Ayni kullanici ayni plakayi iki kez ekleyemesin (ama farkli kullanicilar olabilir)
vehicleSchema.index({ userId: 1, plate: 1 }, { unique: true });

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;