// src/AuthContext.js

import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

// AuthContext provider component
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: null,
    token: null,
  });

  const [changeValue, setChangeValue] = useState(1); // Moved here
  const value = {
    auth,
    changeValue, // Added changeValue to the context
    setChangeValue, // Added setChangeValue to the context
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
