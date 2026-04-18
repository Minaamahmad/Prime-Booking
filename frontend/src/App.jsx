import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Home from './pages/Home';
import HotelDetails from './pages/HotelDetails';
import MyBookings from './pages/MyBookings';
import HotelManagement from './pages/HotelManagement';
import RoomManagement from './pages/RoomManagement';
import OwnerDashboard from './pages/OwnerDashboard';
import OwnerChats from './pages/OwnerChats';
import Chat from './pages/Chat';
import RoleSelection from './pages/RoleSelection';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/select-role" element={<RoleSelection />} />
              <Route path="/" element={<Home />} />
              <Route path="/hotel/:id" element={<HotelDetails />} />

              <Route
                path="/my-bookings"
                element={
                  <ProtectedRoute>
                    <MyBookings />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/chat/:bookingId"
                element={
                  <ProtectedRoute>
                    <Chat />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/owner-dashboard"
                element={
                  <ProtectedRoute requiredRole="Owner">
                    <OwnerDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/owner-chats"
                element={
                  <ProtectedRoute requiredRole="Owner">
                    <OwnerChats />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/hotels"
                element={
                  <ProtectedRoute requiredRole="Owner">
                    <HotelManagement />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/rooms/:hotelId"
                element={
                  <ProtectedRoute requiredRole="Owner">
                    <RoomManagement />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
