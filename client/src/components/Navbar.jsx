import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';

const Navbar = () => {
  const { logout, isAuthenticated, isOwner } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    }
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-3 py-4 text-sm">
        <Link to="/" className="text-xl font-bold text-indigo-600 transition hover:text-indigo-700">
          Prime Booking
        </Link>

        <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-6">
          {isAuthenticated() && isOwner() && (
            <>
              <Link to="/owner-dashboard" className="text-sm font-medium text-gray-600 transition hover:text-gray-900">
                Dashboard
              </Link>
              <Link to="/owner-chats" className="text-sm font-medium text-gray-600 transition hover:text-gray-900">
                Owner Chats
              </Link>
            </>
          )}

          {isAuthenticated() && !isOwner() && (
            <Link to="/my-bookings" className="text-sm font-medium text-gray-600 transition hover:text-gray-900">
              My Bookings
            </Link>
          )}

          {isAuthenticated() ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Logout
            </button>
          ) : (
            <Link to="/login" className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
