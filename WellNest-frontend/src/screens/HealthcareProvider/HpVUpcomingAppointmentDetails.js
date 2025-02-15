// HpVUpcomingAppointmentDetails.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  ImageBackground,
  Image,
  Modal,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../../components/styles"; // Import shared styles
import HpNavigationBar from "../../components/HpNavigationBar"; // Import your custom navigation bar component
import API_BASE_URL from "../../../config/config";
import { getUserIdFromToken } from "../../../services/authService";
import { format } from "date-fns";
import { WebView } from "react-native-webview"; // Import WebView for PDF display
import ImageViewer from "react-native-image-zoom-viewer"; // Import ImageViewer for image display

const HpVUpcomingAppointmentDetails = ({ route }) => {
  const { hpva_id } = route.params; // Get appointmentId from route params
  const [appointments, setAppointments] = useState([]);
  const [userId, setUserId] = useState(null);
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false); // Modal visibility state
  const [receiptVisible, setReceiptVisible] = useState(false); // Receipt modal visibility state
  const [selectedReceipt, setSelectedReceipt] = useState(null); // State for selected receipt

  useEffect(() => {
    const fetchUserId = async () => {
      const userId = await getUserIdFromToken();
      if (userId) {
        setUserId(userId);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    // Ensure appointments are fetched only when userId is set
    fetchAppointments();
  }, [userId]);

  // Function to format service names
  const formatServiceName = (serviceName) => {
    if (!serviceName) {
      return "N/A"; // Return a default value if serviceName is undefined
    }
    return serviceName.replace(/([A-Z])/g, " $1").trim();
  };

  const fetchAppointments = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        alert("No token found. Please log in.");
        return;
      }

      const response = await axios.get(
        `${API_BASE_URL}/virtual/appointment/details/${hpva_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
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
        `${API_BASE_URL}/virtual/appointment/delete/${hpva_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        Alert.alert("Success", "Appointment deleted successfully.");
        setModalVisible(false); // Close the modal after deletion
        navigation.goBack(); // Navigate back after deletion
      }
    } catch (error) {
      console.error("Error deleting appointment:", error);
      Alert.alert("Error", "Failed to delete appointment.");
    }
  };

  const imageUri = appointments.profile_image
    ? `data:image/png;base64${appointments.profile_image}`
    : "https://via.placeholder.com/150";

  const isPDF = selectedReceipt && selectedReceipt.url.endsWith(".pdf");

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
            <Text style={styles.details}>
              Service: {formatServiceName(appointments.service)}
            </Text>
            <Text style={styles.details}>Date: {appointments.hpva_date}</Text>
            <Text style={styles.details}>Time: {appointments.hpva_time}</Text>
            <Text style={styles.details}>
              Patient: {appointments.who_will_see || "N/A"}
            </Text>
            <Text
              style={[
                styles.details,
                appointments.status === "approved" ? { color: "green" } : {},
              ]}
            >
              Status: {appointments.status}
            </Text>
            <Text
              style={[
                styles.details,
                appointments.payment_status === "uncheck"
                  ? { color: "red" }
                  : {},
                appointments.payment_status === "checked"
                  ? { color: "green" }
                  : {},
              ]}
            >
              Payment Status: {appointments.payment_status}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.uAcontainer}>
        <View style={styles.whiteHpAcontainer}>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <Text style={styles.aLabel}>Booking No.</Text>
            <View style={styles.displayUnderline} />
            <Text style={styles.sectionContent}>{appointments.hpva_id}</Text>
            <Text style={styles.aLabel}>Patient Details</Text>
            <View style={styles.displayUnderline} />
            <View style={styles.tableContainer}>
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
                  {appointments.symptoms || "N/A"}
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Fee:</Text>
                <Text style={styles.tableCell}>RM {appointments.fee}</Text>
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
                <Text style={styles.tableCell}>Phone Number:</Text>
                <Text style={styles.tableCell}>{appointments.phone_no}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Special Requests:</Text>
                <Text style={styles.tableCell}>
                  {appointments.notes || "N/A"}
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Appointment Created At:</Text>
                <Text style={styles.tableCell}>
                  {appointments.created_at
                    ? formatCreatedAt(appointments.created_at)
                    : "N/A"}
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Show Payment Receipt:</Text>
                <TouchableOpacity
                  style={[styles.button, styles.tableCell]} // Add a new style for the button
                  onPress={() => {
                    setSelectedReceipt({ url: appointments.receipt_url }); // Set the selected receipt
                    setReceiptVisible(true); // Show receipt modal
                  }} // Show receipt modal
                >
                  <Text style={styles.showReceiptButtonText}>Show Receipt</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
      <View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => setModalVisible(true)} // Show modal
        >
          <Text style={styles.deleteButtonText}>Delete Appointment</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Confirm Deletion</Text>
            <Image
              source={require("../../../assets/DeleteCat.png")}
              style={styles.successImage} // Style for the image
            />
            <Text style={styles.modalMessage}>
              Are you sure you want to delete this appointment?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalConfirmButton}
                onPress={deleteAppointment}
              >
                <Text style={styles.modalConfirmButtonText}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={receiptVisible}
        onRequestClose={() => setReceiptVisible(false)}
      >
        <Ionicons
          name="close-circle"
          size={36}
          color="red"
          style={styles.HpVcloseIcon}
          onPress={() => {
            setSelectedReceipt(null);
            setReceiptVisible(false);
          }}
        />

        {isPDF ? (
          <WebView
            source={{ uri: appointments.receipt_url }} // Use selectedReceipt.url
            style={{ flex: 1 }}
            onError={(error) => {
              console.error("WebView Error:", error);
              Alert.alert("Error", "Failed to load PDF file.");
            }}
          />
        ) : (
          <ImageViewer
            imageUrls={[{ url: appointments.receipt_url }]} // Use selectedReceipt.url
            enableSwipeDown
            onSwipeDown={() => {
              setSelectedReceipt(null);
              setReceiptVisible(false);
            }}
          />
        )}
      </Modal>

      <HpNavigationBar navigation={navigation} />
    </ImageBackground>
  );
};

export default HpVUpcomingAppointmentDetails;
