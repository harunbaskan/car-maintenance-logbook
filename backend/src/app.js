const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

// Route'lari import et

const authRoutes = require('./routes/authRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');


const app = express();

// Middleware'ler
app.use(cors());
app.use(express.json());

// Ana sayfa
app.get('/', (req, res) => {
  res.json({ 
    message: 'Car Maintenance Logbook API calisiyor',
    status: 'OK' 
  });
});
// Swagger UI - API dokumantasyonu
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Auth route'lari
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/maintenance', maintenanceRoutes);
// Middleware'i import et
const authMiddleware = require('./middleware/authMiddleware');

// Korumali test endpoint'i
app.get('/api/profile', authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: 'Profil bilgisi (korumali endpoint)',
    user: req.user
  });
});
module.exports = app;