const Joi = require('joi');

// Yeni arac olusturmak icin sema
const createVehicleSchema = Joi.object({
  make: Joi.string()
    .trim()
    .min(1)
    .max(50)
    .required()
    .messages({
      'string.empty': 'Marka bos olamaz',
      'string.max': 'Marka en fazla 50 karakter olabilir',
      'any.required': 'Marka gerekli'
    }),

  model: Joi.string()
    .trim()
    .min(1)
    .max(50)
    .required()
    .messages({
      'string.empty': 'Model bos olamaz',
      'string.max': 'Model en fazla 50 karakter olabilir',
      'any.required': 'Model gerekli'
    }),

  year: Joi.number()
    .integer()
    .min(1900)
    .max(new Date().getFullYear() + 1)
    .required()
    .messages({
      'number.base': 'Yil sayi olmali',
      'number.min': 'Yil 1900 veya sonrasi olmali',
      'number.max': 'Yil gelecek yildan buyuk olamaz',
      'any.required': 'Yil gerekli'
    }),

  plate: Joi.string()
    .trim()
    .min(1)
    .max(20)
    .required()
    .messages({
      'string.empty': 'Plaka bos olamaz',
      'string.max': 'Plaka en fazla 20 karakter olabilir',
      'any.required': 'Plaka gerekli'
    }),

  currentKm: Joi.number()
    .integer()
    .min(0)
    .required()
    .messages({
      'number.base': 'Kilometre sayi olmali',
      'number.min': 'Kilometre 0 veya pozitif olmali',
      'any.required': 'Kilometre gerekli'
    }),

  fuelType: Joi.string()
    .valid('Benzin', 'Dizel', 'LPG', 'Elektrik', 'Hibrit')
    .required()
    .messages({
      'any.only': 'Yakit tipi: Benzin, Dizel, LPG, Elektrik veya Hibrit olmali',
      'any.required': 'Yakit tipi gerekli'
    })
});

// Guncelleme icin sema (tum alanlar opsiyonel ama en az biri gerekli)
const updateVehicleSchema = Joi.object({
  make: Joi.string().trim().min(1).max(50),
  model: Joi.string().trim().min(1).max(50),
  year: Joi.number().integer().min(1900).max(new Date().getFullYear() + 1),
  plate: Joi.string().trim().min(1).max(20),
  currentKm: Joi.number().integer().min(0),
  fuelType: Joi.string().valid('Benzin', 'Dizel', 'LPG', 'Elektrik', 'Hibrit')
}).min(1).messages({
  'object.min': 'En az bir alan guncellenmelidir'
});

/**
 * Joi semasi ile veriyi dogrula
 * @param {Object} schema - Joi semasi
 * @returns {Function} - Express middleware
 */
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map(detail => detail.message);
      return res.status(400).json({
        success: false,
        message: 'Validation hatasi',
        errors
      });
    }

    next();
  };
};

module.exports = {
  validateCreateVehicle: validate(createVehicleSchema),
  validateUpdateVehicle: validate(updateVehicleSchema)
};