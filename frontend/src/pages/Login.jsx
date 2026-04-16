import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/api';
import ErrorAlert from '../components/ErrorAlert';
import '../styles/Login.css';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDemoLogin = async (role) => {
    try {
      setLoading(true);
      setError('');

      const payload = {
        name: role === 'Owner' ? 'Demo Owner' : 'Demo Guest',
        email: role === 'Owner' ? 'owner@example.com' : 'guest@example.com',
        role,
      };

      const response = await authService.demoLogin(payload);
      login(response.data.user, response.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>🏨 HotelHub</h1>
        <h2>Welcome Back</h2>
        <p>Sign in to book hotels or manage your properties</p>

        <ErrorAlert message={error} onClose={() => setError('')} />

        <div className="login-options">
          <button className="google-login-btn" disabled>
            <span className="google-icon">🔐</span>
            <span>Sign in with Google (not configured)</span>
          </button>

          <div className="demo-users">
            <p>Demo Users:</p>
            <button
              className="demo-btn guest-btn"
              disabled={loading}
              onClick={() => handleDemoLogin('Guest')}
            >
              Login as Guest
            </button>
            <button
              className="demo-btn owner-btn"
              disabled={loading}
              onClick={() => handleDemoLogin('Owner')}
            >
              Login as Owner
            </button>
          </div>
        </div>

        <div className="login-footer">
          <p>Note: This is a demo. Implement actual Google OAuth authentication in production.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
