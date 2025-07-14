import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('access_token'));

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
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } catch (err) {
      setUser(null);
      localStorage.removeItem('user');
      return null;
    }
  };

  const login = async (accessToken) => {
    setToken(accessToken);
    localStorage.setItem('access_token', accessToken);
    await fetchUserInfo(accessToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, fetchUserInfo }}>
      {children}
    </AuthContext.Provider>
  );
}; 