const jwt = require('jsonwebtoken');

/**
 * JWT token'i dogrulayan middleware
 * Korumali endpoint'lerde kullanilir
 */
const authMiddleware = (req, res, next) => {
  try {
    // Authorization header'ini al: "Bearer <token>"
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token gerekli. Lutfen giris yapin.'
      });
    }

    // "Bearer " kismini cikar, sadece token kalsin
    const token = authHeader.split(' ')[1];

    // Token'i dogrula
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Kullanici bilgisini req'e ekle (sonraki middleware/controller kullanir)
    req.user = {
      userId: decoded.userId,
      username: decoded.username
    };

    // Sonraki adima gec
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Gecersiz veya suresi dolmus token'
    });
  }
};

module.exports = authMiddleware;