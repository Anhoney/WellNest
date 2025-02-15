// FamilyCollabScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  Alert,
  Modal,
} from "react-native";
import styles from "../../components/styles";
import { Ionicons } from "@expo/vector-icons";
import API_BASE_URL from "../../../config/config";
import axios from "axios";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserIdFromToken } from "../../../services/authService";
import NavigationBar from "../../components/NavigationBar";
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";

const FamilyCollabScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userToCollabId, relationship, collabId } = route.params; // Assuming the name and contactNumber are passed as params
  const [userDetails, setUserDetails] = useState(null);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false); // State for modal visibility
  const [collabIdToDelete, setCollabIdToDelete] = useState(null); // Store the ID of the collaboration to delete

  const handleNavigation = (feature) => {
    if (feature === "Prescription Report") {
      navigation.navigate("MedicalReport", { userId: userToCollabId }); // Pass userToCollabId
    } else if (feature === "Schedule") {
      navigation.navigate("AppointmentHistory", { userId: userToCollabId });
    } else if (feature === "Caregiver Information") {
      navigation.navigate("CaregiverInformation", {
        caregiverId: userToCollabId,
      });
    } else if (feature === "Medication Reminder") {
      navigation.navigate("MedicationReminderPage", {
        userId: userToCollabId,
      });
    } else if (feature === "Care Plan Development") {
      navigation.navigate("CarePlanScreen", {
        userId: userToCollabId,
      });
    } else {
      console.log(`Navigating to: ${feature}`);
    }
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.error("No token found. Please log in.");
        return;
      }

      try {
        const response = await axios.get(
          `${API_BASE_URL}/user/details/${userToCollabId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUserDetails(response.data); // Set user details
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [userToCollabId]);

  const handleDisconnect = (collabId) => {
    setCollabIdToDelete(collabId); // Set the ID of the collaboration to delete
    setDeleteModalVisible(true); // Show the confirmation modal
  };

  const confirmDeletion = async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      console.error("No token found. Please log in.");
      return;
    }

    try {
      const response = await axios.delete(
        `${API_BASE_URL}/delete/collaboration/${collabIdToDelete}`, // Assuming userToCollabId is the collabId
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Alert.alert("Success", response.data.message);
      navigation.goBack(); // Navigate back after successful deletion
    } catch (error) {
      console.error("Error disconnecting collaboration:", error);
      Alert.alert("Error", "An error occurred while disconnecting.");
    } finally {
      setDeleteModalVisible(false); // Close the modal
      setCollabIdToDelete(null); // Reset the ID
    }
  };

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
        <Text style={styles.title}>Collaboration</Text>
      </View>

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.hpContainer}>
        <View style={styles.content}>
          <Text style={styles.sectionHeader}>Collaboration Build</Text>
          <View style={styles.displayUnderline}></View>

          {userDetails ? ( // Check if userDetails is not null
            <>
              <Text style={styles.label}>Username: {userDetails.username}</Text>
              <Text style={styles.label}>Relationship: {relationship}</Text>
              <View style={[{ marginTop: 10 }]}></View>
              <Text style={styles.label}>Sharing:</Text>

              {/* Health Order Status Section */}
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Health Status</Text>
                <View style={styles.statusOptions}>
                  <TouchableOpacity
                    onPress={() => handleNavigation("Prescription Report")}
                    style={styles.statusCard}
                  >
                    <Image
                      source={require("../../../assets/PrescriptionBottle.png")}
                      style={styles.statusIcon}
                    />
                    <Text style={styles.statusText}>Prescription History</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleNavigation("Schedule")}
                    style={styles.statusCard}
                  >
                    <Image
                      source={require("../../../assets/Schedule.png")}
                      style={styles.statusIcon}
                    />
                    <Text style={styles.statusText}>Schedule</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleNavigation("Medication Reminder")}
                    style={styles.statusCard}
                  >
                    <Image
                      source={require("../../../assets/MedicationReminder.png")}
                      style={styles.statusIcon}
                    />
                    <Text style={styles.statusText}>Medication Reminder</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Care Plan Section */}
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Care Plan</Text>
                <View style={styles.statusOptions}>
                  <TouchableOpacity
                    onPress={() => handleNavigation("Caregiver Information")}
                    style={styles.statusCard}
                  >
                    <Image
                      source={require("../../../assets/CaregiverInformation.png")}
                      style={styles.statusIcon}
                    />
                    <Text style={styles.statusText}>Caregiver Information</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleNavigation("Care Plan Development")}
                    style={styles.item}
                  >
                    <Image
                      source={require("../../../assets/CarePlanDevelopment.png")}
                      style={[{ marginLeft: -12 }, styles.statusIcon]}
                    />
                    <Text style={[{ marginLeft: -20 }, styles.statusText]}>
                      Care Plan{"\n"}Development
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Contact Number */}
              <View style={styles.sectionContainer}>
                <Text style={styles.label}>Contact Number</Text>
                <Text style={styles.contactNumber}>
                  {userDetails.phone_no}
                  {"\n"}
                </Text>
              </View>

              {/* Disconnect Button */}
              <TouchableOpacity
                onPress={() => handleDisconnect(collabId)}
                style={styles.signOutButton}
              >
                <Text style={styles.signOutButtonText}>Disconnect</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text style={styles.loadingText}>Loading user details...</Text> // Loading state
          )}
        </View>
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isDeleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Confirm Disconnection</Text>
            <Image
              source={require("../../../assets/DeleteCat.png")}
              style={styles.successImage} // Style for the image
            />
            <Text style={styles.modalMessage}>
              Are you sure you want to disconnect this collaboration?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalConfirmButton}
                onPress={confirmDeletion}
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
      <NavigationBar navigation={navigation} activePage="" />
    </ImageBackground>
  );
};

export default FamilyCollabScreen;
