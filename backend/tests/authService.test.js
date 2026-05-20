const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../src/models/User');
const authService = require('../src/services/authService');

// Modulleri mock'la (taklit et)
jest.mock('../src/models/User');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('authService', () => {
  // Her testten once mock'lari temizle
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test_secret';
    process.env.JWT_EXPIRES_IN = '7d';
  });

  describe('registerUser', () => {
    it('yeni kullanici basariyla olusturulmali', async () => {
      // Hazirlik
      User.findOne.mockResolvedValue(null); // Var olan kullanici yok
      bcrypt.hash.mockResolvedValue('hashed_password');
      User.create.mockResolvedValue({
        _id: 'user123',
        username: 'harun',
        email: 'harun@test.com',
        createdAt: new Date()
      });

      // Calistir
      const result = await authService.registerUser({
        username: 'harun',
        email: 'harun@test.com',
        password: '123456'
      });

      // Kontrol et
      expect(result.username).toBe('harun');
      expect(result.email).toBe('harun@test.com');
      expect(result.password).toBeUndefined(); // Sifre donmemeli!
      expect(bcrypt.hash).toHaveBeenCalledWith('123456', 10);
    });

    it('email zaten kayitliysa hata firlatmali', async () => {
      // Var olan kullanici dondur
      User.findOne.mockResolvedValue({
        email: 'harun@test.com',
        username: 'baska'
      });

      // Hata bekle
      await expect(
        authService.registerUser({
          username: 'harun',
          email: 'harun@test.com',
          password: '123456'
        })
      ).rejects.toThrow('Bu email zaten kayitli');
    });

    it('username zaten kullaniliyorsa hata firlatmali', async () => {
      User.findOne.mockResolvedValue({
        email: 'baska@test.com',
        username: 'harun'
      });

      await expect(
        authService.registerUser({
          username: 'harun',
          email: 'yeni@test.com',
          password: '123456'
        })
      ).rejects.toThrow('Bu username zaten kullaniliyor');
    });
  });

  describe('loginUser', () => {
    it('dogru bilgilerle giris basarili olmali ve token donmeli', async () => {
      User.findOne.mockResolvedValue({
        _id: 'user123',
        username: 'harun',
        email: 'harun@test.com',
        password: 'hashed_password'
      });
      bcrypt.compare.mockResolvedValue(true); // Sifre dogru
      jwt.sign.mockReturnValue('fake_jwt_token');

      const result = await authService.loginUser({
        email: 'harun@test.com',
        password: '123456'
      });

      expect(result.token).toBe('fake_jwt_token');
      expect(result.user.username).toBe('harun');
      expect(result.user.email).toBe('harun@test.com');
    });

    it('kullanici bulunamazsa hata firlatmali', async () => {
      User.findOne.mockResolvedValue(null);

      await expect(
        authService.loginUser({
          email: 'yok@test.com',
          password: '123456'
        })
      ).rejects.toThrow('Email veya sifre hatali');
    });

    it('sifre yanlissa hata firlatmali', async () => {
      User.findOne.mockResolvedValue({
        _id: 'user123',
        email: 'harun@test.com',
        password: 'hashed_password'
      });
      bcrypt.compare.mockResolvedValue(false); // Sifre yanlis

      await expect(
        authService.loginUser({
          email: 'harun@test.com',
          password: 'yanlis'
        })
      ).rejects.toThrow('Email veya sifre hatali');
    });
  });
});