# Hotel Booking Frontend

A modern, responsive React frontend for the Hotel Booking with Real-time Communication application. Built with Vite, React Router, and Axios with comprehensive error handling and user-friendly UI.

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.jsx              # Navigation bar with auth links
│   │   ├── Loading.jsx             # Loading spinner
│   │   ├── ErrorAlert.jsx          # Error message display
│   │   ├── SuccessAlert.jsx        # Success message display
│   │   ├── HotelCard.jsx           # Hotel card component
│   │   ├── RoomCard.jsx            # Room card component
│   │   ├── BookingCard.jsx         # Booking card component
│   │   └── ProtectedRoute.jsx      # Route protection with role checks
│   ├── context/             # React Context for state management
│   │   └── AuthContext.jsx         # Authentication context
│   ├── hooks/               # Custom React hooks
│   │   └── useAuth.js              # Auth context hook
│   ├── pages/               # Page components
│   │   ├── Login.jsx               # Login/authentication page
│   │   ├── Home.jsx                # Hotels listing (public)
│   │   ├── HotelDetails.jsx        # Hotel details & booking
│   │   ├── MyBookings.jsx          # User bookings page
│   │   ├── HotelManagement.jsx     # Owner hotel management
│   │   ├── RoomManagement.jsx      # Owner room management
│   │   └── OwnerDashboard.jsx      # Owner dashboard
│   ├── services/            # API service layer
│   │   └── api.js                  # Axios instance & API calls
│   ├── styles/              # CSS stylesheets
│   │   ├── Navbar.css
│   │   ├── Loading.css
│   │   ├── ErrorAlert.css
│   │   ├── SuccessAlert.css
│   │   ├── HotelCard.css
│   │   ├── RoomCard.css
│   │   ├── BookingCard.css
│   │   ├── Login.css
│   │   ├── Home.css
│   │   ├── HotelDetails.css
│   │   ├── HotelManagement.css
│   │   ├── RoomManagement.css
│   │   ├── MyBookings.css
│   │   └── OwnerDashboard.css
│   ├── App.jsx              # Main app component with routing
│   ├── App.css              # Global styles
│   ├── main.jsx             # React entry point
│   └── index.css            # Base styles & CSS variables
├── public/                  # Static assets
├── index.html               # HTML template
├── package.json             # Dependencies
├── vite.config.js          # Vite configuration
└── eslint.config.js        # ESLint configuration
```

## 🚀 Features

### User Roles & Features

#### **Guest Users**
- Browse all available hotels
- Search hotels by location or name
- View hotel details and available rooms
- Make room bookings with date selection
- View and manage their bookings
- Cancel pending bookings
- Real-time price calculation

#### **Owner Users**
- Create and manage hotels
- Add descriptions and locations to hotels
- Create and manage rooms for each hotel
- Set room types (Single/Double) and pricing
- Manage room inventory
- View all bookings for their hotels
- Approve pending bookings
- Dashboard with booking statistics
- Real-time inventory management (stock decreases on booking)

#### **Features**
- ✅ Authentication with local storage persistence
- ✅ Error handling with user-friendly alerts
- ✅ Success notifications for actions
- ✅ Loading states for async operations
- ✅ Protected routes with role-based access control
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Clean, modern UI with consistent styling
- ✅ Search and filter functionality
- ✅ Date picker for bookings
- ✅ Price calculations
- ✅ Form validation
- ✅ Smooth animations and transitions

## 📦 Dependencies

- **react** (^19.2.4) - UI library
- **react-dom** (^19.2.4) - React DOM rendering
- **react-router-dom** - Client-side routing
- **axios** - HTTP client for API calls

## 🛠️ Installation & Setup

### Install Dependencies
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Runs on `http://localhost:5173`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Lint Code
```bash
npm run lint
```

## 🔌 API Integration

The frontend connects to the backend API at `http://localhost:5000`. All API calls are made through the `api.js` service with:

- **Axios instance** with base URL configuration
- **Request interceptors** for cookie-based authentication
- **Response interceptors** for automatic error handling and token validation
- **Organized API methods** grouped by feature (hotels, rooms, bookings)

### API Endpoints Used

**Hotels:**
- `GET /v1/hotels` - Get all hotels (public)
- `GET /v1/hotels/:id` - Get hotel details
- `GET /v1/hotels/my-hotels` - Get owner's hotels
- `POST /v1/hotels` - Create hotel (owner)
- `PUT /v1/hotels/:id` - Update hotel (owner)
- `DELETE /v1/hotels/:id` - Delete hotel (owner)

**Rooms:**
- `POST /v1/rooms/:hotelId` - Create room (owner)
- `GET /v1/rooms/:hotelId` - Get hotel's rooms (owner)
- `GET /v1/rooms/:hotelId/:roomId` - Get room details (owner)
- `PUT /v1/rooms/:hotelId/:roomId` - Update room (owner)
- `DELETE /v1/rooms/:hotelId/:roomId` - Delete room (owner)

**Bookings:**
- `POST /v1/bookings` - Create booking (guest)
- `GET /v1/bookings` - Get user's bookings (guest)
- `GET /v1/bookings/hotel/:hotelId` - Get hotel's bookings (owner)
- `PUT /v1/bookings/:id/approve` - Approve booking (owner)
- `DELETE /v1/bookings/:id` - Cancel booking (guest)

## 🎨 Styling

- **Color Scheme:**
  - Primary: #3457dc (Blue)
  - Secondary: #ff6b6b (Red)
  - Success: #51cf66 (Green)
  - Warning: #ffd93d (Yellow)
  - Danger: #ff6b6b (Red)

- **Responsive Breakpoints:**
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px

- **CSS Features:**
  - CSS Grid for layouts
  - Flexbox for components
  - CSS Variables for theming
  - Media queries for responsiveness
  - Smooth animations and transitions
  - Box shadows for depth

## ⚠️ Error Handling

The application includes comprehensive error handling:

1. **API Error Interception:** Automatic handling of HTTP errors
2. **User Notifications:** Error alerts displayed to users
3. **Form Validation:** Client-side form validation before submission
4. **Authentication:** Redirect to login on token expiration (401 errors)
5. **Network Errors:** Graceful handling of connection failures
6. **Loading States:** Visual feedback during async operations

## 🔐 Authentication

  - Guest: For booking hotel rooms
  - Owner: For managing hotels and rooms
- **Local Storage:** User session persisted in browser
- **Protected Routes:** Role-based access control on routes
- **Cookie-based Auth:** Backend uses JWT in cookies for security

## 📱 Responsive Design

All components are fully responsive:
- **Mobile-first approach**
- **Flexible grids** that adapt to screen size
- **Touch-friendly buttons** and inputs
- **Optimized navigation** for mobile devices
- **Readable text** at all breakpoints
- **Flexible images** that scale properly



1. **Guest Account:**
   - Role: Guest
   - Can browse hotels and make bookings

2. **Owner Account:**
   - Role: Owner
   - Can manage hotels, rooms, and bookings

## 📝 Notes

- The frontend is production-ready with proper error handling
- All API calls include proper error handling and user feedback
- The UI is fully responsive and works on all modern browsers
- State management is handled with React Context API
- Components are reusable and maintainable
- Code follows React best practices

## 🔄 Integration with Backend

Make sure the backend server is running on `http://localhost:5000` before starting the frontend development server. The frontend expects:

1. Backend running with proper CORS configuration
2. MongoDB connected for data persistence
3. Environment variables properly set in backend (.env file)

## 📄 License

This project is part of the Hotel Booking with Real-time Communication FYP (Final Year Project).
