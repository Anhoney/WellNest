// SocialEventDetails,js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Alert,
  Modal,
} from "react-native";
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";
import API_BASE_URL from "../../../config/config";
import { Ionicons } from "@expo/vector-icons"; // Import icons from Expo
import styles from "../../components/styles"; // Import shared styles
import axios from "axios";
import CoNavigationBar from "../../components/CoNavigationBar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserIdFromToken } from "../../../services/authService";

// Import a default photo from your assets or provide a URL
const defaultPhoto = require("../../../assets/elderlyEventPhoto.webp");

const SocialEventDetails = () => {
  const [eventDetails, setEventDetails] = useState(null);
  const route = useRoute(); // Get route params
  const navigation = useNavigation();
  const { eventId } = route.params; // Assume eventId is passed as a param
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const fetchUserIdAndEvents = async () => {
        setLoading(true);
        const userId = await getUserIdFromToken();
        if (userId) {
          setUserId(userId);
          await checkUserRegistration(userId, eventId);
        }
        setLoading(false);
      };
      fetchUserIdAndEvents();
      fetchEventDetails();
    }, [])
  );

  const fetchEventDetails = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        alert("No token found. Please log in.");
        return;
      }
      const response = await fetch(`${API_BASE_URL}/single/event/${eventId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setEventDetails(data);
    } catch (error) {
      console.error("Failed to fetch event details:", error);
    }
  };
  const checkUserRegistration = async (userId, eventId) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        alert("No token found. Please log in.");
        return;
      }
      const response = await fetch(
        `${API_BASE_URL}/user/${userId}/event/${eventId}/registration`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setIsRegistered(data.registered); // Update registration status based on response
    } catch (error) {
      console.error("Failed to check user registration:", error);
    }
  };

  const handleCancelRegistration = () => {
    setDeleteModalVisible(true); // Show the confirmation modal for cancellation
  };

  const confirmCancellation = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        alert("No token found. Please log in.");
        return;
      }
      const response = await axios.delete(
        `${API_BASE_URL}/events/${eventId}/participants/${userId}`, // Adjust the endpoint as needed
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        Alert.alert(
          "Success",
          "You have successfully canceled your registration.",
          [
            {
              text: "OK",
              onPress: () => {
                setIsRegistered(false); // Update registration status
                navigation.navigate("SocialEventsScreen", {
                  activeTab: "ongoing", // Navigate back to the upcoming tab
                });
              },
            },
          ],
          { cancelable: false }
        );
      } else {
        Alert.alert("Error", "Failed to cancel registration.");
      }
    } catch (error) {
      console.error("Failed to cancel registration:", error);
      Alert.alert("Error", "Failed to cancel registration.");
    } finally {
      setDeleteModalVisible(false); // Close the delete modal
    }
  };

  const handleRegister = async () => {
    if (!userId) {
      Alert.alert("Error", "User  ID not found.");
      return;
    }
    setModalVisible(true); // Show the confirmation modal
  };

  const confirmRegistration = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        alert("No token found. Please log in.");
        return;
      }
      const response = await axios.post(
        `${API_BASE_URL}/events/${eventId}/register`, // Adjust the endpoint as needed
        { user_id: userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        setModalVisible(false); // Close the confirmation modal
        setSuccessModalVisible(true); // Show success modal
      } else {
        Alert.alert("Error", "Failed to register for the event.");
      }
    } catch (error) {
      console.error("Failed to register for the event:", error);
      // Check for duplicate registration error
      if (error.response && error.response.status === 400) {
        Alert.alert(
          "Registration Error",
          "You have already registered for this event."
        );
      } else {
        console.error("Failed to register for the event:", error);
        Alert.alert("Error", "Failed to register for the event.");
      }
    } finally {
      setModalVisible(false); // Close the modal after registration
    }
  };

  if (!eventDetails) {
    return <Text>Loading event details...</Text>;
  }

  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    const date = new Date(dateString);

    // Get the day, month, and year separately
    const day = date.toLocaleString("en-US", { day: "numeric" });
    const month = date.toLocaleString("en-US", { month: "long" });
    const year = date.toLocaleString("en-US", { year: "numeric" });

    // Return the formatted date in the desired format
    return `${day} ${month} ${year}`;
  };

  const formatFees = (fees) => {
    if (fees && fees.toLowerCase() === "free") {
      return "FREE";
    } else if (!isNaN(fees) && !isNaN(parseFloat(fees))) {
      return `RM ${fees}`;
    } else {
      return fees; // Show fees as-is if it's not numeric or "free"
    }
  };

  if (!eventDetails) {
    return <Text>Loading event details...</Text>;
  }

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
        <Text style={styles.hpTitle}>{eventDetails.title}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollView}>
        <Image
          source={
            eventDetails.photo ? { uri: eventDetails.photo } : defaultPhoto
          }
          style={styles.eventImage}
        />
        <View style={styles.hpContainer}>
          <View style={styles.eventDetailsCard}>
            <View style={styles.eventRow}>
              <Text style={styles.eventCardTitle}>{eventDetails.title}</Text>
              <Text style={styles.eventPrice}>
                {formatFees(eventDetails.fees)}
              </Text>
            </View>
            <View style={styles.displayUnderline} />
            <Text style={styles.eventSectionTitle}>Details</Text>
            <View style={styles.displayUnderline} />
            <Text style={styles.eventDetailText}>
              Location: {"\n"}
              {eventDetails.location}
              {"\n"}
            </Text>
            <Text style={styles.eventDetailText}>
              Date: {"\n"}
              {eventDetails.event_date}
              {"\n"}
            </Text>
            <Text style={styles.eventDetailText}>
              Time: {"\n"}
              {eventDetails.event_time}
              {"\n"}
            </Text>
            <Text style={styles.eventDetailText}>
              Registration Due: {"\n"}
              {formatDate(eventDetails.registration_due)}
              {"\n"}
            </Text>
            <Text style={styles.eventDetailText}>
              Capacity: {"\n"}
              {eventDetails.capacity || "N/A"}
              {"\n"}
            </Text>

            <Text style={styles.eventSectionTitle}>Terms And Conditions</Text>
            <View style={styles.displayUnderline} />
            <Text style={styles.eventDetailText}>
              {eventDetails.terms_and_conditions}
            </Text>

            <Text style={styles.eventSectionTitle}>Organizers</Text>
            <View style={styles.displayUnderline} />
            <Text style={[styles.eventDetailText, { fontWeight: "bold" }]}>
              {eventDetails.username}
            </Text>
            <Text style={styles.eventDetailText}>
              {eventDetails.organizer_details}
            </Text>
          </View>

          {isRegistered ? (
            <TouchableOpacity
              style={styles.eventButton}
              onPress={handleCancelRegistration}
            >
              <Text style={styles.eventButtonText}>Cancel Registration</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.eventButton}
              onPress={handleRegister}
            >
              <Text style={styles.eventButtonText}>Register</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Confirmation Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Confirm Registration</Text>
            <Image
              source={require("../../../assets/TeaPot.png")}
              style={styles.successImage}
            />
            <Text style={styles.modalMessage}>
              Are you sure you want to register for this event?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[
                  styles.modalConfirmButton,
                  { backgroundColor: "#ff8b49" },
                ]}
                onPress={confirmRegistration} // Confirm action
              >
                <Text style={styles.modalConfirmButtonText}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setModalVisible(false)} // Cancel action
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
        visible={successModalVisible}
        onRequestClose={() => setSuccessModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Congratulations!</Text>
            <Image
              source={require("../../../assets/OrangeSinging.png")}
              style={styles.successImage}
            />
            <Text style={styles.modalMessage}>
              You have successfully registered for the event. You can always
              refer back to the event details in your ongoing events and groups
              section.
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setSuccessModalVisible(false); // Close the success modal
                navigation.navigate("SocialEventsScreen", {
                  activeTab: "ongoing",
                });
              }}
            >
              <Text style={styles.modalConfirmButtonText}>Back to Events</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isDeleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Confirm Cancellation</Text>
            <Image
              source={require("../../../assets/DeleteCat.png")}
              style={styles.successImage} // Style for the image
            />
            <Text style={styles.modalMessage}>
              Are you sure you want to cancel your registration for this event?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalConfirmButton}
                onPress={confirmCancellation}
              >
                <Text style={styles.modalConfirmButtonText}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Navigation Bar */}
      <CoNavigationBar navigation={navigation} />
    </ImageBackground>
  );
};

export default SocialEventDetails;
