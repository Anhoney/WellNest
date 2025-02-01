import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Image,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker"; // New import
import { Ionicons } from "@expo/vector-icons"; // Import icons from Expo
import { FontAwesome } from "@expo/vector-icons"; // Import FontAwesome for the heart icon
import { RadioButton } from "react-native-paper";
import styles from "../../components/styles"; // Import your custom styles
// import DoctorCard from "../../components/DoctorCard"; // Reuse doctor card component
import API_BASE_URL from "../../../config/config";
import axios from "axios";
import NavigationBar from "../../components/NavigationBar";
import { getUserIdFromToken } from "../../../services/authService";
import AsyncStorage from "@react-native-async-storage/async-storage";

const VirtualBookingDetails = ({ route, navigation }) => {
  const { doctorId, selectedService, selectedDate, selectedTime } =
    route.params; // Retrieve passed data
  const [doctor, setDoctor] = useState({});
  const [medicalCoverage, setMedicalCoverage] = useState("No");
  const [symptoms, setSymptoms] = useState("");
  const [allergies, setAllergies] = useState("No");
  const [specificAllergies, setSpecificAllergies] = useState("");
  const [reason, setReason] = useState("");
  const [whoWillSee, setWhoWillSee] = useState("Me");
  const [patientSeenBefore, setPatientSeenBefore] = useState("New Patient");
  const [note, setNote] = useState("");
  const [userId, setUserId] = useState(null);
  const [services, setServices] = useState([]);
  // console.log("Services passed:", selectedService);
  const commonSymptoms = [
    "Allergies",
    "Back pain",
    "Cough",
    "Diarrhea",
    "Dizziness",
    "Flu, cold",
    "Health Screening",
    "Nausea",
    "Joint, Muscle Pain",
    "Skin Conditions",
    "Vomiting",
    "Urinary Complaints",
  ];

  // console.log("BookAppointmentDetailsScreen doctorId:", doctorId);
  const imageUri = doctor.profile_image
    ? `data:image/png;base64,${doctor.profile_image}`
    : "https://via.placeholder.com/150";

  useEffect(() => {
    const fetchUserId = async () => {
      const userId = await getUserIdFromToken();
      // console.log("userId:", userId);
      if (userId) {
        setUserId(userId);
        // fetchProfile(userId);
      }
    };

    const fetchDoctorDetails = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          alert("No token found. Please log in.");
          return;
        }
        console.log("Authorization token:", token); // Debugging log
        const response = await axios.get(
          `${API_BASE_URL}/virtual/doctor/${doctorId}`
        );
        setDoctor(response.data);
        // Parse the services_provide JSON string
        let parsedServices = [];
        try {
          parsedServices = JSON.parse(response.data.services_provide) || [];
        } catch (error) {
          console.error("Error parsing services_provide:", error);
          parsedServices = [];
        }

        setServices(parsedServices);
      } catch (error) {
        Alert.alert("Error", "Failed to fetch doctor details.");
        console.error(error);
      }
    };
    fetchUserId();
    fetchDoctorDetails();
  }, [doctorId, selectedDate]);

  const handleAddSymptom = (symptom) => {
    setSymptoms((prev) => (prev ? `${prev}, ${symptom}` : symptom));
  };

  const handleContinue = async () => {
    const userDetails = await fetchUserDetails(userId); // Function to fetch user profile

    // Dynamically build the navigation payload with only the filled-in data
    const navigationPayload = {
      doctorId,
      doctor,
      services,
      selectedService,
      selectedDate,
      selectedTime,
      ...(symptoms && { symptoms }),
      ...(whoWillSee && { whoWillSee }),
      ...(patientSeenBefore && { patientSeenBefore }),
      ...(allergies && { allergies }),
      ...(note && { note }),
      ...(userDetails && { userDetails }),
    };

    // Navigate with the filtered payload
    navigation.navigate("VirtualConfirmation", navigationPayload);
  };
  // Function to format service names
  const formatServiceName = (serviceName) => {
    return serviceName.replace(/([A-Z])/g, " $1").trim();
  };
  const fetchUserDetails = async (userId) => {
    try {
      // console.log("fetchUserDetailsuserId:", userId);
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/profile/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        return await response.json();
      } else {
        throw new Error("Failed to fetch user details");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      alert("Could not fetch user details. Please try again.");
      return null;
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
        <Text style={styles.title}> {doctor.category} </Text>
      </View>

      <View style={styles.uAContainer}>
        {/* Static Doctor Info */}
        <View style={styles.transDoctorCard}>
          <Image source={{ uri: imageUri }} style={styles.doctorImage} />
          <View style={styles.doctorInfo}>
            <Text style={styles.doctorName}>{doctor.username}</Text>
            <Text style={styles.doctorCategory}>{doctor.category}</Text>
            <Text style={styles.serviceText}>Services Provided :</Text>
            {/* Render the services and their prices */}
            {services.length > 0 ? (
              services.map((service, index) => (
                <Text key={index} style={styles.sText}>
                  {formatServiceName(service.service)}: RM {service.price}
                </Text>
              ))
            ) : (
              <Text style={styles.doctorCategory}>No services available</Text>
            )}
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
            {/* Questions Section */}
            <View style={styles.section}>
              <Text style={styles.aLabel}>
                What would you like to consult the doctor about?
              </Text>
              <View style={styles.displayUnderline} />
              <TextInput
                style={styles.borderInput}
                placeholder="Add Symptoms"
                value={symptoms}
                onChangeText={setSymptoms}
                multiline
              />
              <Text style={[styles.aLabel, { marginTop: 10 }]}>
                Suggested common symptoms
              </Text>
              <View style={styles.symptomButtonsContainer}>
                {commonSymptoms.map((symptom, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.symptomButton}
                    onPress={() => handleAddSymptom(symptom)}
                  >
                    <Text style={styles.symptomButtonText}>{symptom} +</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.aLabel}>Do you have allergies?</Text>
              <View style={styles.displayUnderline} />
              <RadioButton.Group onValueChange={setAllergies} value={allergies}>
                <View style={styles.radioButtonContainer}>
                  <RadioButton.Item
                    value="No"
                    color={styles.radioButtonColor.color}
                    mode="android"
                    position="leading"
                  />
                  <Text style={styles.radioLabel}>No</Text>
                </View>
                <View style={styles.radioButtonContainer}>
                  <RadioButton.Item
                    value="Yes"
                    color={styles.radioButtonColor.color}
                    mode="android"
                    position="leading"
                  />
                  <Text style={styles.radioLabel}>Yes</Text>
                </View>
              </RadioButton.Group>
              {allergies === "Yes" && (
                <TextInput
                  style={styles.borderInput}
                  placeholder="Enter your allergies here."
                  value={specificAllergies}
                  onChangeText={setSpecificAllergies}
                  multiline
                />
              )}

              <Text style={styles.aLabel}>Who will be seeing the doctor?</Text>
              <View style={styles.displayUnderline} />
              <RadioButton.Group
                onValueChange={setWhoWillSee}
                value={whoWillSee}
              >
                <View style={styles.radioButtonContainer}>
                  <RadioButton.Item
                    value="Me"
                    color={styles.radioButtonColor.color}
                    mode="android"
                    position="leading"
                  />
                  <Text style={styles.radioLabel}>Me</Text>
                </View>
                <View style={styles.radioButtonContainer}>
                  <RadioButton.Item
                    value="Someone Else"
                    color={styles.radioButtonColor.color}
                    mode="android"
                    position="leading"
                  />
                  <Text style={styles.radioLabel}>Someone Else</Text>
                </View>
              </RadioButton.Group>

              <Text style={styles.aLabel}>
                Has this patient seen the doctor before?
              </Text>
              <View style={styles.displayUnderline} />
              <RadioButton.Group
                onValueChange={setPatientSeenBefore}
                value={patientSeenBefore}
              >
                <View style={styles.radioButtonContainer}>
                  <RadioButton.Item
                    value="New Patient"
                    color={styles.radioButtonColor.color}
                    mode="android"
                    position="leading"
                  />
                  <Text style={styles.radioLabel}>New Patient</Text>
                </View>
                <View style={styles.radioButtonContainer}>
                  <RadioButton.Item
                    value="Patient Has Seen The Doctor Before"
                    color={styles.radioButtonColor.color}
                    mode="android"
                    position="leading"
                  />
                  <View>
                    <Text style={styles.radioLabel}>Patient Has Seen The</Text>
                    <Text style={styles.radioLabel}>Doctor Before</Text>
                  </View>
                </View>
              </RadioButton.Group>

              {/* Notes */}
              <Text style={styles.aLabel}>Special Request</Text>
              <View style={styles.displayUnderline} />
              <TextInput
                style={styles.borderInput}
                placeholder="Leave your comment here (if any)"
                value={note}
                onChangeText={setNote}
                multiline
              />
            </View>

            {/* Continue Button */}
            <TouchableOpacity
              style={styles.signOutButton}
              onPress={handleContinue}
            >
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
      <NavigationBar navigation={navigation} activePage="" />
    </ImageBackground>
  );
};

export default VirtualBookingDetails;
