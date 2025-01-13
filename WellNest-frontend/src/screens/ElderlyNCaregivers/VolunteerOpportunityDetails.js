//VolunteerOpportunityDetails,js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  Image,
  ScrollView,
  StyleSheet,
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
const defaultPhoto = require("../../../assets/elderlyOpportunityPhoto.webp");

const VolunteerOpportunityDetails = () => {
  const [opportunityDetails, setOpportunityDetails] = useState(null);
  const route = useRoute(); // Get route params
  const navigation = useNavigation();
  const { opportunityId } = route.params; // Assume opportunityId is passed as a param
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const fetchUserIdAndOpportunities = async () => {
        setLoading(true);
        const userId = await getUserIdFromToken();
        console.log("userId", userId);
        if (userId) {
          setUserId(userId);
          //   await fetchOpportunities(co_id);
          await fetchOpportunityDetails();
          await checkUserRegistration(userId, opportunityId); // Check if user is registered
          setLoading(false);
        }
        setLoading(false);
      };
      fetchUserIdAndOpportunities();
      fetchOpportunityDetails();
      fetchUserIdAndOpportunities();
    }, [])
  );

  const fetchOpportunityDetails = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        alert("No token found. Please log in.");
        return;
      }
      const response = await fetch(
        `${API_BASE_URL}/single/opportunity/${opportunityId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Use your actual token
          },
        }
      );
      const data = await response.json();
      setOpportunityDetails(data);
    } catch (error) {
      console.error("Failed to fetch opportunity details:", error);
    }
  };

  const checkUserRegistration = async (userId, opportunityId) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        alert("No token found. Please log in.");
        return;
      }
      const response = await fetch(
        `${API_BASE_URL}/user/${userId}/opportunity/${opportunityId}/registration`,
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

  //   const handleCancelRegistration = async () => {
  //     try {
  //       const token = await AsyncStorage.getItem("token");
  //       if (!token) {
  //         alert("No token found. Please log in.");
  //         return;
  //       }
  //       const response = await axios.delete(
  //         `${API_BASE_URL}/opportunities/${opportunityId}/participants/${userId}`, // Adjust the endpoint as needed
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );

  //       if (response.status === 200) {
  //         Alert.alert(
  //           "Success",
  //           "You have successfully canceled your registration."
  //         );
  //         setIsRegistered(false); // Update registration status
  //       } else {
  //         Alert.alert("Error", "Failed to cancel registration.");
  //       }
  //     } catch (error) {
  //       console.error("Failed to cancel registration:", error);
  //       Alert.alert("Error", "Failed to cancel registration.");
  //     }
  //   };

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
        `${API_BASE_URL}/opportunities/${opportunityId}/participants/${userId}`, // Adjust the endpoint as needed
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
                navigation.navigate("VolunteerOpportunitiesScreen", {
                  activeTab: "upcoming", // Navigate back to the upcoming tab
                });
              },
            },
          ],
          { cancelable: false }
        );
        // );
        // setIsRegistered(false); // Update registration status
        // navigation.navigate("VolunteerOpportunitiesScreen", {
        //   activeTab: "upcoming", // Navigate back to the upcoming tab
        // });
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
        `${API_BASE_URL}/opportunities/${opportunityId}/participants`, // Adjust the endpoint as needed
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
        setIsRegistered(true); // Update registration status
        // Alert.alert(
        //   "Success",
        //   "You have successfully registered for the opportunity."
        // );
      } else {
        Alert.alert("Error", "Failed to register for the opportunity.");
      }
    } catch (error) {
      console.error("Failed to register for the opportunity:", error);
      // Check for duplicate registration error
      if (error.response && error.response.status === 400) {
        Alert.alert(
          "Registration Error",
          "You have already registered for this opportunity."
        );
      } else {
        console.error("Failed to register for the opportunity:", error);
        Alert.alert("Error", "Failed to register for the opportunity.");
      }
      //   if (error.response && error.response.data.error) {
      //     Alert.alert("Error", error.response.data.error); // Show the error message from the backend
      //   } else {
      //     Alert.alert("Error", "Failed to register for the opportunity.");
      //   }
    } finally {
      setModalVisible(false); // Close the modal after registration
    }
  };

  if (!opportunityDetails) {
    return <Text>Loading opportunity details...</Text>;
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

  if (!opportunityDetails) {
    return <Text>Loading opportunity details...</Text>;
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
        <Text style={styles.hpTitle}>{opportunityDetails.title}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollView}>
        <Image
          source={
            opportunityDetails.photo
              ? { uri: opportunityDetails.photo }
              : defaultPhoto
          }
          style={styles.eventImage}
        />
        <View style={styles.hpContainer}>
          <View style={styles.eventDetailsCard}>
            <View style={styles.eventRow}>
              <Text style={styles.eventCardTitle}>
                {opportunityDetails.title}
              </Text>
              <Text style={styles.eventPrice}>
                {formatFees(opportunityDetails.fees)}
              </Text>
            </View>
            <View style={styles.displayUnderline} />
            <Text style={styles.eventSectionTitle}>Details</Text>
            <View style={styles.displayUnderline} />
            <Text style={styles.eventDetailText}>
              Location: {"\n"}
              {opportunityDetails.location}
              {"\n"}
            </Text>
            <Text style={styles.eventDetailText}>
              Date: {"\n"}
              {opportunityDetails.opportunity_date}
              {"\n"}
            </Text>
            <Text style={styles.eventDetailText}>
              Time: {"\n"}
              {opportunityDetails.opportunity_time}
              {"\n"}
            </Text>
            <Text style={styles.eventDetailText}>
              Registration Due: {"\n"}
              {formatDate(opportunityDetails.registration_due)}
              {"\n"}
            </Text>
            <Text style={styles.eventDetailText}>
              Capacity: {"\n"}
              {opportunityDetails.capacity || "N/A"}
              {"\n"}
            </Text>

            <Text style={styles.eventSectionTitle}>Terms And Conditions</Text>
            <View style={styles.displayUnderline} />
            <Text style={styles.eventDetailText}>
              {opportunityDetails.terms_and_conditions}
            </Text>

            <Text style={styles.eventSectionTitle}>Organizers</Text>
            <View style={styles.displayUnderline} />
            <Text style={[styles.eventDetailText, { fontWeight: "bold" }]}>
              {opportunityDetails.username}
            </Text>
            <Text style={styles.eventDetailText}>
              {opportunityDetails.organizer_details}
            </Text>
          </View>

          {/* <TouchableOpacity style={styles.eventButton} onPress={handleRegister}>
            <Text style={styles.eventButtonText}>Register</Text>
          </TouchableOpacity> */}
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
              Are you sure you want to register for this opportunity?
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
              source={require("../../../assets/VolunteerSuccess.png")}
              style={styles.successImage}
            />
            <Text style={styles.modalMessage}>
              You have successfully registered for the volunteer event. You can
              always refer back to the opportunities details at your upcoming
              opportunities section.
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setSuccessModalVisible(false); // Close the success modal
                navigation.navigate("VolunteerOpportunitiesScreen", {
                  activeTab: "upcoming",
                });
              }}
            >
              <Text style={styles.modalConfirmButtonText}>
                Back to Opportunities
              </Text>
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
              Are you sure you want to cancel your registration for this
              opportunity?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalConfirmButton}
                // onPress={() => {
                //   handleDelete();
                //   setDeleteModalVisible(false);
                // }}
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

export default VolunteerOpportunityDetails;
