//HealthcareProviderMainPage.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; // Make sure you have Ionicons installed
import styles from "../../components/styles"; // Assuming you have your styles.js setup
import HpNavigationBar from "../../components/HpNavigationBar"; // Import here
import AsyncStorage from "@react-native-async-storage/async-storage";
import BlankSpacer from "react-native-blank-spacer";
import axios from "axios";
import API_BASE_URL from "../../../config/config";

const HealthcareProviderMainPage = ({}) => {
  const [userName, setUserName] = useState("");
  const navigation = useNavigation();

  // useEffect(() => {
  //   const fetchUserName = async () => {
  //     try {
  //       const userId = await AsyncStorage.getItem("userId");
  //       const token = await AsyncStorage.getItem("token");
  //       if (!token) {
  //         alert("No token found. Please log in.");
  //         return;
  //       }
  //       console.log("Authorization token:", token); // Debugging log

  //       const fullName = await AsyncStorage.getItem("full_name"); // Assuming you store it in AsyncStorage
  //       if (!userId) {
  //         console.warn("No userId found. Redirecting to login.");
  //         navigation.reset({
  //           index: 0,
  //           routes: [{ name: "LoginPage" }],
  //         });
  //         return;
  //       }

  //       // Call the profile API to get the user data
  //       const response = await axios.get(`${API_BASE_URL}/profile/${userId}`, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });
  //       // const response = await fetch(`http://your-api-url/profile/${userId}`); // Replace 'http://your-api-url' with the actual API endpoint
  //       // const data = await response.json();
  //       const data = response.data;
  //       // if (response.ok) {
  //       if (response.data) {
  //         const fetchedUserName = data.username || data.full_name || "User";
  //         setUserName(fetchedUserName);
  //       } else {
  //         console.warn(
  //           "Failed to fetch user profile:",
  //           data.error || "Unknown error"
  //         );
  //         setUserName("User");
  //       }
  //       // console.log("Fetched Data:", data);
  //       // setUserName(fullName || "User"); // Fallback to "User" if not found
  //       console.log("username:", userName);
  //       console.log("Full Name:", fullName);
  //       console.log("Main Page: User ID:", userId);
  //     } catch (error) {
  //       console.error("Failed to fetch full name:", error);
  //       setUserName("User"); // Fallback to default name on error
  //     }
  //   };

  //   fetchUserName();
  // }, []);

  const fetchUserName = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        alert("No token found. Please log in.");
        return;
      }
      console.log("Authorization token:", token); // Debugging log

      if (!userId) {
        console.warn("No userId found. Redirecting to login.");
        navigation.reset({
          index: 0,
          routes: [{ name: "LoginPage" }],
        });
        return;
      }

      // Call the profile API to get the user data
      const response = await axios.get(`${API_BASE_URL}/profile/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data) {
        const fetchedUserName =
          response.data.username || response.data.full_name || "User";
        setUserName(fetchedUserName);
      } else {
        console.warn(
          "Failed to fetch user profile:",
          response.data.error || "Unknown error"
        );
        setUserName("User");
      }
    } catch (error) {
      console.error("Failed to fetch user name:", error);
      setUserName("User"); // Fallback to default name on error
    }
  };

  // Refresh data when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      console.log("Screen focused, refreshing user data");
      fetchUserName();
    }, [])
  );

  return (
    <ImageBackground
      source={require("../../../assets/MainPage.png")}
      style={styles.background}
    >
      <View style={styles.pageContainer}>
        {/* Greeting Section */}
        <Text style={styles.hPGreeting}>Hello, {userName}!</Text>
        <Text style={styles.hPTitle}>
          Welcome to Healthcare Management Site.
        </Text>
        <ScrollView>
          {/* Healthcare Services */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Healthcare Services</Text>
            <View style={styles.hPModuleRow}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("HpAppointmentManagementPage")
                }
              >
                <Image
                  source={require("../../../assets/AppointmentBooking.png")}
                  // style={styles.icon}
                />
                <Text style={styles.iconText}>
                  Appointment {"\n"} Booking {"\n"} Management
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate("HpVAppManagementPage")}
              >
                <Image
                  source={require("../../../assets/VirtualConsultation.png")}
                  // style={styles.icon}
                />
                <Text style={styles.iconText}>
                  Virtual {"\n"} Consultation {"\n"} Management
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        {/* Navigation Bar */}
        <HpNavigationBar
          navigation={navigation}
          activePage="HealthcareProviderMainPage"
        />
      </View>
    </ImageBackground>
  );
};

export default HealthcareProviderMainPage;
