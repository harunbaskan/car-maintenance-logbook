const mongoose = require('mongoose');

// User şemasını tanımla
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username gerekli'],
      unique: true,
      trim: true,
      minlength: [3, 'Username en az 3 karakter olmali'],
      maxlength: [30, 'Username en fazla 30 karakter olabilir']
    },
    email: {
      type: String,
      required: [true, 'Email gerekli'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Gecerli bir email girin'
      ]
    },
    password: {
      type: String,
      required: [true, 'Sifre gerekli'],
      minlength: [6, 'Sifre en az 6 karakter olmali']
    }
  },
  {
    timestamps: true // createdAt ve updatedAt otomatik eklenir
  }
);

// Modeli olustur ve disa aktar
const User = mongoose.model('User', userSchema);

module.exports = User;