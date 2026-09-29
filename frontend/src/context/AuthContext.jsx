import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('crystal_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('crystal_token'));
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(() => localStorage.getItem('crystal_theme') || 'light');

  // Sync theme with document class
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      // System
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (systemDark) root.classList.add('dark');
      else root.classList.remove('dark');
    }
    localStorage.setItem('crystal_theme', theme);
  }, [theme]);

  // Check current session on mount
  useEffect(() => {
    const verifyUser = async () => {
      if (token) {
        try {
          const freshUser = await api.getMe();
          setUser(freshUser);
          localStorage.setItem('crystal_user', JSON.stringify(freshUser));
          if (freshUser.theme) {
            setTheme(freshUser.theme);
          }
        } catch (err) {
          console.warn('Session expired or invalid:', err);
          logout();
        }
      }
      setLoading(false);
    };

    verifyUser();

    const handleAuthExpired = () => {
      logout();
    };

    window.addEventListener('auth-expired', handleAuthExpired);
    return () => window.removeEventListener('auth-expired', handleAuthExpired);
  }, [token]);

  const login = async (email, password) => {
    const data = await api.login({ email, password });
    setToken(data.access_token);
    setUser(data.user);
    localStorage.setItem('crystal_token', data.access_token);
    localStorage.setItem('crystal_user', JSON.stringify(data.user));
    if (data.user.theme) {
      setTheme(data.user.theme);
    }
    return data;
  };

  const register = async (userData) => {
    const data = await api.register(userData);
    setToken(data.access_token);
    setUser(data.user);
    localStorage.setItem('crystal_token', data.access_token);
    localStorage.setItem('crystal_user', JSON.stringify(data.user));
    return data;
  };

  const logout = () => {
    try {
      if (token) api.logout().catch(() => {});
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('crystal_token');
      localStorage.removeItem('crystal_user');
    }
  };

  const updateProfile = async (data) => {
    const updated = await api.updateProfile(data);
    setUser(updated);
    localStorage.setItem('crystal_user', JSON.stringify(updated));
    if (data.theme) setTheme(data.theme);
    return updated;
  };

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    if (user) {
      api.updateProfile({ theme: newTheme }).catch(() => {});
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        loading,
        theme,
        login,
        register,
        logout,
        updateProfile,
        changeTheme
      }}
    >
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
