// HealthcareProviderMainPage.js
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
import styles from "../../components/styles";
import HpNavigationBar from "../../components/HpNavigationBar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BlankSpacer from "react-native-blank-spacer";
import axios from "axios";
import API_BASE_URL from "../../../config/config";

const HealthcareProviderMainPage = ({}) => {
  const [userName, setUserName] = useState("");
  const navigation = useNavigation();

  const fetchUserName = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        alert("No token found. Please log in.");
        return;
      }

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
