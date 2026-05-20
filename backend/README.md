# Car Maintenance Logbook - Backend API

A RESTful API for tracking vehicle maintenance. Users can manage their vehicles and maintenance records. JWT authentication ensures each user can only access their own data.

## Tech Stack

- **Node.js** + **Express** - Backend framework
- **MongoDB** + **Mongoose** - Database and ODM
- **JWT (jsonwebtoken)** - Authentication
- **bcryptjs** - Password hashing
- **Joi** - Input validation
- **Jest** - Unit testing
- **Swagger** - API documentation

## Project Structure
backend/
├── src/
│   ├── config/          # Database and Swagger configuration
│   ├── models/          # Mongoose schemas (User, Vehicle, MaintenanceRecord)
│   ├── services/        # Business logic - the unit-tested layer
│   ├── controllers/     # HTTP request/response handling
│   ├── routes/          # API endpoint definitions
│   ├── middleware/      # JWT auth middleware
│   ├── validators/      # Joi validation schemas
│   └── app.js           # Express app setup
├── tests/               # Jest unit tests
├── server.js            # Entry point
└── package.json
## Architecture

The project uses a **layered architecture**:
Business logic is kept in the **services** layer, so it can be unit tested independently of the routes.

## Installation

### Prerequisites

- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB)

### Steps

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file (use `.env.example` as a reference):
PORT=3000
MONGODB_URI=mongodb://user:password@host:27017/car-logbook?...
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
3. Start the server:

```bash
npm start
```

Development mode (auto-restart):

```bash
npm run dev
```

The server runs at `http://localhost:3000`.

## API Documentation (Swagger)

While the server is running, interactive API documentation is available at:
http://localhost:3000/api-docs
All endpoints can be tested via Swagger UI. For protected endpoints, first log in to get a token, then enter it using the "Authorize" button.

## API Endpoints

### Auth

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Login (returns JWT token) | No |

### Vehicles

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/vehicles` | List all vehicles | Yes |
| GET | `/api/vehicles/:id` | Get a single vehicle | Yes |
| POST | `/api/vehicles` | Create a new vehicle | Yes |
| PUT | `/api/vehicles/:id` | Update a vehicle | Yes |
| DELETE | `/api/vehicles/:id` | Delete a vehicle | Yes |

### Maintenance

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/maintenance` | List all maintenance records | Yes |
| GET | `/api/maintenance/vehicle/:vehicleId` | Get maintenance for a vehicle | Yes |
| GET | `/api/maintenance/vehicle/:vehicleId/summary` | Cost summary | Yes |
| GET | `/api/maintenance/:id` | Get a single record | Yes |
| POST | `/api/maintenance/vehicle/:vehicleId` | Create a record | Yes |
| PUT | `/api/maintenance/:id` | Update a record | Yes |
| DELETE | `/api/maintenance/:id` | Delete a record | Yes |

## Usage Example

### 1. Register

```bash
POST /api/auth/register
Content-Type: application/json

{
  "username": "harun",
  "email": "harun@test.com",
  "password": "123456"
}
```

### 2. Login (get token)

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "harun@test.com",
  "password": "123456"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "user": { "id": "...", "username": "harun", "email": "harun@test.com" },
    "token": "eyJhbGc..."
  }
}
```

### 3. Create a vehicle (with token)

```bash
POST /api/vehicles
Authorization: Bearer eyJhbGc...
Content-Type: application/json

{
  "make": "BMW",
  "model": "M3",
  "year": 2022,
  "plate": "34ABC123",
  "currentKm": 25000,
  "fuelType": "Benzin"
}
```

## Data Isolation

All vehicle and maintenance endpoints require a JWT token. Every query is filtered by the user's `userId`. This ensures a user can only view and manage their own vehicles and maintenance records. Access to another user's data is not possible.

## Testing

Run unit tests with:

```bash
npm test
```

Tests cover the business logic in the **services** layer (auth and vehicle services). The database is mocked, so the tests run fast and in isolation.

## Validation

Inputs are validated in two layers:

1. **Joi** (validators) - Before the request reaches the controller
2. **Mongoose** (models) - Before writing to the database

## Author

Harun Başkan - System Analysis and Design - Spring 2026