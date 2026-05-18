const authService = require('../services/authService');

/**
 * POST /api/auth/register
 */
const register = async (req, res) => {
  try {
    const newUser = await authService.registerUser(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Kullanici basariyla kayit edildi',
      data: newUser
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * POST /api/auth/login
 */
const login = async (req, res) => {
  try {
    const result = await authService.loginUser(req.body);
    
    res.status(200).json({
      success: true,
      message: 'Giris basarili',
      data: result
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  register,
  login
};