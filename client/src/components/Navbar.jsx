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
    <nav className="sticky top-0 left-0 right-0  border-b border-white/10 bg-slate-950/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 text-sm text-slate-100">
        <Link to="/" className="font-semibold text-white hover:text-primary-amber transition">
          Prime Booking
        </Link>

        

          {isAuthenticated() && isOwner() && (
            <>
              <Link to="/owner-dashboard" className="text-slate-300 hover:text-white transition">
                Dashboard
              </Link>
              <Link to="/owner-chats" className="text-slate-300 hover:text-white transition">
                Owner Chats
              </Link>
            </>
          )}

          {isAuthenticated() && !isOwner() && (
            <Link to="/my-bookings" className="text-slate-300 hover:text-white transition">
              My Bookings
            </Link>
          )}

          {isAuthenticated() ? (
            <button
              onClick={handleLogout}
              className="rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-950 transition hover:bg-primary-teal/90"
            >
              Logout
            </button>
          ) : (
            <Link to="/login" className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate-100 transition hover:bg-white/5">
              Sign In
            </Link>
          )}
        </div>
    
    </nav>
  );
};

export default Navbar;
