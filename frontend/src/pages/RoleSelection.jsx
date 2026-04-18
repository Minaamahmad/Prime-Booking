import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import ErrorAlert from '../components/ErrorAlert';
import '../styles/RoleSelection.css';

const RoleSelection = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRoleSelection = async (role) => {
    try {
      setLoading(true);
      setError('');

      const response = await authService.selectRole({ role });
      login(response.data.user, response.data.token);

      // Redirect based on role
      if (role === 'Owner') {
        navigate('/owner-dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Role selection failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="role-selection-container">
      <div className="role-selection-box">
        <h1>🏨 HotelHub</h1>
        <h2>Welcome! Choose Your Role</h2>
        <p>Select how you'd like to use our platform</p>

        <ErrorAlert message={error} onClose={() => setError('')} />

        <div className="role-options">
          <div className="role-card guest-card" onClick={() => handleRoleSelection('Guest')} disabled={loading}>
            <div className="role-icon">🏠</div>
            <h3>I'm a Guest</h3>
            <p>Book hotels, manage reservations, and enjoy your stay</p>
            <ul>
              <li>🔍 Browse and book hotels</li>
              <li>📅 Manage my bookings</li>
              <li>💬 Chat with hotel owners</li>
            </ul>
          </div>

          <div className="role-card owner-card" onClick={() => handleRoleSelection('Owner')} disabled={loading}>
            <div className="role-icon">🏨</div>
            <h3>I'm a Hotel Owner</h3>
            <p>Manage your properties and connect with guests</p>
            <ul>
              <li>📊 Manage my hotels</li>
              <li>🏠 Add and edit rooms</li>
              <li>💬 Respond to guest inquiries</li>
              <li>📈 View booking analytics</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;