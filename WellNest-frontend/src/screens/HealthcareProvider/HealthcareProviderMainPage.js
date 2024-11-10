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
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; // Make sure you have Ionicons installed
import styles from "../../components/styles"; // Assuming you have your styles.js setup
import HpNavigationBar from "../../components/HpNavigationBar"; // Import here
import AsyncStorage from "@react-native-async-storage/async-storage";
import BlankSpacer from "react-native-blank-spacer";

const HealthcareProviderMainPage = ({}) => {
  const [userName, setUserName] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const fullName = await AsyncStorage.getItem("full_name"); // Assuming you store it in AsyncStorage
        setUserName(fullName || "User"); // Fallback to "User" if not found
      } catch (error) {
        console.error("Failed to fetch full name:", error);
      }
    };

    fetchUserName();
  }, []);
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
                  style={styles.icon}
                />
                <Text style={styles.iconText}>
                  Appointment {"\n"} Booking {"\n"} Management
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate("VirtualConsultation")}
              >
                <Image
                  source={require("../../../assets/VirtualConsultation.png")}
                  style={styles.icon}
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
