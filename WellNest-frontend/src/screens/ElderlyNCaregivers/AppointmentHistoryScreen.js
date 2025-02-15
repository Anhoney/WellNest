// AppointmentHistoryScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  ImageBackground,
  Image,
} from "react-native";
import API_BASE_URL from "../../../config/config";
import { getUserIdFromToken } from "../../../services/authService";
import NavigationBar from "../../components/NavigationBar";
import styles from "../../components/styles"; // Import custom styles
import { Ionicons } from "@expo/vector-icons"; // Import icons from Expo
import { useNavigation, useRoute } from "@react-navigation/native";

const AppointmentHistoryScreen = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params;

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getUserIdFromToken();
      if (id) {
        setLoggedInUserId(id);
      }
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    // Ensure appointments are fetched only when userId is set
    if (userId) {
      fetchAppointments(userId);
    }
  }, [userId]);

  const fetchAppointments = async (userId) => {
    if (!userId) {
      Alert.alert("Error", "No user found. Please log in.");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/getScheduledAppointments/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Check if the response is okay (status code 200)
      if (!response.ok) {
        throw new Error(
          `Failed to fetch appointments. Status: ${response.status}`
        );
      }

      const result = await response.json(); // Try parsing the response as JSON
      setAppointments([...result.upcoming, ...result.past]); // Combine both upcoming and past appointments
    } catch (error) {
      console.error("Error fetching appointments:", error);
      Alert.alert(
        "Error",
        error.message || "An error occurred while fetching appointments."
      );
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (appointmentId, isVirtual) => {
    if (!userId) {
      Alert.alert("Error", "No user found. Please log in.");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/cancelAppointment/${appointmentId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // Check if the response is okay
      if (!response.ok) {
        const errorText = await response.text(); // Read the response as text if not okay
        throw new Error(`Error: ${errorText}`);
      }
      const result = await response.json();
      if (result.success) {
        Alert.alert("Success", "Appointment canceled successfully.");
        fetchAppointments(userId); // Refresh appointments using the userId
      } else {
        Alert.alert("Error", result.error || "Failed to cancel appointment.");
      }
    } catch (error) {
      console.error("Error canceling appointment:", error);
      Alert.alert(
        "Error",
        error.message || "An error occurred while canceling the appointment."
      );
    }
  };

  const renderAppointment = ({ item }) => {
    // Parse the appointment date and time
    const appointmentDate = new Date(item.appointment_date); // Includes timezone
    const [hours, minutes, seconds] = item.appointment_time
      .split(":")
      .map(Number);

    // Adjust the time part of the appointment date
    appointmentDate.setHours(hours, minutes, seconds);

    // Compare adjusted date with the current date
    const now = new Date();
    const isUpcoming = appointmentDate > now && item.app_status !== "Completed";

    // Determine the status to display
    let displayStatus;
    if (item.app_status === "pending") {
      displayStatus = "Pending";
    } else {
      displayStatus = isUpcoming ? "Upcoming" : "Completed";
    }

    // Check if the profile image is a Base64 string
    let imageUri = item.profile_image
      ? `data:image/png;base64,${item.profile_image}` // Add MIME type prefix
      : "https://via.placeholder.com/150"; // Fallback image

    // Function to format the date and time
    const formatDateTime = (dateString, timeString) => {
      const date = new Date(dateString);

      const options = { day: "2-digit", month: "2-digit", year: "numeric" };
      const formattedDate = date.toLocaleDateString("en-GB", options); // Format as DD-MM-YYYY

      const timeParts = timeString.split(":");
      let hours = parseInt(timeParts[0], 10);
      const minutes = timeParts[1];
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'

      const formattedTime = `${hours}:${minutes} ${ampm}`;

      return `${formattedDate}, ${formattedTime}`;
    };

    const formattedDateTime = formatDateTime(
      item.appointment_date,
      item.appointment_time
    );

    return (
      <View
        style={[styles.outterCard, isUpcoming ? styles.upcoming : styles.past]}
      >
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("HistoryAppDetails", {
              appointmentId: item.appointment_id,
            })
          }
        >
          <View style={styles.card}>
            <Image source={{ uri: imageUri }} style={styles.doctorImage} />

            <View style={styles.doctorInfo}>
              <Text style={styles.doctorName}>{item.doctor_name}</Text>
              <Text style={styles.doctorDetails}>
                {item.category || item.doctor_specialization} | {item.location}
              </Text>
              <Text
                style={[
                  styles.appointmentType,
                  {
                    color:
                      item.appointment_type === "physical"
                        ? "#1E90FF"
                        : "#fd1dfd", // Blue for physical, green for virtual
                    fontWeight: "bold", // Optional: emphasize text for both types
                  },
                ]}
              >
                {item.appointment_type === "physical"
                  ? "Physical Appointment"
                  : "Virtual Appointment"}{" "}
              </Text>
              <Text style={styles.date}>{formattedDateTime}</Text>
              <View style={styles.statusContainer}>
                <Text style={styles.doctorDetails}>Status: </Text>
                <Text style={styles.status}>{displayStatus}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.doctorInfo}>
          {isUpcoming && (
            <TouchableOpacity
              style={styles.sCancelButton}
              onPress={() =>
                cancelAppointment(item.appointment_id, item.is_virtual)
              }
            >
              <Text style={styles.sCancelButtonText}>Cancel Appointment</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Image
        source={require("../../../assets/NothingDog.png")}
        style={[{ marginTop: 150 }, styles.emptyImage]}
      />
      <Text style={styles.emptyText}>No appointments found.</Text>
    </View>
  );

  return (
    <ImageBackground
      source={require("../../../assets/PlainGrey.png")}
      style={styles.background}
    >
      <View style={styles.smallHeaderContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.hpTitle}>Scheduled Appointments</Text>
      </View>

      <View style={styles.uAcontainer}>
        <Text style={styles.sectionTitle}>My Appointments</Text>
        <View style={styles.singleUnderline}></View>
        {loading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : (
          <FlatList
            data={appointments}
            keyExtractor={(item) => item.appointment_id}
            renderItem={renderAppointment}
            ListEmptyComponent={renderEmptyComponent}
          />
        )}
        <TouchableOpacity
          style={styles.signOutButton}
          onPress={() => navigation.navigate("MainPage")}
        >
          <Text style={styles.signOutButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
      <NavigationBar
        navigation={navigation}
        activePage={loggedInUserId === userId ? "AppointmentHistory" : ""} // Set activePage based on userId match
        userId={loggedInUserId}
      />
    </ImageBackground>
  );
};

export default AppointmentHistoryScreen;
