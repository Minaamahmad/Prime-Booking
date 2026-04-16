import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../styles/Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated, isOwner } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          🏨 HotelHub
        </Link>
        
        <div className="nav-menu">
          <Link to="/" className="nav-link">
            Home
          </Link>

          {isAuthenticated() && isOwner() && (
            <>
              <Link to="/owner-dashboard" className="nav-link">
                Dashboard
              </Link>
              <Link to="/owner-chats" className="nav-link">
                Owner Chats
              </Link>
            </>
          )}

          {isAuthenticated() && !isOwner() && (
            <Link to="/my-bookings" className="nav-link">
              My Bookings
            </Link>
          )}

          {isAuthenticated() ? (
            <div className="nav-auth">
              <span className="user-info">
                {user?.name} ({user?.role})
              </span>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="nav-link login-link">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
