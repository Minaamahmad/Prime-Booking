import { createContext, useState, useEffect, useCallback, useContext } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const savedUser = localStorage.getItem('user');
      const savedToken = localStorage.getItem('token');

      // Check for temporary token (user needs role selection)
      const tempToken = document.cookie.split(';').find(c => c.trim().startsWith('temp_token='))?.split('=')[1];

      if (tempToken) {
        // User has temp token, redirect to role selection
        window.location.href = '/select-role';
        setLoading(false);
        return;
      }

      if (savedToken) {
        try {
          // Check if token is still valid by fetching current user
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/auth/me`, {
            credentials: 'include',
            headers: {
              'Authorization': `Bearer ${savedToken}`
            }
          });

          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
            setToken(savedToken);
          } else {
            // Token invalid, clear storage
            localStorage.removeItem('user');
            localStorage.removeItem('token');
          }
        } catch (err) {
          // Network error or other issue, clear storage
          console.error('Auth check failed:', err);
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      } else if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (err) {
          console.error('Error parsing saved user:', err);
          localStorage.removeItem('user');
        }
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = useCallback((userData, authToken) => {
    try {
      setUser(userData);
      setToken(authToken);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', authToken || '');
      setError(null);
      return userData;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setError(null);
  }, []);

  const isOwner = useCallback(() => {
    return user?.role === 'Owner';
  }, [user]);

  const isGuest = useCallback(() => {
    return user?.role === 'Guest';
  }, [user]);

  const isAuthenticated = useCallback(() => {
    return user !== null;
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        logout,
        isOwner,
        isGuest,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// eslint-disable-next-line react-refresh/only-export-components
export { AuthProvider };
