const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Car Maintenance Logbook API',
      version: '1.0.0',
      description: 'Arac bakim takip sistemi REST API. JWT authentication ile kullaniciya ozel veri yonetimi.',
      contact: {
        name: 'Harun Baskan'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token girin. Login endpoint\'inden aldiginiz token.'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '6a0b66be4e8df636ef45f544' },
            username: { type: 'string', example: 'harun' },
            email: { type: 'string', example: 'harun@test.com' }
          }
        },
        Vehicle: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '6a0cb8f7a70bf98759e10f8c' },
            userId: { type: 'string', example: '6a0b66be4e8df636ef45f544' },
            make: { type: 'string', example: 'BMW' },
            model: { type: 'string', example: 'M3' },
            year: { type: 'number', example: 2022 },
            plate: { type: 'string', example: '34ABC123' },
            currentKm: { type: 'number', example: 25000 },
            fuelType: { type: 'string', example: 'Benzin' }
          }
        },
        MaintenanceRecord: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '6a0cbc576e81ee609199ff43' },
            vehicleId: { type: 'string', example: '6a0cb8f7a70bf98759e10f8c' },
            userId: { type: 'string', example: '6a0b66be4e8df636ef45f544' },
            type: { type: 'string', example: 'Yag degisimi' },
            date: { type: 'string', format: 'date', example: '2024-03-15' },
            kmAtService: { type: 'number', example: 78000 },
            cost: { type: 'number', example: 800 },
            serviceName: { type: 'string', example: 'Hizli Servis' },
            notes: { type: 'string', example: '5W30 motor yagi' }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js'] // JSDoc yorumlarinin bulundugu dosyalar
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;