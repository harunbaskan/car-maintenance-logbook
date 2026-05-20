# Car Maintenance Logbook

Final project for the System Analysis and Design course.

A full-stack web application where users can manage their vehicles and maintenance records. JWT authentication provides user-specific data isolation.

## Features

- User registration and login (JWT)
- User-specific data isolation (each user sees only their own data)
- Vehicle management (CRUD)
- Maintenance record management (CRUD)
- Filtering by maintenance type
- Maintenance cost summary (MongoDB aggregation)
- Interactive API documentation with Swagger
- Unit tests (Jest)

## Tech Stack

- **Backend:** Node.js + Express
- **Database:** MongoDB Atlas (Mongoose ODM)
- **Authentication:** JWT (JSON Web Token)
- **Validation:** Joi
- **Testing:** Jest
- **API Documentation:** Swagger UI
- **Frontend:** Vanilla JavaScript (SPA)

## Project Structure
car-maintenance-logbook/
├── backend/        # Node.js + Express API
│   └── README.md   # Detailed backend documentation
└── frontend/       # Vanilla JS SPA
├── index.html      # Login/Register
├── dashboard.html  # Main application
├── css/
└── js/
## Quick Start

### Backend

```bash
cd backend
npm install
# Create a .env file (see .env.example)
npm start
```

API: `http://localhost:3000`
Swagger: `http://localhost:3000/api-docs`

For detailed setup, see: [backend/README.md](backend/README.md)

### Frontend

Open `frontend/index.html` in your browser. The backend must be running.

## Testing

```bash
cd backend
npm test
```

## Author

Harun Başkan - System Analysis and Design - Spring 2026