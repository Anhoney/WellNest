//App.js
// import * as React from 'react';
//import React from 'react';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import your screens
import FirstPage from './src/screens/FirstPage';
import LoginPage from './src/screens/LoginPage';
import ForgotPasswordPage from './src/screens/ForgotPasswordPage';
import RegisterPage from './src/screens/RegisterPage';
import MainPage from './src/screens/MainPage';
import AppointmentPage from './src/screens/AppointmentPage'; // Appointment Page
import VirtualConsultationPage from './src/screens/VirtualConsultationPage'; 
import PrescriptionHistoryPage from './src/screens/PrescriptionHistoryPage';
import ProfilePage from './src/screens/ProfilePage';

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
    <NavigationContainer>
      <Stack.Navigator initialRouteName="FirstPage" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="FirstPage" component={FirstPage} />
        <Stack.Screen name="LoginPage" component={LoginPage} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordPage} />
        <Stack.Screen name="Register" component={RegisterPage} />
        <Stack.Screen name="MainPage" component={MainPage} options={{ title: 'Home' }} />
        <Stack.Screen name="AppointmentBooking" component={AppointmentPage} options={{ title: 'Book Appointment' }}/>
        <Stack.Screen name="VirtualConsultation" component={VirtualConsultationPage} options={{ title: 'Virtual Consultation' }}/>
        <Stack.Screen name="Prescription" component={PrescriptionHistoryPage} options={{ title: 'Prescription' }}/>
        <Stack.Screen name="ProfilePage" component={ProfilePage} options={{ title: 'Account' }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
