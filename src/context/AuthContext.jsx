import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('admin_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('admin_access_token'));
  const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem('admin_refresh_token'));

  const fetchUserInfo = async (accessToken) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/me/', {
        headers: {
          'Authorization': 'Bearer ' + accessToken
        }
      });
      if (!response.ok) throw new Error('Failed to fetch user info');
      const userData = await response.json();
      setUser(userData);
      localStorage.setItem('admin_user', JSON.stringify(userData));
      return userData;
    } catch (err) {
      setUser(null);
      localStorage.removeItem('admin_user');
      return null;
    }
  };

  const login = async (accessToken, refreshTokenValue) => {
    setToken(accessToken);
    setRefreshToken(refreshTokenValue);
    localStorage.setItem('admin_access_token', accessToken);
    localStorage.setItem('admin_refresh_token', refreshTokenValue);
    await fetchUserInfo(accessToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setRefreshToken(null);
    localStorage.removeItem('admin_user');
    localStorage.removeItem('admin_access_token');
    localStorage.removeItem('admin_refresh_token');
  };

  const refreshAccessToken = async () => {
    const storedRefresh = refreshToken || localStorage.getItem('admin_refresh_token');
    if (!storedRefresh) return false;
    try {
      const response = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: storedRefresh })
      });
      const data = await response.json();
      if (response.ok && data.access) {
        setToken(data.access);
        localStorage.setItem('admin_access_token', data.access);
        return data.access;
      } else {
        logout();
        return false;
      }
    } catch {
      logout();
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, refreshToken, login, logout, fetchUserInfo, refreshAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
}; 