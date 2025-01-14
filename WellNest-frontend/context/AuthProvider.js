// frontend/context/AuthProvider.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { storeToken, getToken, clearToken } from "../services/authService";
// import { useNavigation } from "@react-navigation/native"; // Import useNavigation
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  // const { initializeInterval } = useContext(NotificationProvider);
  // const navigation = useNavigation(); // Get the navigation object

  // Load token on app startup
  useEffect(() => {
    const loadToken = async () => {
      const token = await getToken();
      setAuthToken(token);
    };
    loadToken();
  }, []);

  // Login function
  const login = async (token) => {
    await storeToken(token);
    setAuthToken(token);
    // await initializeInterval();
  };

  // Logout function with navigation
  const logout = async () => {
    await clearToken(); // Clear the token
    setAuthToken(null);
    // navigation.reset({
    //   index: 0,
    //   routes: [{ name: "LoginPage" }],
    // }); // Reset navigation to LoginPage
  };

  return (
    <AuthContext.Provider value={{ authToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
