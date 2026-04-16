import { createContext, useState, useEffect, useCallback } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        localStorage.removeItem('user');
      }
    }
    if (savedToken) {
      setToken(savedToken);
    }
    setLoading(false);
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
