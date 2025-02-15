// HpVPastAppointments.js
import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  ImageBackground,
  Image,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../../../config/config";
import axios from "axios";
import { getUserIdFromToken } from "../../../services/authService";
import Ionicons from "react-native-vector-icons/Ionicons";
import { format } from "date-fns";
import HpNavigationBar from "../../components/HpNavigationBar"; // Import your custom navigation bar component
import styles from "../../components/styles"; // Import shared styles

const HpVPastAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      fetchPastAppointments();
    }, [])
  );

  const fetchPastAppointments = async () => {
    try {
      const hpId = await getUserIdFromToken(); // Get healthcare provider ID
      if (!hpId) {
        Alert.alert("Error", "Unable to fetch user information.");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/virtual/getPastAppointments/${hpId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch appointments.");
      }

      const data = await response.json();

      // Check for medical report existence for each appointment
      const updatedAppointments = await Promise.all(
        data.map(async (appointment) => {
          const reportExists = await checkMedicalReportExists(
            appointment.hpva_id
          );

          return { ...appointment, reportExists };
        })
      );

      setAppointments(updatedAppointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      Alert.alert("Error", "Failed to fetch appointments.");
    } finally {
      setLoading(false);
    }
  };

  const approveAppointment = async (appointmentId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/virtual/appointments/approve/${appointmentId}`,
        { method: "PUT" }
      );
      if (!response.ok) {
        throw new Error("Failed to approve appointment.");
      }

      const data = await response.json();
      Alert.alert("Success", "Appointment approved successfully.");
      fetchPastAppointments(); // Refresh the list
    } catch (error) {
      console.error("Error approving appointment:", error);
      Alert.alert("Error", "Failed to approve appointment.");
    }
  };

  const checkMedicalReportExists = async (hpva_id) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/medicalReports/check/${hpva_id}/virtual`
      );

      return response.data.exists; // Assume the API returns { exists: true/false }
    } catch (error) {
      console.error("Error checking medical report existence:", error);
      return false; // Default to false in case of an error
    }
  };

  const renderAppointment = ({ item }) => {
    let imageUri = item.profile_image
      ? item.profile_image // Base64 string returned from the backend
      : "https://via.placeholder.com/150";

    const appointmentType = "virtual"; // Set the appointment type for the check

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate("HpVUpcomingAppointmentDetails", {
            hpva_id: item.hpva_id,
          })
        }
      >
        <Image source={{ uri: imageUri }} style={styles.doctorImage} />
        <View style={styles.doctorInfo}>
          <Text style={styles.doctorName}>{item.full_name}</Text>
          <Text style={styles.details}>Date: {item.hpva_date}</Text>
          <Text style={styles.details}>Time: {item.hpva_time}</Text>
          <Text style={styles.details}>Patient: {item.who_will_see}</Text>
          <Text style={styles.details}>Status: {item.status}</Text>

          {/* Conditional rendering for the "Approve" and "Write Medical Report" buttons */}
          {item.status === "pending" && (
            <TouchableOpacity
              style={styles.approveButton}
              onPress={() => approveAppointment(item.hpva_id)}
            >
              <View style={styles.statusContainer}>
                <Ionicons name="checkmark-circle" size={24} color="green" />
                <Text style={styles.approveText}>Approve</Text>
              </View>
            </TouchableOpacity>
          )}

          {item.status === "approved" && (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("MedicalReportWriting", {
                  appointmentId: item.hpva_id,
                  appointment_type: "virtual",
                })
              }
            >
              <View
                style={[
                  styles.buttonStatusContainer,
                  {
                    backgroundColor: item.reportExists ? "#177ffd" : "orange",
                  },
                ]}
              >
                <Ionicons name="document-text" size={24} color="#FFFFFF" />
                <Text style={styles.medicalText}>
                  {item.reportExists
                    ? " Edit Medical Report"
                    : " Write Medical Report"}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (appointments.length === 0) {
    return (
      <ImageBackground
        source={require("../../../assets/PlainGrey.png")}
        style={styles.background}
      >
        {/* Title Section with Back chevron-back */}
        <View style={styles.smallHeaderContainer}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.hpTitle}>Past Appointments </Text>
        </View>

        <View style={styles.centerContent}>
          <Image
            source={require("../../../assets/NothingDog.png")}
            style={styles.noDataImage}
          />
          <Text style={styles.noDataText}>No Past Appointment</Text>
        </View>
      </ImageBackground>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={require("../../../assets/PlainGrey.png")}
        style={styles.background}
      >
        {/* Title Section with Back chevron-back */}
        <View style={styles.smallHeaderContainer}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.hpTitle}>Past Virtual {"\n"} Appointments </Text>
        </View>
        <Text>{"/n"}</Text>
        <View style={styles.singleUnderline}></View>
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <FlatList
            data={appointments}
            keyExtractor={(item) => item.hpva_id.toString()}
            renderItem={renderAppointment}
            contentContainerStyle={styles.hpContainer}
            ListEmptyComponent={<Text>No upcoming appointments found.</Text>}
          />
        )}
        <HpNavigationBar navigation={navigation} />
      </ImageBackground>
    </View>
  );
};

export default HpVPastAppointments;
