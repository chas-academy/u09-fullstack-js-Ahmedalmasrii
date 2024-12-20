import React, { createContext, useContext, useState, useEffect } from "react";

// Skapa AuthContext
const AuthContext = createContext();

// Hook för att använda AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

// AuthProvider-komponent
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [isLoggedIn, setIsLoggedIn] = useState(!!user);
  const [isTemporaryPassword, setIsTemporaryPassword] = useState(
    JSON.parse(localStorage.getItem("isTemporaryPassword")) || false
  );

  useEffect(() => {
    const handleStorageChange = () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const storedTemporaryPassword = JSON.parse(
        localStorage.getItem("isTemporaryPassword")
      );
      setUser(storedUser);
      setIsTemporaryPassword(!!storedTemporaryPassword);
      setIsLoggedIn(!!storedUser);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userData.token);
    if (userData.isTemporaryPassword) {
      localStorage.setItem("isTemporaryPassword", true);
      setIsTemporaryPassword(true);
    } else {
      localStorage.removeItem("isTemporaryPassword");
      setIsTemporaryPassword(false);
    }
    setUser(userData);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("isTemporaryPassword");
    setUser(null);
    setIsLoggedIn(false);
    setIsTemporaryPassword(false);
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, user, login, logout, isTemporaryPassword }}
    >
      {children}
    </AuthContext.Provider>
  );
};
