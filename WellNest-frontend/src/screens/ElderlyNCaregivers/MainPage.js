//MainPage.js
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
import NavigationBar from "../../components/NavigationBar"; // Import here
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../../../config/config";
import axios from "axios";

const MainPage = ({ medicineReminder }) => {
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
        <Text style={styles.greeting}>Hello, {userName}!</Text>

        {/* Medicine Reminder Section */}
        <View style={styles.medicineReminderContainer}>
          {medicineReminder ? ( // Check if there is a medicine reminder
            <>
              <Text style={styles.reminderText}>
                Remember to take your medicine!
              </Text>
              <View style={styles.medicineCard}>
                <Image
                  source={require("../../../assets/Prescription.png")}
                  style={styles.medicineImage}
                />
                <View>
                  <Text style={styles.medicineName}>
                    {medicineReminder.name}
                  </Text>
                  <Text style={styles.medicineTime}>
                    {medicineReminder.time} • {medicineReminder.instruction}
                  </Text>
                </View>
                <TouchableOpacity style={styles.doneButton}>
                  <Text style={styles.doneButtonText}>Done</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <Image
              source={require("../../../assets/DrinkTea.png")}
              style={styles.defaultImage}
            />
          )}
        </View>

        <ScrollView>
          {/* Healthcare Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Healthcare</Text>
            <View style={styles.moduleRow}>
              <TouchableOpacity
                onPress={() => navigation.navigate("AppointmentBooking")}
              >
                <Image
                  source={require("../../../assets/AppointmentBooking.png")}
                  // style={styles.icon}
                />
                <Text style={styles.iconText}>Appointment {"\n"} Booking</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate("VirtualConsultation")}
              >
                <Image
                  source={require("../../../assets/VirtualConsultation.png")}
                  // style={styles.icon}
                />
                <Text style={styles.iconText}>Virtual {"\n"} Consultation</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate("MedicalReport")}
              >
                <Image
                  source={require("../../../assets/Prescription.png")}
                  style={styles.icon}
                />
                <Text style={styles.iconText}>Prescription</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate("MedicationReminderPage")}
              >
                <Image
                  source={require("../../../assets/MedicationReminder.png")}
                  style={styles.icon}
                />
                <Text style={styles.iconText}>Medication {"\n"} Reminder</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Wellness Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Wellness</Text>
            <View style={styles.moduleRow}>
              <TouchableOpacity
                onPress={() => navigation.navigate("ElderlyAssessmentPage")}
              >
                <Image
                  source={require("../../../assets/ElderlyAssessment.png")}
                  style={styles.icon}
                />
                <Text style={styles.iconText}>Elderly {"\n"} Assessment</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate("SocialEventsScreen")}
              >
                <Image
                  source={require("../../../assets/SocialEventsAndSupportGroups.png")}
                  style={styles.icon}
                />
                <Text style={styles.iconText}>
                  Social Events {"\n"} & Support
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("VolunteerOpportunitiesScreen")
                }
              >
                <Image
                  source={require("../../../assets/VolunteerOpportunities.png")}
                  style={styles.icon}
                />
                <Text style={styles.iconText}>
                  Volunteer {"\n"} Opportunities
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate("MedicationsScreen")}
              >
                <Image
                  source={require("../../../assets/FamilyAndCaregiversCollaboration.png")}
                  style={styles.icon}
                />
                <Text style={styles.iconText}>
                  Family & {"\n"} Caregiver {"\n"} Collaboration
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Navigation Bar */}
        <NavigationBar navigation={navigation} activePage="MainPage" />
      </View>
    </ImageBackground>
  );
};

export default MainPage;
