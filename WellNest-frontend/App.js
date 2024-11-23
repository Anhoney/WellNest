//App.js
// import * as React from 'react';
//import React from 'react';
import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AuthProvider } from "./context/AuthProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Import your screens
import FirstPage from "./src/screens/FirstPage";
import LoginPage from "./src/screens/LoginPage";
import ForgotPasswordPage from "./src/screens/ForgotPasswordPage";
import RegisterPage from "./src/screens/RegisterPage";
import MainPage from "./src/screens/MainPage";
import AppointmentPage from "./src/screens/AppointmentPage"; // Appointment Page
import VirtualConsultationPage from "./src/screens/VirtualConsultationPage";
import PrescriptionHistoryPage from "./src/screens/PrescriptionHistoryPage";
import ProfilePage from "./src/screens/ProfilePage";
import SettingPage from "./src/screens/SettingPage";
import ProfileEditPage from "./src/screens/ProfileEditPage";
import MedicationReminderPage from "./src/screens/MedicationReminderPage";
import ElderlyAssessmentPage from "./src/screens/ElderlyAssessmentPage";

//HealthcareProvider
import HealthcareProviderMainPage from "./src/screens/HealthcareProvider/HealthcareProviderMainPage";
import HpAppointmentManagementPage from "./src/screens/HealthcareProvider/HpAppointmentManagementPage";
import HpAppointmentCreationPage from "./src/screens/HealthcareProvider/HpAppointmentCreationPage";
import HpMyCreatedAppointments from "./src/screens/HealthcareProvider/HpMyCreatedAppointments";
import HpAppointmentEditPage from "./src/screens/HealthcareProvider/HpAppointmentEditPage";
import HpProfilePage from "./src/screens/HealthcareProvider/HpProfilePage";
import HpEditProfilePage from "./src/screens/HealthcareProvider/HpEditProfilePage";

//All
import ChangePassword from "./src/screens/ChangePassword";

// import SchedulePage from './SchedulePage'; // Example of other screens
// import ChatPage from './ChatPage';
// import NotificationPage from './NotificationPage';
// import AccountPage from './AccountPage';
//import { StatusBar } from 'expo-status-bar';
//import { StyleSheet, Text, View } from 'react-native';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// const App = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);  // Track login status

//   // Check login status on app start
//   useEffect(() => {
//     const checkLoginStatus = async () => {
//       const token = await AsyncStorage.getItem('userToken');  // Check if user is logged in
//       setIsLoggedIn(!!token); // If token exists, user is logged in
//     };
//     checkLoginStatus();
//   }, []);

//   // Function to handle successful login
//   const handleLogin = async () => {
//     // Save login token or credentials in AsyncStorage
//     await AsyncStorage.setItem('userToken', 'loggedin');  // Example token
//     setIsLoggedIn(true);  // Mark user as logged in
//   };

//   const handleLogout = async () => {
//     await AsyncStorage.removeItem('userToken');  // Clear token
//     setIsLoggedIn(false);  // Mark user as logged out
//   };

//   return (
//     <NavigationContainer>
//       {isLoggedIn ? (
//         <Tab.Navigator initialRouteName="MainPage">
//           <Tab.Screen name="MainPage" component={MainPage} />
//           <Tab.Screen name="Schedule" component={SchedulePage} />
//           <Tab.Screen name="Chat" component={ChatPage} />
//           <Tab.Screen name="Notification" component={NotificationPage} />
//           <Tab.Screen name="Account">
//             {props => <AccountPage {...props} handleLogout={handleLogout} />}  {/* Pass logout function to account */}
//           </Tab.Screen>
//         </Tab.Navigator>
//       ) : (
//         <Stack.Navigator>
//           <Stack.Screen name="Login">
//             {props => <LoginPage {...props} handleLogin={handleLogin} />}  {/* Pass login function to login page */}
//           </Stack.Screen>
//         </Stack.Navigator>
//       )}
//     </NavigationContainer>

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="FirstPage"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="FirstPage" component={FirstPage} />
          <Stack.Screen name="LoginPage" component={LoginPage} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordPage} />
          <Stack.Screen name="Register" component={RegisterPage} />
          <Stack.Screen
            name="MainPage"
            component={MainPage}
            options={{ title: "Home" }}
          />
          <Stack.Screen
            name="AppointmentBooking"
            component={AppointmentPage}
            options={{ title: "Book Appointment" }}
          />
          <Stack.Screen
            name="VirtualConsultation"
            component={VirtualConsultationPage}
            options={{ title: "Virtual Consultation" }}
          />
          <Stack.Screen
            name="Prescription"
            component={PrescriptionHistoryPage}
            options={{ title: "Prescription" }}
          />
          <Stack.Screen
            name="ProfilePage"
            component={ProfilePage}
            options={{ title: "Account" }}
          />
          <Stack.Screen
            name="SettingPage"
            component={SettingPage}
            options={{ title: "Setting" }}
          />
          <Stack.Screen
            name="ProfileEditPage"
            component={ProfileEditPage}
            options={{ title: "ProfileEdit" }}
          />
          <Stack.Screen
            name="MedicationReminderPage"
            component={MedicationReminderPage}
            options={{ title: "MedicationReminder" }}
          />
          <Stack.Screen
            name="ElderlyAssessmentPage"
            component={ElderlyAssessmentPage}
            options={{ title: "ElderlyAssessment" }}
          />
          <Stack.Screen
            name="HealthcareProviderMainPage"
            component={HealthcareProviderMainPage}
            options={{ title: "HealthcareProvider" }}
          />
          <Stack.Screen
            name="HpAppointmentManagementPage"
            component={HpAppointmentManagementPage}
            options={{ title: "AppointmentManagement" }}
          />
          <Stack.Screen
            name="HpAppointmentCreationPage"
            component={HpAppointmentCreationPage}
            options={{ title: "AppointmentCreation" }}
          />
          <Stack.Screen
            name="HpMyCreatedAppointments"
            component={HpMyCreatedAppointments}
            options={{ title: "MyCreatedAppointments" }}
          />
          <Stack.Screen
            name="HpAppointmentEditPage"
            component={HpAppointmentEditPage}
            options={{ title: "AppointmentEditPage" }}
          />
          <Stack.Screen
            name="HpProfilePage"
            component={HpProfilePage}
            options={{ title: "HpProfilePage" }}
          />
          <Stack.Screen
            name="HpEditProfilePage"
            component={HpEditProfilePage}
            options={{ title: "HpEditProfilePage" }}
          />
          <Stack.Screen
            name="ChangePassword"
            component={ChangePassword}
            options={{ title: "ChangePassword" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

// frontend/App.js
// import React from "react";
// import { AuthProvider } from "./context/AuthProvider";
// import AppNavigator from "./navigation/AppNavigator";

// export default function App() {
//   return (
//     <AuthProvider>
//       <AppNavigator />
//     </AuthProvider>
//   );
// }

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
