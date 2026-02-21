# SmartMove Backend

Node.js + Express + MongoDB API for the SmartMove car rental platform.

## Features

- JWT authentication and role-based access (user/admin)
- Car listing with filters and Cloudinary image uploads
- Booking lifecycle management with availability sync
- Review module for cars
- Admin analytics dashboard with aggregation pipelines

## Installation

```bash
npm install
```

## Run (Development)

```bash
npm run dev
```

## Seed Data

```bash
node seed.js
```

## Environment Variables

Create `.env` in `smartmove-backend`:

```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/smartmove
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

- `PORT`: Express server port
- `MONGO_URI`: MongoDB Atlas/local connection string
- `JWT_SECRET`: Secret key used to sign JWT tokens
- `JWT_EXPIRES_IN`: JWT expiration (example: `7d`)
- `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Cloudinary API key
- `CLOUDINARY_API_SECRET`: Cloudinary API secret

## MongoDB Setup

1. Create a MongoDB Atlas cluster or start a local MongoDB server.
2. Create a database named `smartmove` (Atlas creates it on first write).
3. Copy your connection string and set `MONGO_URI`.
4. Start backend server and optionally run `node seed.js`.

## API Endpoints

### Auth

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register user |
| POST | `/api/auth/login` | Public | Login and receive JWT |

### Cars

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/cars` | Public | List cars with optional `type`, `fuel`, `minPrice`, `maxPrice` |
| GET | `/api/cars/:id` | Public | Get single car |
| POST | `/api/cars` | Admin | Add car (multipart image upload) |
| PUT | `/api/cars/:id` | Admin | Update car and optionally replace image |
| DELETE | `/api/cars/:id` | Admin | Delete car and Cloudinary image |

### Bookings

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/bookings` | User | Create booking |
| GET | `/api/bookings/my` | User | Get current user bookings |
| PUT | `/api/bookings/:id/cancel` | User | Cancel own booking |

### Reviews

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/reviews` | User | Add or update review for a car |
| GET | `/api/reviews/car/:carId` | Public | List reviews for one car |

### Admin

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/admin/dashboard` | Admin | Dashboard stats, revenue, fleet utilization |
| GET | `/api/admin/bookings` | Admin | All bookings with user and car details |
| PUT | `/api/admin/bookings/:id/status` | Admin | Update booking status |
| GET | `/api/admin/users` | Admin | List users without passwords |
| PATCH | `/api/admin/users/:id/toggle` | Admin | Toggle active/inactive user |
# smartmovebackend
