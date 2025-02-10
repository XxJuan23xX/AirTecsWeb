import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('sessionToken'));

  const login = (sessionToken) => {
    localStorage.setItem('sessionToken', sessionToken);
    setToken(sessionToken);
  };

  const logout = () => {
    localStorage.removeItem('sessionToken');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
