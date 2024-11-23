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
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; // Make sure you have Ionicons installed
import styles from "../components/styles"; // Assuming you have your styles.js setup
import NavigationBar from "../components/NavigationBar"; // Import here
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../../config/config";
import axios from "axios";

const MainPage = ({ medicineReminder }) => {
  const [userName, setUserName] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          alert("No token found. Please log in.");
          return;
        }
        console.log("Authorization token:", token); // Debugging log

        const fullName = await AsyncStorage.getItem("full_name"); // Assuming you store it in AsyncStorage
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
        // const response = await fetch(`http://your-api-url/profile/${userId}`); // Replace 'http://your-api-url' with the actual API endpoint
        // const data = await response.json();
        const data = response.data;
        // if (response.ok) {
        if (response.data) {
          const fetchedUserName = data.username || data.full_name || "User";
          setUserName(fetchedUserName);
        } else {
          console.warn(
            "Failed to fetch user profile:",
            data.error || "Unknown error"
          );
          setUserName("User");
        }
        // console.log("Fetched Data:", data);
        // setUserName(fullName || "User"); // Fallback to "User" if not found
        console.log("username:", userName);
        console.log("Full Name:", fullName);
        console.log("Main Page: User ID:", userId);
        // const fullName = await AsyncStorage.getItem("full_name"); // Assuming you store it in AsyncStorage
        // console.log(fullName);
        // setUserName(fullName || "User"); // Fallback to "User" if not found
      } catch (error) {
        console.error("Failed to fetch full name:", error);
        setUserName("User"); // Fallback to default name on error
      }
    };

    fetchUserName();
  }, []);

  return (
    <ImageBackground
      source={require("../../assets/MainPage.png")}
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
                  source={require("../../assets/Prescription.png")}
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
              source={require("../../assets/DrinkTea.png")}
              style={styles.defaultImage}
            />
          )}
        </View>

        <ScrollView>
          {/* Healthcare Section */}
          {/* <Text style={styles.sectionTitle}>Healthcare</Text>
            <View style={styles.moduleRow}>
            <TouchableOpacity onPress={() => navigation.navigate('AppointmentBooking')}>
                <Image source={require('./assets/AppointmentBooking.png')} style={styles.icon} />
                <Text style={styles.iconText}>Appointment Booking</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('VirtualConsultation')}>
                <Image source={require('./assets/VirtualConsultation.png')} style={styles.icon} />
                <Text style={styles.iconText}>Virtual Consultation</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Prescription')}>
                <Image source={require('./assets/Prescription.png')} style={styles.icon} />
                <Text style={styles.iconText}>Prescription</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('MedicationReminder')}>
                <Image source={require('./assets/MedicationReminder.png')} style={styles.icon} />
                <Text style={styles.iconText}>Medication Reminder</Text>
            </TouchableOpacity>
            </View> */}

          {/* Wellness Section */}
          {/* <Text style={styles.sectionTitle}>Wellness</Text>
            <View style={styles.moduleRow}>
            <TouchableOpacity onPress={() => navigation.navigate('ElderlyAssessment')}>
                <Image source={require('./assets/ElderlyAssessment.png')} style={styles.icon} />
                <Text style={styles.iconText}>Elderly Assessment</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('SocialEvents')}>
                <Image source={require('./assets/SocialEventsAndSupportGroups.png')} style={styles.icon} />
                <Text style={styles.iconText}>Social Events & Support</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('VolunteerOpportunities')}>
                <Image source={require('./assets/VolunteerOpportunities.png')} style={styles.icon} />
                <Text style={styles.iconText}>Volunteer Opportunities</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('FamilyCollaboration')}>
                <Image source={require('./assets/FamilyAndCaregiversCollaboration.png')} style={styles.icon} />
                <Text style={styles.iconText}>Family & Caregiver Collaboration</Text>
            </TouchableOpacity>
            </View> */}

          {/* Healthcare Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Healthcare</Text>
            <View style={styles.moduleRow}>
              <TouchableOpacity
                onPress={() => navigation.navigate("AppointmentBooking")}
              >
                <Image
                  source={require("../../assets/AppointmentBooking.png")}
                  // style={styles.icon}
                />
                <Text style={styles.iconText}>Appointment {"\n"} Booking</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate("VirtualConsultation")}
              >
                <Image
                  source={require("../../assets/VirtualConsultation.png")}
                  // style={styles.icon}
                />
                <Text style={styles.iconText}>Virtual {"\n"} Consultation</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate("Prescription")}
              >
                <Image
                  source={require("../../assets/Prescription.png")}
                  style={styles.icon}
                />
                <Text style={styles.iconText}>Prescription</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate("MedicationReminderPage")}
              >
                <Image
                  source={require("../../assets/MedicationReminder.png")}
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
                  source={require("../../assets/ElderlyAssessment.png")}
                  style={styles.icon}
                />
                <Text style={styles.iconText}>Elderly {"\n"} Assessment</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate("SocialEvents")}
              >
                <Image
                  source={require("../../assets/SocialEventsAndSupportGroups.png")}
                  style={styles.icon}
                />
                <Text style={styles.iconText}>
                  Social Events {"\n"} & Support
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate("VolunteerOpportunities")}
              >
                <Image
                  source={require("../../assets/VolunteerOpportunities.png")}
                  style={styles.icon}
                />
                <Text style={styles.iconText}>
                  Volunteer {"\n"} Opportunities
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate("FamilyCollaboration")}
              >
                <Image
                  source={require("../../assets/FamilyAndCaregiversCollaboration.png")}
                  style={styles.icon}
                />
                <Text style={styles.iconText}>
                  Family & {"\n"} Caregiver {"\n"} Collaboration
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Navigation Bar
        <View style={styles.navigationBar}>
            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Ionicons name="home" size={28} color="orange" />
            <Text style={styles.navText}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Schedule')}>
            <Ionicons name="calendar" size={28} color="gray" />
            <Text style={styles.navText}>Schedule</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Chat')}>
            <Ionicons name="chatbubbles" size={28} color="gray" />
            <Text style={styles.navText}>Chat</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
            <Ionicons name="notifications" size={28} color="gray" />
            <Text style={styles.navText}>Notification</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Account')}>
            <Ionicons name="person" size={28} color="gray" />
            <Text style={styles.navText}>Account</Text>
            </TouchableOpacity>
        </View> */}
        {/* Navigation Bar */}
        <NavigationBar navigation={navigation} activePage="MainPage" />
      </View>
    </ImageBackground>
  );
};

export default MainPage;
