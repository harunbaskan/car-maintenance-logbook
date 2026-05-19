const Joi = require('joi');

const allowedTypes = [
  'Yag degisimi',
  'Lastik degisimi',
  'Fren bakimi',
  'Aku degisimi',
  'Periyodik bakim',
  'Muayene',
  'Sigorta',
  'Kasko',
  'Diger'
];

// Yeni bakim kaydi olusturmak icin sema
const createMaintenanceSchema = Joi.object({
  type: Joi.string()
    .valid(...allowedTypes)
    .required()
    .messages({
      'any.only': `Bakim tipi: ${allowedTypes.join(', ')} olmali`,
      'any.required': 'Bakim tipi gerekli'
    }),

  date: Joi.date()
    .iso()
    .max('now')
    .required()
    .messages({
      'date.base': 'Gecersiz tarih',
      'date.max': 'Tarih gelecekte olamaz',
      'any.required': 'Tarih gerekli'
    }),

  kmAtService: Joi.number()
    .integer()
    .min(0)
    .required()
    .messages({
      'number.base': 'Kilometre sayi olmali',
      'number.min': 'Kilometre 0 veya pozitif olmali',
      'any.required': 'Kilometre gerekli'
    }),

  cost: Joi.number()
    .min(0)
    .required()
    .messages({
      'number.base': 'Maliyet sayi olmali',
      'number.min': 'Maliyet 0 veya pozitif olmali',
      'any.required': 'Maliyet gerekli'
    }),

  serviceName: Joi.string()
    .trim()
    .max(100)
    .allow('')
    .messages({
      'string.max': 'Servis adi en fazla 100 karakter olabilir'
    }),

  notes: Joi.string()
    .trim()
    .max(500)
    .allow('')
    .messages({
      'string.max': 'Notlar en fazla 500 karakter olabilir'
    })
});

// Guncelleme icin sema (alanlar opsiyonel)
const updateMaintenanceSchema = Joi.object({
  type: Joi.string().valid(...allowedTypes),
  date: Joi.date().iso().max('now'),
  kmAtService: Joi.number().integer().min(0),
  cost: Joi.number().min(0),
  serviceName: Joi.string().trim().max(100).allow(''),
  notes: Joi.string().trim().max(500).allow('')
}).min(1).messages({
  'object.min': 'En az bir alan guncellenmelidir'
});

// Reusable validate middleware
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
  validateCreateMaintenance: validate(createMaintenanceSchema),
  validateUpdateMaintenance: validate(updateMaintenanceSchema)
};