import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('jwt_token') || null);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user_info');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const handleUnauthorized = () => {
      setToken(null);
      setUser(null);
      setAuthError('Your session has expired. Please login again.');
    };

    window.addEventListener('unauthorized-event', handleUnauthorized);
    return () => window.removeEventListener('unauthorized-event', handleUnauthorized);
  }, []);

  const login = async (usernameOrEmail, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const response = await api.post('/auth/login', { usernameOrEmail, password });
      const { accessToken, username, email, role } = response.data;

      const userInfo = { username, email, role };
      
      localStorage.setItem('jwt_token', accessToken);
      localStorage.setItem('user_info', JSON.stringify(userInfo));

      setToken(accessToken);
      setUser(userInfo);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check credentials.';
      setAuthError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password, role) => {
    setLoading(true);
    setAuthError(null);
    try {
      await api.post('/auth/register', { username, email, password, role });
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.details?.[0] || 'Registration failed.';
      setAuthError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_info');
    setToken(null);
    setUser(null);
    setAuthError(null);
  };

  const isAdmin = user?.role === 'ROLE_ADMIN';

  return (
    <AuthContext.Provider value={{ token, user, isAdmin, loading, authError, login, register, logout, setAuthError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
