import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('taskflow_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('taskflow_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      if (token) {
        try {
          const res = await API.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.user);
            localStorage.setItem('taskflow_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.error('Auth verification failed:', err);
          logout();
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('taskflow_token', res.data.token);
      localStorage.setItem('taskflow_user', JSON.stringify(res.data.user));
    }
    return res.data;
  };

  const register = async (formData) => {
    const res = await API.post('/auth/register', formData);
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('taskflow_token', res.data.token);
      localStorage.setItem('taskflow_user', JSON.stringify(res.data.user));
    }
    return res.data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('taskflow_token');
    localStorage.removeItem('taskflow_user');
  };

  const updateUserProfile = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('taskflow_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUserProfile }}>
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
