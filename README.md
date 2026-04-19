# Hotel Booking with Real-time Communication - FYP

A comprehensive hotel booking platform with real-time communication features built as a Final Year Project. This application allows guests to browse and book hotels, and property owners to manage their hotels, rooms, and bookings.

## 📋 Project Overview

This full-stack application consists of:
- **Backend:** Node.js + Express + MongoDB (REST API)
- **Frontend:** React + Vite + React Router (Single Page Application)

The system supports two main user roles:
- **Guests:** Can browse hotels, view rooms, and make bookings
- **Owners:** Can manage hotels, rooms, and approve/manage bookings

## 🏗️ Project Structure

```
Hotel-Booking-with-real-time-communication-FYP-/
├── my-backend/                 # Backend API
│   ├── server.js              # Express server entry point
│   ├── package.json           # Backend dependencies
│   ├── config/                # Configuration (Passport, etc.)
│   ├── Controllers/           # Business logic
│   ├── Models/                # MongoDB schemas
│   ├── routes/                # API routes
│   ├── Middlewares/           # Custom middlewares
│   └── uploads/               # File uploads directory
├── frontend/                   # React frontend
│   ├── package.json           # Frontend dependencies
│   ├── index.html             # HTML entry point
│   ├── vite.config.js         # Vite configuration
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── pages/             # Page components
│   │   ├── context/           # React Context
│   │   ├── hooks/             # Custom hooks
│   │   ├── services/          # API services
│   │   ├── styles/            # CSS files
│   │   ├── App.jsx            # Main app component
│   │   └── main.jsx           # Entry point
│   └── FRONTEND.md            # Frontend documentation
├── README.md                  # This file
└── package.json               # Root package.json (if exists)
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or cloud)
- A code editor (VS Code recommended)

### 1. Backend Setup

#### Step 1: Navigate to Backend Directory
```bash
cd my-backend
```

#### Step 2: Install Dependencies
```bash
npm install
```

#### Step 3: Create `.env` File
Create a `.env` file in the `my-backend` directory:
```
MONGO_URI=mongodb://localhost:27017/hotel-booking
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

#### Step 4: Start Backend Server
```bash
npm start
```
or
```bash
node server.js
```

Backend runs on `http://localhost:5000`

### 2. Frontend Setup

#### Step 1: Navigate to Frontend Directory
```bash
cd frontend
```

#### Step 2: Install Dependencies
```bash
npm install
```

#### Step 3: Start Development Server
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

## 📚 Features

### Guest User Features
✅ Browse all available hotels
✅ Search hotels by location or name  
✅ View hotel details and images
✅ Browse available rooms with pricing
✅ Make room bookings with date selection
✅ View booking history
✅ Cancel bookings
✅ Real-time price calculation
✅ Responsive mobile-friendly interface

### Owner User Features
✅ Create and manage hotels
✅ Add hotel descriptions and locations
✅ Manage room inventory
✅ Set room types and pricing
✅ View all bookings for hotels
✅ Approve or reject bookings
✅ Real-time inventory management
✅ Dashboard with statistics
✅ Booking analytics

## 🛠️ Technology Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT + Passport.js
- **File Upload:** Multer
- **API:** RESTful API
- **Middleware:** CORS, Cookie Parser

### Frontend
- **Framework:** React 19+
- **Build Tool:** Vite
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **State Management:** React Context API
- **Styling:** CSS3 with CSS Variables
- **Responsive:** Mobile-first design

## 🔌 API Endpoints

### Hotels
```
GET    /v1/hotels              - Get all hotels (public)
GET    /v1/hotels/:id          - Get hotel details
GET    /v1/hotels/my-hotels    - Get owner's hotels (protected)
POST   /v1/hotels              - Create hotel (owner only)
PUT    /v1/hotels/:id          - Update hotel (owner only)
DELETE /v1/hotels/:id          - Delete hotel (owner only)
POST   /v1/hotels/:id/upload-images - Upload hotel images (owner)
```

### Rooms
```
GET    /v1/rooms/:hotelId           - Get hotel's rooms (owner)
GET    /v1/rooms/:hotelId/:roomId   - Get room details (owner)
POST   /v1/rooms/:hotelId           - Create room (owner)
PUT    /v1/rooms/:hotelId/:roomId   - Update room (owner)
DELETE /v1/rooms/:hotelId/:roomId   - Delete room (owner)
POST   /v1/rooms/:hotelId/:roomId/upload-images - Upload room images (owner)
```

### Bookings
```
GET    /v1/bookings                 - Get user's bookings (guest)
GET    /v1/bookings/hotel/:hotelId  - Get hotel's bookings (owner)
POST   /v1/bookings                 - Create booking (guest)
PUT    /v1/bookings/:id/approve     - Approve booking (owner)
DELETE /v1/bookings/:id             - Cancel booking (guest)
```

### Authentication
```
POST   /auth/google   - Google OAuth authentication
```

## 📱 User Flows

### Guest User Flow
1. Login 
2. Browse hotels on home page
3. Search for specific location
4. Click on hotel to view details
5. Select room and dates
6. Complete booking
7. View bookings in "My Bookings"
8. Cancel booking if needed

### Owner User Flow
1. Login 
2. Go to Owner Dashboard
3. Create new hotel
4. Add hotel details
5. Manage rooms for the hotel
6. View incoming bookings
7. Approve or reject bookings
8. Monitor statistics

## 🔐 Authentication & Security

- **JWT Tokens:** Secure cookie-based authentication
- **Password Hashing:** Bcrypt for password security (ready to implement)
- **CORS:** Cross-origin requests configured
- **Role-based Access Control:** Different permissions for Guest/Owner roles
- **Protected Routes:** Frontend route protection with role checks
- **Input Validation:** Client and server-side validation

## 🎨 Frontend Styling

- **Color Scheme:**
  - Primary Blue: #3457dc
  - Secondary Red: #ff6b6b
  - Success Green: #51cf66
  - Warning Yellow: #ffd93d

- **Responsive Breakpoints:**
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px

- **Features:**
  - Smooth animations and transitions
  - Shadow effects for depth
  - Clean, modern UI design
  - Mobile-first responsive approach

## 🧪 Testing the Application



1. **Guest Account:**
   - Role: Guest
   - Can browse hotels and make bookings

2. **Owner Account:**
   - Role: Owner
   - Can manage hotels and bookings



## 📝 Database Models

### User
```javascript
{
  name: String,
  email: String,
  role: String (Guest/Owner/Admin),
  provider: String (google/facebook),
  provider_id: String,
  avatar: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Hotel
```javascript
{
  owner_id: ObjectId (User),
  name: String,
  description: String,
  location: String,
  images: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### Room
```javascript
{
  hotel_id: ObjectId (Hotel),
  type: String (Single/Double),
  price_per_night: Number,
  total_stock: Number,
  images: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### Booking
```javascript
{
  user_id: ObjectId (User),
  room_id: ObjectId (Room),
  hotel_id: ObjectId (Hotel),
  check_in: Date,
  check_out: Date,
  total_price: Number,
  status: String (Pending/Confirmed),
  createdAt: Date,
  updatedAt: Date
}
```

## 🐛 Error Handling

- **Frontend:** User-friendly error alerts and notifications
- **Backend:** Comprehensive error logging and validation
- **Network:** Graceful handling of connection failures
- **Validation:** Client and server-side input validation
- **Authentication:** Automatic redirect on token expiration

## 📈 Performance Optimizations

- Lazy loading for images
- Optimized bundle with Vite
- Efficient API calls with Axios
- React hooks for performance
- CSS variables for quick theming
- Responsive images and assets

## 🚀 Deployment

### Backend (e.g., Heroku, Railway, Render)
1. Set up MongoDB Atlas (cloud)
2. Configure environment variables
3. Deploy Node.js application
4. Update frontend API URL

### Frontend (e.g., Vercel, Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Configure environment for backend API URL

## 📚 Additional Documentation

- [Frontend Documentation](./frontend/FRONTEND.md) - Detailed frontend setup and features
- [Backend Documentation](./my-backend/README.md) - Backend architecture (if exists)

## 🤝 Contributing

This is a FYP (Final Year Project). Contributions should follow:
- Code style guidelines
- Proper commit messages
- testing requirements
- Documentation updates

## 📄 License

This project is part of a Final Year Project and may have specific academic license restrictions.

## 👥 Team & Contact

For questions or support regarding this project, please contact the development team or project supervisor.

## 📞 Troubleshooting

### Backend won't start
- Ensure MongoDB is running
- Check .env file configuration
- Verify Node.js version
- Check port 5000 is available

### Frontend won't connect to backend
- Ensure backend is running on port 5000
- Check CORS configuration in backend
- Verify API URL in frontend/src/services/api.js
- Check browser console for specific errors

### Database connection issues
- Verify MongoDB connection string
- Ensure MongoDB service is running
- Check MongoDB credentials
- Verify network access (if using MongoDB Atlas)

### Port conflicts
- Backend default: 5000
- Frontend default: 5173
- Change ports in configuration if needed

## 🎯 Future Enhancements

- [ ] Real-time chat/messaging between guests and owners
- [ ] Payment gateway integration
- [ ] Email notifications
- [ ] Advanced search filters
- [ ] User reviews and ratings
- [ ] Wishlist functionality
- [ ] Advanced analytics
- [ ] Mobile app (React Native)

---

**Status:** Under Development (FYP)
**Last Updated:** 2026
**Version:** 1.0.0-beta

