import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import { useLocation } from 'react-router-dom';

const Navbar = () => {
  const { logout, isAuthenticated, isOwner, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isHomePage = location.pathname === '/';

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    }
    logout();
    navigate('/login');
  };

  if (isLoginPage) return null;

  const textColorClass = isHomePage ? 'text-white/90' : 'text-gray-900';
  const hoverColorClass = isHomePage ? 'hover:text-white' : 'hover:text-indigo-600';
  const linkClass = `text-sm font-medium transition ${textColorClass} ${hoverColorClass}`;

  const buttonClass = `px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors ${
    isHomePage 
      ? 'text-white hover:bg-white/20' 
      : 'text-gray-900 hover:bg-gray-100'
  }`;

  return (
    <nav className={`absolute top-0 left-0 w-full z-50 ${textColorClass} bg-transparent`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-3 py-4 text-sm">
        <Link to="/" className={`text-xl font-bold transition ${textColorClass} ${hoverColorClass}`}>
          Prime Booking
        </Link>

        <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-6">
          {isAuthenticated() && isAdmin() && (
            <Link to="/admin/users/" className={linkClass}>
              Admin Panel
            </Link>
          )}

          {isAuthenticated() && isOwner() && (
            <>
              <Link to="/owner-dashboard" className={linkClass}>
                Dashboard
              </Link>
              <Link to="/owner-chats" className={linkClass}>
                Owner Chats
              </Link>
            </>
          )}

          {isAuthenticated() && !isOwner() && !isAdmin() && (
            <Link to="/my-bookings" className={linkClass}>
              My Bookings
            </Link>
          )}

          {isAuthenticated() ? (
            <button
              onClick={handleLogout}
              className={buttonClass}
            >
              Logout
            </button>
          ) : (
            <Link to="/login" className={buttonClass}>
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
