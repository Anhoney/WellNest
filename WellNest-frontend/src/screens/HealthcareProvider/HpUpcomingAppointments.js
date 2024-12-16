//HpUpcomingAppointments.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
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

const HpUpcomingAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  // useEffect(() => {
  //   fetchUpcomingAppointments();
  // }, []);
  useFocusEffect(
    React.useCallback(() => {
      fetchUpcomingAppointments();
    }, [])
  );

  const fetchUpcomingAppointments = async () => {
    try {
      const hpId = await getUserIdFromToken(); // Get healthcare provider ID
      console.log("hpId:", hpId);
      if (!hpId) {
        Alert.alert("Error", "Unable to fetch user information.");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/getUpcomingAppointment/${hpId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch appointments.");
      }

      const data = await response.json();
      setAppointments(data);
      console.log("appointments", data);
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
        `${API_BASE_URL}/appointments/approve/${appointmentId}`,
        { method: "PUT" }
      );
      if (!response.ok) {
        throw new Error("Failed to approve appointment.");
      }

      const data = await response.json();
      Alert.alert("Success", "Appointment approved successfully.");
      fetchUpcomingAppointments(); // Refresh the list
    } catch (error) {
      console.error("Error approving appointment:", error);
      Alert.alert("Error", "Failed to approve appointment.");
    }
  };

  const renderAppointment = ({ item }) => {
    // Log the appointment date for debugging
    console.log("appointments", item.app_date);
    // Convert date and time into readable formats
    //   const formattedDate = item.app_date; // Already formatted by backend
    //   const formattedTime = item.app_time; // Already formatted by backend
    let imageUri = item.profile_image
      ? item.profile_image // Base64 string returned from the backend
      : "https://via.placeholder.com/150";

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate("HpUpcomingAppointmentDetails", {
            hp_app_id: item.hp_app_id,
          })
        }
      >
        <Image source={{ uri: imageUri }} style={styles.doctorImage} />
        <View style={styles.doctorInfo}>
          <Text style={styles.doctorName}>{item.full_name}</Text>
          <Text style={styles.details}>Date: {item.app_date}</Text>
          <Text style={styles.details}>Time: {item.app_time}</Text>
          <Text style={styles.details}>Patient: {item.who_will_see}</Text>
          <Text style={styles.details}>Status: {item.app_status}</Text>

          {item.app_status === "pending" && (
            <TouchableOpacity
              style={styles.approveButton}
              onPress={() => approveAppointment(item.hp_app_id)}
            >
              <View style={styles.statusContainer}>
                <Ionicons name="checkmark-circle" size={24} color="green" />
                <Text style={styles.approveText}>Approve</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

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
        <Text style={styles.hpTitle}>Upcoming Appointments </Text>
      </View>
      <View style={styles.hpContainer}>
        <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
        <View style={styles.singleUnderline}></View>
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <FlatList
            data={appointments}
            keyExtractor={(item) => item.hp_app_id.toString()}
            renderItem={renderAppointment}
            ListEmptyComponent={<Text>No upcoming appointments found.</Text>}
          />
        )}
      </View>
      {/* Navigation Bar */}
      <HpNavigationBar navigation={navigation} />
    </ImageBackground>
  );
};

export default HpUpcomingAppointments;
