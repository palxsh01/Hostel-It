# Campus Peer-to-Peer Delivery Platform - Complete Development Specification

## Project Overview
Build a web-based peer-to-peer delivery platform for college campus where students can send items to other students using fellow students as delivery partners. The platform operates entirely within campus boundaries with building-level location granularity.

---

## Technical Stack

### Frontend
- **Framework**: React.js
- **Routing**: React Router v6
- **State Management**: Redux Toolkit / Context API
- **Maps Integration**: Google Maps JavaScript API or Mapbox GL JS
- **Real-time Updates**: Socket.io Client
- **HTTP Client**: Axios
- **UI Framework**: Material-UI / Tailwind CSS
- **Form Handling**: React Hook Form
- **Notifications**: React Toastify

### Backend
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time Communication**: Socket.io
- **API Architecture**: RESTful API
- **File Upload**: Multer (for profile pictures/ID verification)
- **SMS/OTP**: Twilio API or MSG91
- **Environment Variables**: dotenv
- **Security**: Helmet.js, express-rate-limit, bcrypt

### Development Tools
- **Package Manager**: npm or yarn
- **Version Control**: Git
- **Code Quality**: ESLint, Prettier
- **API Testing**: Postman
- **Development Server**: nodemon

---

## System Architecture

### User Roles
1. **Customer** - Students placing delivery requests
2. **Delivery Partner** - Students fulfilling deliveries
3. **Admin** (optional for MVP) - Platform management

### Core Entities

#### 1. User Model
```javascript
{
  _id: ObjectId,
  phoneNumber: String (unique, indexed),
  name: String,
  email: String (college email, unique),
  gender: Enum ['male', 'female', 'other'],
  collegeId: String,
  profilePicture: String (URL),
  role: Enum ['customer', 'delivery_partner', 'both'],
  isVerified: Boolean,
  walletBalance: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

#### 2. Location Model (Predefined Campus Buildings)
```javascript
{
  _id: ObjectId,
  buildingName: String,
  buildingCode: String (e.g., "BH1", "LIB", "ADMIN"),
  category: Enum ['hostel_male', 'hostel_female', 'academic', 'administrative', 'other'],
  coordinates: {
    latitude: Number,
    longitude: Number
  },
  isActive: Boolean
}
```

#### 3. Order Model
```javascript
{
  _id: ObjectId,
  customerId: ObjectId (ref: User),
  deliveryPartnerId: ObjectId (ref: User) [null initially],
  pickupLocation: ObjectId (ref: Location),
  dropoffLocation: ObjectId (ref: Location),
  isHeavyItem: Boolean (> 1.5kg),
  customerPhone: String,
  customerInstructions: String (optional),
  
  pricing: {
    baseDeliveryFee: Number,
    surgePricing: Number (multiplier, e.g., 1.5),
    heavyItemFee: Number,
    totalFee: Number
  },
  
  status: Enum [
    'pending',           // Order placed, waiting for partner
    'accepted',          // Partner accepted
    'picked_up',         // Partner picked up item
    'in_transit',        // On the way to dropoff
    'delivered',         // Successfully delivered
    'cancelled'          // Cancelled by customer/system
  ],
  
  timeline: {
    placedAt: Date,
    acceptedAt: Date,
    pickedUpAt: Date,
    deliveredAt: Date,
    cancelledAt: Date
  },
  
  deliveryPartnerLocation: {
    latitude: Number,
    longitude: Number,
    lastUpdated: Date
  },
  
  paymentStatus: Enum ['pending', 'completed'],
  paymentMethod: 'COD',
  
  createdAt: Date,
  updatedAt: Date
}
```

#### 4. Delivery Partner Profile Model
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  isOnline: Boolean,
  
  locationFilters: {
    preferredPickupLocations: [ObjectId] (refs: Location),
    preferredDropoffLocations: [ObjectId] (refs: Location)
  },
  
  stats: {
    totalDeliveries: Number,
    totalEarnings: Number,
    averageRating: Number,
    completionRate: Number
  },
  
  currentLocation: {
    latitude: Number,
    longitude: Number,
    lastUpdated: Date
  },
  
  isAvailable: Boolean (not on active delivery),
  activeOrderId: ObjectId (ref: Order) [null if available]
}
```

#### 5. Surge Pricing Model
```javascript
{
  _id: ObjectId,
  surgeFactor: Number (e.g., 1.0, 1.5, 2.0),
  isActive: Boolean,
  reason: String (e.g., "High demand", "Low partner availability"),
  startTime: Date,
  endTime: Date,
  createdBy: String (admin/system),
  createdAt: Date
}
```

---

## API Endpoints Specification

### Authentication APIs

#### POST `/api/auth/send-otp`
```json
Request: {
  "phoneNumber": "9876543210"
}
Response: {
  "success": true,
  "message": "OTP sent successfully",
  "otpId": "temp_otp_identifier"
}
```

#### POST `/api/auth/verify-otp`
```json
Request: {
  "phoneNumber": "9876543210",
  "otp": "123456",
  "otpId": "temp_otp_identifier"
}
Response: {
  "success": true,
  "token": "jwt_token_here",
  "user": { user_object },
  "isNewUser": false
}
```

#### POST `/api/auth/register`
```json
Request: {
  "phoneNumber": "9876543210",
  "name": "John Doe",
  "email": "john@college.edu.in",
  "gender": "male",
  "collegeId": "CS2021001",
  "role": "both"
}
Response: {
  "success": true,
  "token": "jwt_token_here",
  "user": { user_object }
}
```

---

### Location APIs

#### GET `/api/locations`
```json
Response: {
  "success": true,
  "locations": [
    {
      "_id": "loc_id_1",
      "buildingName": "Boys Hostel 1",
      "buildingCode": "BH1",
      "category": "hostel_male",
      "coordinates": { "latitude": 12.345, "longitude": 78.901 }
    },
    // ... more locations
  ]
}
```

#### GET `/api/locations/pickup`
Query params: `?userGender=male`
```json
Response: {
  "success": true,
  "locations": [ /* all accessible pickup locations */ ]
}
```

#### GET `/api/locations/dropoff`
Query params: `?userGender=female&partnerGender=female`
```json
Response: {
  "success": true,
  "locations": [ /* filtered dropoff locations based on gender constraints */ ]
}
```

---

### Order APIs (Customer)

#### POST `/api/orders/create`
```json
Request: {
  "pickupLocationId": "loc_id_1",
  "dropoffLocationId": "loc_id_2",
  "isHeavyItem": true,
  "customerInstructions": "Fragile item, handle with care"
}
Response: {
  "success": true,
  "order": { order_object },
  "estimatedFee": 35,
  "message": "Order placed successfully"
}
```

#### GET `/api/orders/my-orders`
Query params: `?status=pending&page=1&limit=10`
```json
Response: {
  "success": true,
  "orders": [ /* array of user's orders */ ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalOrders": 25
  }
}
```

#### GET `/api/orders/:orderId`
```json
Response: {
  "success": true,
  "order": { 
    /* full order details with populated pickup/dropoff locations */
    "deliveryPartnerLocation": { "latitude": 12.345, "longitude": 78.901 }
  }
}
```

#### PUT `/api/orders/:orderId/cancel`
```json
Request: {
  "reason": "Changed my mind"
}
Response: {
  "success": true,
  "message": "Order cancelled successfully"
}
```

---

### Order APIs (Delivery Partner)

#### GET `/api/delivery/available-orders`
Query params: `?pickupFilter=loc_id_1,loc_id_2&dropoffFilter=loc_id_3`
```json
Response: {
  "success": true,
  "orders": [
    /* filtered orders matching partner's preferences and gender constraints */
  ],
  "currentSurgeFactor": 1.5
}
```

#### POST `/api/delivery/accept-order`
```json
Request: {
  "orderId": "order_id_123"
}
Response: {
  "success": true,
  "order": { order_object },
  "message": "Order accepted successfully"
}
```

#### PUT `/api/delivery/update-status`
```json
Request: {
  "orderId": "order_id_123",
  "status": "picked_up"
}
Response: {
  "success": true,
  "order": { updated_order_object }
}
```

#### POST `/api/delivery/update-location`
```json
Request: {
  "orderId": "order_id_123",
  "latitude": 12.345,
  "longitude": 78.901
}
Response: {
  "success": true,
  "message": "Location updated"
}
```

#### POST `/api/delivery/complete-delivery`
```json
Request: {
  "orderId": "order_id_123",
  "paymentReceived": true
}
Response: {
  "success": true,
  "message": "Delivery completed",
  "earnings": 24.50
}
```

---

### Delivery Partner Profile APIs

#### GET `/api/delivery/profile`
```json
Response: {
  "success": true,
  "profile": {
    "isOnline": true,
    "locationFilters": { /* preferences */ },
    "stats": { /* delivery stats */ }
  }
}
```

#### PUT `/api/delivery/toggle-online`
```json
Request: {
  "isOnline": true
}
Response: {
  "success": true,
  "isOnline": true
}
```

#### PUT `/api/delivery/update-filters`
```json
Request: {
  "preferredPickupLocations": ["loc_id_1", "loc_id_2"],
  "preferredDropoffLocations": ["loc_id_3", "loc_id_4"]
}
Response: {
  "success": true,
  "filters": { updated_filters }
}
```

#### GET `/api/delivery/earnings`
Query params: `?startDate=2025-11-01&endDate=2025-11-05`
```json
Response: {
  "success": true,
  "totalEarnings": 450,
  "deliveryCount": 18,
  "breakdown": [
    { "date": "2025-11-01", "earnings": 90, "deliveries": 3 },
    // ... more days
  ]
}
```

---

### Admin APIs (Optional for MVP)

#### GET `/api/admin/surge-pricing`
```json
Response: {
  "success": true,
  "currentSurge": { surge_object }
}
```

#### POST `/api/admin/surge-pricing/update`
```json
Request: {
  "surgeFactor": 1.5,
  "reason": "High demand during lunch hours"
}
Response: {
  "success": true,
  "surge": { new_surge_object }
}
```

#### GET `/api/admin/analytics`
```json
Response: {
  "success": true,
  "stats": {
    "totalOrders": 1250,
    "activePartners": 45,
    "averageDeliveryTime": 12,
    "revenue": 18750
  }
}
```

---

## Frontend Architecture

### Page Structure

#### 1. Authentication Pages
- **Login Page** (`/login`)
  - Phone number input
  - OTP input screen
  - Redirect to registration if new user

- **Registration Page** (`/register`)
  - Name, email, gender, college ID
  - Role selection (customer/delivery partner/both)
  - Profile picture upload

#### 2. Customer Dashboard Pages
- **Home Page** (`/`)
  - Quick order placement form
    - Pickup location dropdown
    - Dropoff location dropdown
    - Heavy item checkbox (> 1.5kg)
    - Estimated delivery fee display
    - Place Order button
  - Active orders section
  - Order history

- **Track Order Page** (`/track/:orderId`)
  - Live map with delivery partner location
  - Order status timeline
  - Delivery partner details (name, phone)
  - ETA display
  - Cancel order button (if status = pending/accepted)

- **Order History Page** (`/orders`)
  - List of all past orders
  - Filter by status
  - Order details view

#### 3. Delivery Partner Dashboard Pages
- **Partner Home Page** (`/partner`)
  - Online/Offline toggle
  - Available orders list (filtered based on preferences)
  - Current active delivery status
  - Today's earnings summary

- **Order Request Details** (`/partner/order/:orderId`)
  - Pickup and dropoff location details
  - Item weight indicator
  - Delivery fee amount
  - Accept/Reject buttons
  - Navigation to pickup location

- **Active Delivery Page** (`/partner/active-delivery`)
  - Map with route to dropoff location
  - Update status buttons:
    - "Picked Up Item"
    - "Mark as Delivered"
  - Customer contact button
  - Real-time location sharing

- **Earnings Page** (`/partner/earnings`)
  - Daily/weekly/monthly earnings
  - Delivery count
  - Average earnings per delivery
  - Withdrawal options (future feature)

- **Settings Page** (`/partner/settings`)
  - Location filters (multi-select dropdowns)
    - Preferred pickup buildings
    - Preferred dropoff buildings
  - Availability preferences

#### 4. Common Pages
- **Profile Page** (`/profile`)
  - View/edit user details
  - Logout

---

## Key Frontend Components

### 1. LocationSelector Component
```jsx
<LocationSelector
  label="Pickup Location"
  locations={filteredLocations}
  selectedLocation={pickupLocation}
  onChange={handleLocationChange}
  userGender={user.gender}
  filterType="pickup"
/>
```

### 2. LiveMap Component
```jsx
<LiveMap
  pickupCoords={order.pickupLocation.coordinates}
  dropoffCoords={order.dropoffLocation.coordinates}
  deliveryPartnerCoords={order.deliveryPartnerLocation}
  showRoute={true}
/>
```

### 3. OrderCard Component
```jsx
<OrderCard
  order={orderData}
  showActions={true}
  onCancel={handleCancel}
  onTrack={handleTrack}
/>
```

### 4. OrderStatusTimeline Component
```jsx
<OrderStatusTimeline
  status={order.status}
  timeline={order.timeline}
/>
```

### 5. PricingDisplay Component
```jsx
<PricingDisplay
  baseFee={15}
  surgeFactor={1.5}
  isHeavyItem={true}
  heavyItemFee={10}
  totalFee={32.50}
/>
```

---

## Backend Implementation Details

### 1. Gender-Based Order Filtering Logic

```javascript
// Middleware: filterOrdersByGenderConstraints
async function filterOrdersByGenderConstraints(orders, deliveryPartnerGender) {
  const filteredOrders = [];
  
  for (const order of orders) {
    const dropoffLocation = await Location.findById(order.dropoffLocation);
    
    // Gender constraint check
    const isAllowed = checkGenderAccess(
      deliveryPartnerGender,
      dropoffLocation.category
    );
    
    if (isAllowed) {
      filteredOrders.push(order);
    }
  }
  
  return filteredOrders;
}

function checkGenderAccess(partnerGender, locationCategory) {
  // Women partners cannot deliver to men's hostels
  if (partnerGender === 'female' && locationCategory === 'hostel_male') {
    return false;
  }
  
  // Men partners cannot deliver to women's hostels
  if (partnerGender === 'male' && locationCategory === 'hostel_female') {
    return false;
  }
  
  return true;
}
```

### 2. Surge Pricing Calculation

```javascript
function calculateDeliveryFee(isHeavyItem, currentSurgeFactor) {
  const BASE_FEE = 15; // Base delivery fee in INR
  const HEAVY_ITEM_FEE = 10; // Extra fee for items > 1.5kg
  
  let totalFee = BASE_FEE * currentSurgeFactor;
  
  if (isHeavyItem) {
    totalFee += HEAVY_ITEM_FEE;
  }
  
  return {
    baseDeliveryFee: BASE_FEE,
    surgePricing: currentSurgeFactor,
    heavyItemFee: isHeavyItem ? HEAVY_ITEM_FEE : 0,
    totalFee: Math.round(totalFee * 100) / 100 // Round to 2 decimals
  };
}

// Get current surge factor (can be automated based on demand/supply)
async function getCurrentSurgeFactor() {
  const activeSurge = await SurgePricing.findOne({
    isActive: true,
    startTime: { $lte: new Date() },
    endTime: { $gte: new Date() }
  });
  
  return activeSurge ? activeSurge.surgeFactor : 1.0;
}
```

### 3. Real-time Location Tracking (Socket.io)

```javascript
// Server-side socket events
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // Delivery partner joins order room
  socket.on('join_order', (orderId) => {
    socket.join(`order_${orderId}`);
  });
  
  // Delivery partner sends location update
  socket.on('update_location', async (data) => {
    const { orderId, latitude, longitude } = data;
    
    // Update in database
    await Order.findByIdAndUpdate(orderId, {
      deliveryPartnerLocation: {
        latitude,
        longitude,
        lastUpdated: new Date()
      }
    });
    
    // Broadcast to customer in same room
    io.to(`order_${orderId}`).emit('location_updated', {
      latitude,
      longitude,
      timestamp: new Date()
    });
  });
  
  // Order status update
  socket.on('status_update', async (data) => {
    const { orderId, status } = data;
    
    io.to(`order_${orderId}`).emit('order_status_changed', {
      status,
      timestamp: new Date()
    });
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});
```

### 4. Order Matching Algorithm

```javascript
async function findAvailableOrders(deliveryPartnerId) {
  const partner = await DeliveryPartnerProfile.findOne({
    userId: deliveryPartnerId
  });
  
  const user = await User.findById(deliveryPartnerId);
  
  // Get pending orders
  let query = {
    status: 'pending',
    deliveryPartnerId: null
  };
  
  // Apply location filters if set
  if (partner.locationFilters.preferredPickupLocations.length > 0) {
    query.pickupLocation = {
      $in: partner.locationFilters.preferredPickupLocations
    };
  }
  
  if (partner.locationFilters.preferredDropoffLocations.length > 0) {
    query.dropoffLocation = {
      $in: partner.locationFilters.preferredDropoffLocations
    };
  }
  
  let orders = await Order.find(query)
    .populate('pickupLocation dropoffLocation customerId')
    .sort({ createdAt: -1 });
  
  // Apply gender constraints
  orders = await filterOrdersByGenderConstraints(orders, user.gender);
  
  return orders;
}
```

### 5. Order Cancellation Policy

```javascript
async function cancelOrder(orderId, userId) {
  const order = await Order.findById(orderId);
  
  // Check if user is the customer
  if (order.customerId.toString() !== userId.toString()) {
    throw new Error('Unauthorized');
  }
  
  // Cannot cancel if already picked up
  if (['picked_up', 'in_transit', 'delivered'].includes(order.status)) {
    throw new Error('Cannot cancel order after pickup');
  }
  
  // If delivery partner already accepted, notify them
  if (order.deliveryPartnerId) {
    // Send notification to delivery partner
    await notifyDeliveryPartner(order.deliveryPartnerId, 'Order cancelled');
    
    // Make delivery partner available again
    await DeliveryPartnerProfile.findOneAndUpdate(
      { userId: order.deliveryPartnerId },
      { isAvailable: true, activeOrderId: null }
    );
  }
  
  order.status = 'cancelled';
  order.timeline.cancelledAt = new Date();
  await order.save();
  
  return order;
}
```

---

## Security & Validation

### 1. Input Validation
- Phone number: 10 digits, Indian format
- Email: Valid college domain
- College ID: Alphanumeric format
- Gender: Enum validation
- Location IDs: Must exist in database
- OTP: 6 digits, expires in 5 minutes

### 2. Authentication Middleware
```javascript
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};
```

### 3. Rate Limiting
- OTP requests: 3 per phone number per hour
- Order placement: 10 per user per hour
- API calls: 100 per IP per 15 minutes

### 4. Data Sanitization
- Escape HTML in user inputs
- Validate coordinates are within campus bounds
- Sanitize file uploads

---

## Database Indexes

```javascript
// User indexes
User.index({ phoneNumber: 1 }, { unique: true });
User.index({ email: 1 }, { unique: true });

// Order indexes
Order.index({ customerId: 1, status: 1 });
Order.index({ deliveryPartnerId: 1, status: 1 });
Order.index({ status: 1, createdAt: -1 });
Order.index({ pickupLocation: 1, dropoffLocation: 1 });

// Location indexes
Location.index({ category: 1 });
Location.index({ buildingCode: 1 }, { unique: true });

// Delivery Partner Profile indexes
DeliveryPartnerProfile.index({ userId: 1 }, { unique: true });
DeliveryPartnerProfile.index({ isOnline: 1, isAvailable: 1 });
```

---

## Environment Variables (.env)

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/campus_delivery
MONGODB_URI_PROD=mongodb+srv://user:password@cluster.mongodb.net/campus_delivery

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# OTP Service (Twilio/MSG91)
OTP_SERVICE=twilio
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Google Maps API
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# CORS
CLIENT_URL=http://localhost:3000

# File Upload
MAX_FILE_SIZE=5242880

# Pricing
BASE_DELIVERY_FEE=15
HEAVY_ITEM_FEE=10
DEFAULT_SURGE_FACTOR=1.0
```

---

## Testing Requirements

### Unit Tests
- Authentication flow (OTP generation, verification)
- Order creation and validation
- Gender constraint filtering
- Surge pricing calculation
- Location filtering logic

### Integration Tests
- Complete order flow (create → accept → pickup → deliver)
- Real-time location updates
- Order cancellation scenarios
- Delivery partner filtering

### API Tests (Postman Collection)
- All REST endpoints
- Error handling
- Authentication validation
- Rate limiting

---

## Deployment Checklist

### Frontend Deployment
1. Build React app: `npm run build`
2. Deploy to Vercel/Netlify
3. Configure environment variables
4. Set up custom domain (optional)

### Backend Deployment
1. Deploy to Heroku/Railway/DigitalOcean
2. Configure MongoDB Atlas connection
3. Set environment variables
4. Enable HTTPS
5. Configure CORS for frontend domain

### Database Setup
1. Create MongoDB Atlas cluster
2. Set up database user with read/write permissions
3. Whitelist deployment server IP
4. Create initial location data

---

## Initial Data Seeding

### Sample Locations (buildings.json)
```json
[
  {
    "buildingName": "Boys Hostel 1",
    "buildingCode": "BH1",
    "category": "hostel_male",
    "coordinates": { "latitude": 12.9716, "longitude": 77.5946 }
  },
  {
    "buildingName": "Girls Hostel 1",
    "buildingCode": "GH1",
    "category": "hostel_female",
    "coordinates": { "latitude": 12.9726, "longitude": 77.5956 }
  },
  {
    "buildingName": "Library Block",
    "buildingCode": "LIB",
    "category": "academic",
    "coordinates": { "latitude": 12.9736, "longitude": 77.5966 }
  },
  {
    "buildingName": "Computer Science Department",
    "buildingCode": "CSE",
    "category": "academic",
    "coordinates": { "latitude": 12.9746, "longitude": 77.5976 }
  },
  {
    "buildingName": "Admin Block",
    "buildingCode": "ADMIN",
    "category": "administrative",
    "coordinates": { "latitude": 12.9756, "longitude": 77.5986 }
  }
]
```

---

## Development Phases

### Phase 1: Core Setup (Week 1)
- [ ] Initialize MERN project structure
- [ ] Set up MongoDB models
- [ ] Implement authentication (OTP flow)
- [ ] Create location seed data
- [ ] Build basic REST API endpoints

### Phase 2: Customer Features (Week 2)
- [ ] Customer registration/login
- [ ] Order creation flow
- [ ] Location selection UI
- [ ] Basic order tracking
- [ ] Order history page

### Phase 3: Delivery Partner Features (Week 3)
- [ ] Delivery partner registration
- [ ] Available orders list with filters
- [ ] Order acceptance flow
- [ ] Status update functionality
- [ ] Earnings tracking

### Phase 4: Real-time Features (Week 4)
- [ ] Socket.io integration
- [ ] Live location tracking
- [ ] Real-time order status updates
- [ ] Map integration (Google Maps/Mapbox)
- [ ] Push notifications

### Phase 5: Advanced Features (Week 5)
- [ ] Gender-based filtering implementation
- [ ] Surge pricing system
- [ ] Location preference filters
- [ ] Analytics dashboard (admin)
- [ ] Error handling and validation

### Phase 6: Testing & Deployment (Week 6)
- [ ] Unit and integration tests
- [ ] API testing
- [ ] Security audit
- [ ] Performance optimization
- [ ] Production deployment

---

## Success Metrics to Track

1. **User Metrics**
   - Total registered users
   - Customer vs delivery partner ratio
   - Active daily users

2. **Order Metrics**
   - Total orders placed
   - Order completion rate
   - Average delivery time
   - Cancellation rate

3. **Financial Metrics**
   - Total revenue
   - Average order value
   - Delivery partner earnings

4. **Performance Metrics**
   - Average response time for orders
   - Partner acceptance rate
   - Customer satisfaction (future: ratings)

---

## Future Enhancements (Post-MVP)

1. **Payment Integration**
   - UPI integration
   - Digital wallet
   - Automatic settlement to delivery partners

2. **Rating System**
   - Customer rates delivery partner
   - Delivery partner rates customer

3. **Scheduled Deliveries**
   - Book delivery for specific time
   - Recurring deliveries

4. **Push Notifications**
   - Order updates
   - New order alerts for partners
   - Promotional notifications

5. **Advanced Analytics**
   - Heatmap of popular routes
   - Peak time analysis
   - Partner performance dashboard

6. **Referral System**
   - Referral codes
   - Rewards for inviting friends

7. **Multi-campus Support**
   - Scale to multiple colleges
   - Campus-specific configuration

---

## Contact & Support

**Developer Guidelines:**
- Follow REST API conventions
- Use meaningful commit messages
- Write modular, reusable code
- Comment complex logic
- Follow React best practices
- Maintain consistent code style

**Documentation:**
- Maintain API documentation (Swagger/Postman)
- Update README with setup instructions
- Document environment variables
- Create user guides for customers and delivery partners

---

## Project File Structure

```
campus-delivery-platform/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── orderController.js
│   │   ├── deliveryController.js
│   │   └── locationController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── validation.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Order.js
│   │   ├── Location.js
│   │   ├── DeliveryPartnerProfile.js
│   │   └── SurgePricing.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── deliveryRoutes.js
│   │   └── locationRoutes.js
│   ├── utils/
│   │   ├── otpService.js
│   │   ├── pricingCalculator.js
│   │   └── genderFilter.js
│   ├── socket/
│   │   └── socketHandler.js
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   └── Loader.jsx
│   │   │   ├── customer/
│   │   │   │   ├── OrderForm.jsx
│   │   │   │   ├── OrderCard.jsx
│   │   │   │   └── TrackingMap.jsx
│   │   │   ├── delivery/
│   │   │   │   ├── AvailableOrders.jsx
│   │   │   │   ├── ActiveDelivery.jsx
│   │   │   │   └── LocationFilters.jsx
│   │   │   └── shared/
│   │   │       ├── LocationSelector.jsx
│   │   │       ├── StatusTimeline.jsx
│   │   │       └── PricingDisplay.jsx
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Register.jsx
│   │   │   ├── customer/
│   │   │   │   ├── Home.jsx
│   │   │   │   ├── TrackOrder.jsx
│   │   │   │   └── OrderHistory.jsx
│   │   │   ├── delivery/
│   │   │   │   ├── PartnerHome.jsx
│   │   │   │   ├── ActiveDelivery.jsx
│   │   │   │   ├── Earnings.jsx
│   │   │   │   └── Settings.jsx
│   │   │   └── Profile.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── SocketContext.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── orderService.js
│   │   │   └── deliveryService.js
│   │   ├── utils/
│   │   │   ├── constants.js
│   │   │   └── helpers.js
│   │   ├── App.jsx
│   │   ├── index.js
│   │   └── App.css
│   ├── .env
│   └── package.json
│
└── README.md
```

---

## Getting Started Commands

### Backend Setup
```bash
cd backend
npm install
npm install express mongoose dotenv jsonwebtoken bcryptjs socket.io cors helmet express-rate-limit twilio
npm install -D nodemon
npm run dev
```

### Frontend Setup
```bash
cd frontend
npx create-react-app .
npm install axios react-router-dom socket.io-client react-hook-form react-toastify @mui/material @emotion/react @emotion/styled
npm start
```

---

**This specification provides a complete blueprint for building the campus peer-to-peer delivery platform. Follow the phased approach, implement security best practices, and maintain code quality throughout development.**
