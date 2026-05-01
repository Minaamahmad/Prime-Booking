import { createContext, useState, useEffect, useCallback, useContext } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      // Check for temporary token
      const tempToken = document.cookie.split(';').find(c => c.trim().startsWith('temp_token='))?.split('=')[1];

      if (tempToken) {
        // User has temp token, redirect to role selection
        window.location.href = '/select-role';
        setLoading(false);
        return;
      }

      // Try to fetch current user with cookies
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/auth/me`, {
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          // Note: token is in httpOnly cookie, not stored in localStorage
        } else {
          // Not authenticated
          setUser(null);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        setUser(null);
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = useCallback((userData) => {
    try {
      setUser(userData);
      // Store user in localStorage for display, but token is in httpOnly cookie
      localStorage.setItem('user', JSON.stringify(userData));
      setError(null);
      return userData;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (err) {
      console.error('Logout API error:', err);
    }
    setUser(null);
    localStorage.removeItem('user');
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

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export { AuthProvider };
