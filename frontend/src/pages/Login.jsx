import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ErrorAlert from '../components/ErrorAlert';
import '../styles/Login.css';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async (response) => {
    try {
      setLoading(true);
      setError('');

      // In a real app, you'd send the token to your backend
      // For now, we'll create a mock user object
      const mockUser = {
        _id: response.profileObj?.googleId || Math.random().toString(),
        name: response.profileObj?.name || 'Guest User',
        email: response.profileObj?.email,
        avatar: response.profileObj?.imageUrl,
        role: 'Guest', // Default role
      };

      // Save user and redirect
      login(mockUser);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
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
          <button className="google-login-btn" disabled={loading}>
            <span className="google-icon">🔐</span>
            <span>{loading ? 'Signing in...' : 'Sign in with Google'}</span>
          </button>

          <div className="demo-users">
            <p>Demo Users:</p>
            <button
              className="demo-btn guest-btn"
              onClick={() => {
                const demoGuest = {
                  _id: 'demo-guest-123',
                  name: 'Demo Guest',
                  email: 'guest@example.com',
                  role: 'Guest',
                };
                login(demoGuest);
                navigate('/');
              }}
            >
              Login as Guest
            </button>
            <button
              className="demo-btn owner-btn"
              onClick={() => {
                const demoOwner = {
                  _id: 'demo-owner-456',
                  name: 'Demo Owner',
                  email: 'owner@example.com',
                  role: 'Owner',
                };
                login(demoOwner);
                navigate('/');
              }}
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
