const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Yeni kullanici kaydet
 * @param {Object} userData - { username, email, password }
 * @returns {Object} - Olusturulan kullanici (sifre haric)
 */
const registerUser = async (userData) => {
  const { username, email, password } = userData;

  // Email veya username daha once kayitli mi kontrol et
  const existingUser = await User.findOne({
    $or: [{ email }, { username }]
  });

  if (existingUser) {
    if (existingUser.email === email) {
      throw new Error('Bu email zaten kayitli');
    }
    throw new Error('Bu username zaten kullaniliyor');
  }

  // Sifreyi hash'le (10 = salt rounds, guvenlik seviyesi)
  const hashedPassword = await bcrypt.hash(password, 10);

  // Yeni kullaniciyi olustur
  const newUser = await User.create({
    username,
    email,
    password: hashedPassword
  });

  // Sifreyi cevaba dahil etme
  return {
    id: newUser._id,
    username: newUser.username,
    email: newUser.email,
    createdAt: newUser.createdAt
  };
};

/**
 * Kullanici girisi yap
 * @param {Object} loginData - { email, password }
 * @returns {Object} - { user, token }
 */
const loginUser = async (loginData) => {
  const { email, password } = loginData;

  // Kullaniciyi email ile bul
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('Email veya sifre hatali');
  }

  // Sifreyi karsilastir
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Email veya sifre hatali');
  }

  // JWT token olustur
  const token = jwt.sign(
    { userId: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  return {
    user: {
      id: user._id,
      username: user.username,
      email: user.email
    },
    token
  };
};

module.exports = {
  registerUser,
  loginUser
};