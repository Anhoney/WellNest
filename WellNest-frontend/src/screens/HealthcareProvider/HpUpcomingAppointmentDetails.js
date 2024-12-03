// HpUpcomingAppointment.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  ScrollView,
  ImageBackground,
  Image,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../../components/styles"; // Import shared styles
import HpNavigationBar from "../../components/HpNavigationBar"; // Import your custom navigation bar component
import API_BASE_URL from "../../../config/config";
import { getUserIdFromToken } from "../../../services/authService";
import { format } from "date-fns";

const HpUpcomingAppointmentDetails = ({ route }) => {
  const { hp_app_id } = route.params; // Get appointmentId from route params
  const [appointments, setAppointments] = useState([]);
  const [userId, setUserId] = useState(null);
  const navigation = useNavigation();

  console.log("hp_app_id:", hp_app_id);

  useEffect(() => {
    const fetchUserId = async () => {
      const userId = await getUserIdFromToken();
      // console.log("userId:", userId);
      if (userId) {
        setUserId(userId);
        // fetchProfile(userId);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    // Ensure appointments are fetched only when userId is set
    // if (userId) {
    fetchAppointments();
    // }
  }, [userId]);

  const fetchAppointments = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        alert("No token found. Please log in.");
        return;
      }

      const response = await axios.get(
        `${API_BASE_URL}/appointment/details/${hp_app_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      //   console.log("Fetched appointment details:", response.data); // Log the response
      setAppointments(response.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      alert("Error fetching appointments.");
    }
  };
  // Format the created_at date to a more human-readable format
  const formatCreatedAt = (dateString) => {
    if (!dateString) {
      console.warn("Invalid date string:", dateString);
      return "N/A"; // Return a default value if the date string is invalid
    }

    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.warn("Invalid date value:", dateString);
      return "N/A"; // Return a default value if the date is invalid
    }

    return format(date, "MMMM d, yyyy, h:mm a");
  };

  const deleteAppointment = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        alert("No token found. Please log in.");
        return;
      }

      const response = await axios.delete(
        `${API_BASE_URL}/appointment/delete/${hp_app_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        Alert.alert("Success", "Appointment deleted successfully.");
        navigation.goBack(); // Navigate back after deletion
      }
    } catch (error) {
      console.error("Error deleting appointment:", error);
      Alert.alert("Error", "Failed to delete appointment.");
    }
  };

  // In your render method, log the created_at value
  //   console.log("Created At:", appointments.created_at);
  // Format the created_at date to a more human-readable format
  //   const formatCreatedAt = (dateString) => {
  //     return format(new Date(dateString), "MMMM d, yyyy, h:mm a");
  //   };
  //   const handleDelete = async (id) => {
  //     try {
  //       const token = await AsyncStorage.getItem("token");
  //       if (!token) {
  //         alert("No token found. Please log in.");
  //         return;
  //       }

  //       await axios.delete(`${API_BASE_URL}/appointments/${id}`, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });
  //       Alert.alert("Deleted", "Appointment deleted successfully");
  //       fetchAppointments(userId);
  //     } catch (error) {
  //       console.error("Error deleting appointment:", error);
  //       Alert.alert("Error", "Failed to delete appointment");
  //     }
  //   };

  //   const renderAppointment = ({ item }) => (
  //     <View style={styles.hpAppointmentContainer}>
  //       <View style={styles.appointmentHeader}>
  //         <Text style={styles.createdByText}>Created by: </Text>
  //         <TouchableOpacity onPress={() => handleDelete(item.id)}>
  //           <FontAwesome name="trash" size={20} color="black" />
  //         </TouchableOpacity>
  //       </View>
  //       <Text style={styles.appointmentDate}>
  //         {new Date(item.created_at).toLocaleDateString("en-GB", {
  //           day: "2-digit",
  //           month: "long",
  //           year: "numeric",
  //           hour: "2-digit",
  //           minute: "2-digit",
  //           hour12: true,
  //         })}
  //       </Text>
  //       <Text style={styles.category}>
  //         Category: {item.category || "N/A"} {/* Display category */}
  //       </Text>
  //       <View style={styles.hpAbuttonContainer}>
  //         <TouchableOpacity
  //           style={styles.hpAbutton}
  //           onPress={() => handleEdit(item.id)}
  //           // onPress={() => navigation.navigate("HpAppointmentEditPage")}
  //         >
  //           <Text style={styles.hpAbuttonText}>Edit creation</Text>
  //         </TouchableOpacity>
  //         <TouchableOpacity style={styles.hpAbutton}>
  //           <Text style={styles.hpAbuttonText}>Preview</Text>
  //         </TouchableOpacity>
  //       </View>
  //     </View>
  //   );
  //   const handleEdit = (appointmentId) => {
  //     navigation.navigate("HpAppointmentEditPage", { appointmentId });
  //   };
  const imageUri = appointments.profile_image
    ? `data:image/png;base64${appointments.profile_image}`
    : "https://via.placeholder.com/150";
  //   console.log("Image URI:", imageUri);
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
        <Text style={styles.hpTitle}>{appointments.full_name} Details</Text>
      </View>

      <View style={styles.hpAcontainer}>
        <View style={styles.doctorCard}>
          <Image source={{ uri: imageUri }} style={styles.doctorImage} />
          <View style={styles.doctorInfo}>
            <Text style={styles.doctorName}>{appointments.full_name}</Text>
            <Text style={styles.details}>Date: {appointments.app_date}</Text>
            <Text style={styles.details}>Time: {appointments.app_time}</Text>
            <Text style={styles.details}>
              Patient: {appointments.who_will_see}
            </Text>
            <Text style={styles.details}>
              Status: {appointments.app_status}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.uAcontainer}>
        <View style={styles.whiteHpAcontainer}>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <Text style={styles.aLabel}>Booking No.</Text>
            <View style={styles.displayUnderline} />
            <Text style={styles.sectionContent}>{appointments.hp_app_id}</Text>
            <Text style={styles.aLabel}>Patient Details</Text>
            <View style={styles.displayUnderline} />
            <View style={styles.tableContainer}>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Medical Coverage:</Text>
                <Text style={styles.tableCell}>
                  {appointments.medical_coverage}
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Person Seeing Doctor:</Text>
                <Text style={styles.tableCell}>
                  {appointments.who_will_see}
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>
                  Has seen the doctor before:
                </Text>
                <Text style={styles.tableCell}>
                  {appointments.patient_seen_before}
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Reason Visit:</Text>
                <Text style={styles.tableCell}>
                  {appointments.app_sickness}
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Customer Name:</Text>
                <Text style={styles.tableCell}>{appointments.full_name}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Gender:</Text>
                <Text style={styles.tableCell}>{appointments.gender}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Notes:</Text>
                <Text style={styles.tableCell}>
                  {appointments.note || "N/A"}
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Appointment Created At:</Text>
                <Text style={styles.tableCell}>
                  {/* {formatCreatedAt(appointments.created_at)} */}
                  {appointments.created_at
                    ? formatCreatedAt(appointments.created_at)
                    : "N/A"}
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
      <View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={deleteAppointment}
        >
          <Text style={styles.deleteButtonText}>Delete Appointment</Text>
        </TouchableOpacity>
      </View>
      <HpNavigationBar navigation={navigation} />
    </ImageBackground>
  );
};

export default HpUpcomingAppointmentDetails;
