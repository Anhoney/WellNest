//frontend / App.js;
import React from "react";
import { AuthProvider } from "./context/AuthProvider";
import { NotificationProvider } from "./context/NotificationProvider";
import AppNavigator from "./navigation/AppNavigator";

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppNavigator />
      </NotificationProvider>
    </AuthProvider>
  );
}

// App.js
// import React, { useState, useEffect } from "react";
// import { AuthProvider } from "./context/AuthProvider";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import jwt_decode from "jwt-decode";
// import AppNavigator from "./navigation/AppNavigator";
// import LoginPage from "./src/screens/LoginPage";

// export default function App() {
//   const [isLoggedIn, setIsLoggedIn] = useState(null); // Track login state

//   // Function to check token validity
//   const isTokenValid = (token) => {
//     try {
//       const decoded = jwt_decode(token);
//       const currentTime = Date.now() / 1000; // Get current time in seconds
//       return decoded.exp > currentTime; // Check if token is still valid
//     } catch (error) {
//       console.error("Invalid token:", error);
//       return false;
//     }
//   };

//   // Initialize the app and check token
//   useEffect(() => {
//     const initializeApp = async () => {
//       const token = await AsyncStorage.getItem("token");
//       if (token && isTokenValid(token)) {
//         const decoded = jwt_decode(token);
//         console.log("User ID:", decoded.id); // Optionally log user data
//         setIsLoggedIn(true); // User is logged in
//       } else {
//         setIsLoggedIn(false); // User needs to log in
//       }
//     };
//     initializeApp();
//   }, []);

//   // Show login or app content based on the login state
//   if (isLoggedIn === null) {
//     // Optional: Display a loading spinner while checking token
//     return null;
//   }

//   return (
//     <AuthProvider>{isLoggedIn ? <AppNavigator /> : <LoginPage />}</AuthProvider>
//   );
// }
