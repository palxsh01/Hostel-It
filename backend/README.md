## Hostel-It Backend (Express + MongoDB)

### Setup

1. Install dependencies:

```
cd backend
npm install
```

2. Create an `.env` file in `backend` with:

```
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/hostel_it
NODE_ENV=development
```

3. Run the server:

```
npm run dev
```

Health check: `GET http://localhost:4000/health`

### Data Models

- Driver: geospatial `location` (Point), `isAvailable`, metadata
- Order: `pickup` and `dropoff` with geo, `items`, `status`, `driverId`, `declinedBy`

### REST API

- POST `/api/orders`
  - Body: `{ customerId, pickup:{address?, geo:{type:'Point', coordinates:[lng,lat]}}, dropoff:{...}, items, totalAmount, paymentMethod }`
  - Response: `{ order, nearbyDrivers }`

- GET `/api/orders/:orderId`
- GET `/api/orders?customerId=...` (order history)
- POST `/api/orders/:orderId/status` with `{ status: 'picked_up' | 'delivered' | 'cancelled' }`

- POST `/api/drivers/location`
  - Body: `{ driverId?, name?, phone?, vehicle?, isAvailable?, location:{ coordinates:[lng,lat] } }`
  - Upserts driver and updates geolocation

- GET `/api/drivers/:driverId/nearby-orders?maxDistance=5000`
  - Returns pending orders near driver, excluding ones previously rejected

- POST `/api/drivers/:driverId/orders/:orderId/accept`
  - Concurrency-safe accept; 409 if already accepted

- POST `/api/drivers/:driverId/orders/:orderId/reject`
  - Marks order as declined by this driver

### Notes

- Uses MongoDB 2dsphere index for proximity search
- CORS enabled; JSON bodies limited to 1MB
- Extend statuses as needed (`picked_up`, `delivered`, etc.)

