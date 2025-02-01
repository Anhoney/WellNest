import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ImageBackground,
  ScrollView,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../../../config/config";
import styles from "../../components/styles";
import NavigationBar from "../../components/NavigationBar";

const AppointmentConfirmationScreen = ({ route, navigation }) => {
  const {
    doctorId,
    doctor,
    selectedDate,
    selectedTime,
    medicalCoverage,
    whoWillSee,
    patientSeenBefore,
    reason,
    note,
    userDetails, // Retrieved from the user profile
  } = route.params;
  console.log("doctorId:", doctorId);
  const imageUri = doctor.profile_image
    ? `data:image/png;base64,${doctor.profile_image}`
    : "https://via.placeholder.com/150";
  const [modalVisible, setModalVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [appointmentId, setAppointmentId] = useState(null);

  const handleConfirmAppointment = async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      alert("No token found. Please log in.");
      return;
    }

    const bookingDetails = {
      doctorId: doctorId,
      u_id: userDetails.id, // Logged-in user ID from profile
      date: selectedDate,
      time: selectedTime,
      app_status: "Pending",
      medicalCoverage: medicalCoverage,
      whoWillSee: whoWillSee,
      patientSeenBefore: patientSeenBefore,
      app_sickness: reason,
      //   app_description
      //   app_address: doctor.location,
      note: note,
    };

    try {
      console.log("bookingDetails:", bookingDetails);
      const response = await fetch(`${API_BASE_URL}/bookAppointment`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(bookingDetails),
      });

      const result = await response.json();

      if (response.ok) {
        // Set the date and time for the modal
        setSuccessMessage(
          `Appointment scheduled successfully for:\n${selectedDate}, ${selectedTime}`
        );
        setAppointmentId(result.appointmentId);
        // Show success modal
        setModalVisible(true);
        // Alert.alert(
        //   "Success",
        //   `Appointment scheduled successfully for:\n${selectedDate}, ${selectedTime}`,
        //   [
        //     {
        //       text: "Close",
        //       onPress: () => navigation.navigate("AppointmentHistory"),
        //     },
        //   ]
        // );
        // Store the appointment ID for navigation
        // const appointmentId = result.appointmentId; // Get the appointment ID from the response
        // console.log("Appointment ID:", appointmentId);
      } else {
        alert(result.error || "Failed to book appointment");
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("An error occurred while booking the appointment.");
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    console.log("appointmentId:", appointmentId);
    if (appointmentId) {
      navigation.navigate("HistoryAppDetails", {
        appointmentId: appointmentId,
      });
    }
  };

  return (
    <ImageBackground
      source={require("../../../assets/DoctorDetails.png")}
      style={[styles.background, { flex: 1 }]}
    >
      {/* Title Section with Back chevron-back */}
      <View style={styles.smallHeaderContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}> Confirm Booking </Text>
      </View>

      <View style={styles.uAContainer}>
        {/* Static Doctor Info */}
        <View style={styles.transDoctorCard}>
          <Image source={{ uri: imageUri }} style={styles.doctorImage} />
          <View style={styles.doctorInfo}>
            <Text style={styles.doctorName}>{doctor.username}</Text>
            <Text style={styles.doctorCategory}>{doctor.category}</Text>
            <Text style={styles.description}>Location: {doctor.location}</Text>
            <Text style={styles.doctorRating}>⭐ {doctor.rating || "N/A"}</Text>
          </View>
        </View>
      </View>
      <View style={styles.uAContainer}>
        <Text style={styles.label}>Selected Date and Time:</Text>
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>{selectedDate}</Text>

          <Text style={styles.infoText}>{selectedTime}</Text>
        </View>
      </View>

      <View style={styles.uAcontainer}>
        <View style={styles.whiteUAcontainer}>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <Text style={styles.aLabel}>Location</Text>
            <View style={styles.displayUnderline} />
            <Text style={styles.sectionContent}>
              {doctor.location} {"\n"}
              {doctor.hospital_address}
              {"\n"}
            </Text>
            <Text style={styles.aLabel}>Details</Text>
            <View style={styles.displayUnderline} />
            <View style={styles.tableContainer}>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Medical Coverage:</Text>
                <Text style={styles.tableCell}>{medicalCoverage}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Reason:</Text>
                <Text style={styles.tableCell}>{reason}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Customer Name:</Text>
                <Text style={styles.tableCell}>{userDetails.full_name}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Gender:</Text>
                <Text style={styles.tableCell}>{userDetails.gender}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Special Request:</Text>
                <Text style={styles.tableCell}>{note || "N/A"}</Text>
              </View>
            </View>
            {/* <Text>Medical Coverage: {medicalCoverage}</Text>
            <Text>Reason: {reason}</Text>
            <Text>Customer Name: {userDetails.full_name}</Text>
            <Text>Gender: {userDetails.gender}</Text>
            <Text>Notes: {note}</Text> */}
            <TouchableOpacity
              style={styles.signOutButton}
              onPress={handleConfirmAppointment}
            >
              <Text style={styles.buttonText}>Confirm Appointment</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Image
              source={require("../../../assets/SuccessBooking.png")}
              style={styles.successImage}
            />
            <Text style={styles.modalText}>{successMessage}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCloseModal}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* </View> */}
      <NavigationBar navigation={navigation} activePage="" />
    </ImageBackground>
  );
};

export default AppointmentConfirmationScreen;
