// frontend/context/AuthProvider.js
import React, { createContext, useEffect, useState } from "react";
import { storeToken, getToken, clearToken } from "../services/authService";
// import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  //   const navigation = useNavigation();
  const [authToken, setAuthToken] = useState(null);

  // Check token on app startup
  //   useEffect(() => {
  //     const initializeAuth = async () => {
  //       const storedToken = await getToken();
  //       if (storedToken) {
  //         setToken(storedToken);
  //         setIsAuthenticated(true);
  //       }
  //     };
  //     initializeAuth();
  //   }, []);

  //   // Login function
  //   const login = async (newToken) => {
  //     await storeToken(newToken);
  //     setToken(newToken);
  //     setIsAuthenticated(true);
  //   };

  //   // Logout function
  //   const logout = async () => {
  //     await clearToken();
  //     setToken(null);
  //     setIsAuthenticated(false);
  //     navigation.navigate("LoginPage"); // Redirect to login page on logout
  //   };

  //   return (
  //     <AuthContext.Provider value={{ isAuthenticated, token, login, logout }}>
  //       {children}
  //     </AuthContext.Provider>
  //   );
  // };
  useEffect(() => {
    const loadToken = async () => {
      const token = await getToken();
      //   AsyncStorage.getItem("authToken");
      setAuthToken(token);
    };
    loadToken();
  }, []);

  const login = async (token) => {
    await storeToken(token);
    // AsyncStorage.setItem("authToken", token);
    setAuthToken(token);
  };

  const logout = async (navigation) => {
    await clearToken(); // Clear the token using the fixed clearToken
    // await AsyncStorage.removeItem("authToken");
    setAuthToken(null);
    // navigation.reset({
    //   index: 0,
    //   routes: [{ name: "LoginPage" }],
    // });
    if (navigation) {
      navigation.reset({
        index: 0,
        routes: [{ name: "LoginPage" }],
      });
    }
  };

  return (
    <AuthContext.Provider value={{ authToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
