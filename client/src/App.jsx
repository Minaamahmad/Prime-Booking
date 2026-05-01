import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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

const AppContent = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isChatPage = location.pathname.startsWith('/chat/');

  const noNavbar = isLoginPage || isChatPage;
  const mainClass = noNavbar ? '' : 'pt-20';

  return (
    <div className="min-h-screen ">
      {!isChatPage && <Navbar />}
      <main className={mainClass}>
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
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
