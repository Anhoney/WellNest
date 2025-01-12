//CoCreateNEditOpportunity.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Import icons from Expo
import styles from "../../components/styles"; // Import shared styles
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";
import axios from "axios";
import { RadioButton } from "react-native-paper"; // For the radio button
import CoNavigationBar from "../../components/CoNavigationBar"; // Import your custom navigation bar component
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePickerModal from "react-native-modal-datetime-picker"; // Ensure this is imported
import {
  validateFields,
  getInputStyle,
} from "../../components/validationUtils"; // Import validation functions
import API_BASE_URL from "../../../config/config";
import { getUserIdFromToken } from "../../../services/authService";
import * as ImagePicker from "expo-image-picker";
import { Buffer } from "buffer";

const CoCreateNEditOpportunity = () => {
  const [title, setTitle] = useState("");
  const [fee, setFee] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [note, setNote] = useState("");
  const [TnC, setTnC] = useState("");
  const [registrationDue, setRegistrationDue] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [id, setId] = useState(null);
  const [capacity, setCapacity] = useState("");
  const [opportunityStatus, setOpportunityStatus] = useState("Active");
  const [showPicker, setShowPicker] = useState(false);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null); // Add logic for the image if editing
  const route = useRoute(); // Get route params
  const { opportunityId } = route.params || {};

  useEffect(() => {
    getUserIdFromToken().then((userId) => {
      setUserId(userId);
    });
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (opportunityId) {
        loadOpportunityData();
      }
    }, [opportunityId])
  );

  const loadOpportunityData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(
        `${API_BASE_URL}/single/opportunity/${opportunityId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const opportunity = response.data;
      setTitle(opportunity.title);
      setFee(opportunity.fees);
      setLocation(opportunity.location);
      setDate(opportunity.opportunity_date);
      setTime(opportunity.opportunity_time);
      setNote(opportunity.notes);
      setTnC(opportunity.terms_and_conditions);
      setCapacity(opportunity.capacity);
      setOpportunityStatus(opportunity.opportunity_status);
      setRegistrationDue(new Date(opportunity.registration_due));
      setPhoto(opportunity.photo);
    } catch (error) {
      console.error("Failed to fetch opportunity data:", error);
    }
  };

  const handleDateConfirm = (selectedDate) => {
    setRegistrationDue(selectedDate);
    setDatePickerVisibility(false);
  };

  const handleFileSelection = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert("Permission to access camera roll is required!");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      console.log("ImagePicker result:", result);
      if (!result.canceled) {
        // console.log("Image selected:", result.assets[0].uri);
        // setSelectedFile(result.assets[0].uri);
        setPhoto(result.assets[0].uri);
        setSelectedFile(result);
      } else {
        console.log("Image selection was cancelled.");
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
    //   if (!result.canceled && result.assets && result.assets.length > 0) {
    //     const selectedAsset = result.assets[0];
    //     setPhoto(selectedAsset.uri); // Set the image URI
    //     setSelectedFile(selectedAsset); // Store the file details
    //     console.log("Image selected:", selectedAsset.uri);
    //   } else {
    //     console.log("Image selection was cancelled.");
    //   }
    // } catch (error) {
    //   console.error("Error picking image:", error);
    // }
    // if (result.canceled) {
    //   console.log("User canceled the image picker.");
    //   return;
    // }

    // setSelectedFile(result);
  };
  const validateForm = () => {
    if (!title.trim()) {
      Alert.alert("Validation Error", "Title is required.");
      return false;
    }
    if (!location.trim()) {
      Alert.alert("Validation Error", "Location is required.");
      return false;
    }
    if (!date.trim()) {
      Alert.alert("Validation Error", "Date is required.");
      return false;
    }
    if (!time.trim()) {
      Alert.alert("Validation Error", "Time is required.");
      return false;
    }
    if (!TnC.trim()) {
      Alert.alert("Validation Error", "Terms and Conditions are required.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      console.log("UserId opp:", userId);
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        alert("No token found. Please log in.");
        return;
      }
      const formData = new FormData();
      formData.append("title", title);
      formData.append("fees", fee);
      formData.append("location", location);
      formData.append("date", date);
      formData.append("time", time);
      formData.append("notes", note);
      formData.append("terms_and_conditions", TnC);
      formData.append("capacity", capacity);
      formData.append("opportunity_status", opportunityStatus);
      // formData.append("registration_due", registrationDue);

      // Format registrationDue as a string in 'YYYY-MM-DD' format
      if (registrationDue) {
        const formattedDate = registrationDue.toISOString().split("T")[0]; // Extract only the date part
        formData.append("registration_due", formattedDate);
      } else {
        console.log("No registrationDue provided.");
      }

      const normalizeFilePath = (uri) => {
        if (uri.startsWith("file://")) {
          return uri.replace("file://", "");
        }
        return uri;
      };

      if (photo) {
        // const uri = profile_image;
        // const uri = profile_image.startsWith("file://")
        //   ? profile_image
        //   : `file://${profile_image}`; // Ensure correct URI format
        // const localUri = uri;
        const uri = normalizeFilePath(photo);
        const filename = uri.split("/").pop();
        const type = `image/${filename.split(".").pop()}`;

        const file = {
          uri: photo,
          name: filename,
          type: type,
        };
        // console.log("Appending image to FormData:", file);
        formData.append("photo", file);
      } else {
        console.log("No photo to upload.");
      }
      // if (photo)
      //   formData.append("photo", {
      //     uri: uri,
      //     name: assets[0].name,
      //     type: selectedFile.mimeType,
      //   });
      //   formData.append("photo", photo);
      console.log("Form Data:", {
        title,
        fees: fee,
        location,
        date,
        time,
        notes: note,
        terms_and_conditions: TnC,
        capacity,
        opportunity_status: opportunityStatus,
        registration_due: registrationDue,
      });
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      let response;
      if (opportunityId) {
        response = await axios.put(
          `${API_BASE_URL}/update/opportunities/${opportunityId}`,
          formData,
          config
        );
      } else {
        response = await axios.post(
          `${API_BASE_URL}/opportunities/${userId}`,
          formData,
          config
        );
      }

      alert(response.data.message);
      navigation.goBack();
    } catch (error) {
      console.error("Error saving opportunity:", error);
      alert("Failed to save opportunity.");
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this opportunity?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("token");
              await axios.delete(
                `${API_BASE_URL}/opportunities/${opportunityId}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              alert("Event deleted successfully!");
              navigation.navigate("CoVolunteerOpportunitiesManagement");
            } catch (error) {
              console.error("Error deleting opportunity:", error);
              alert("Failed to delete opportunity.");
            }
          },
        },
      ]
    );
  };

  //   if (loading) {
  //     return (
  //       <View style={styles.centeredContainer}>
  //         <Text style={styles.loadingText}>
  //           Checking existing appointments...
  //         </Text>
  //       </View>
  //     );
  //   }

  // Functions to handle date picker
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const handleConfirm = (date) => {
    setFollowUpDate(date);
    hideDatePicker();
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
        <Text style={styles.hpTitle}>
          {" "}
          {opportunityId ? "Edit Opportunity" : "Create Opportunity"}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.hpContainer}>
        <Text style={styles.sectionTitle}>
          Volunteer Opportunity Details{"\n"}
        </Text>
        <View style={styles.singleUnderline}></View>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.hpInput}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
            multiline
          />

          <Text style={styles.label}>Fees</Text>
          <TextInput
            style={styles.hpInput}
            placeholder="Fees"
            value={fee}
            onChangeText={setFee}
            multiline
          />

          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.hpInput}
            placeholder="Location"
            value={location}
            onChangeText={setLocation}
            multiline
          />

          <Text style={styles.label}>Date</Text>
          <TextInput
            style={styles.hpInput}
            placeholder="Date"
            value={date}
            onChangeText={setDate}
            multiline
          />

          <Text style={styles.label}>Time</Text>
          <TextInput
            style={styles.hpInput}
            placeholder="Time"
            value={time}
            onChangeText={setTime}
            multiline
          />

          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={styles.hpInput}
            placeholder="Notes"
            value={note}
            onChangeText={setNote}
            multiline
          />

          <Text style={styles.label}>Terms and Conditions</Text>
          <TextInput
            style={styles.hpInput}
            placeholder="Terms and Conditions"
            value={TnC}
            onChangeText={setTnC}
            multiline
          />

          <Text style={styles.label}>Photo</Text>
          <TouchableOpacity
            style={styles.mrinput}
            onPress={handleFileSelection}
          >
            <Text>
              {opportunityId && photo
                ? "Change Opportunity Image"
                : selectedFile && selectedFile.assets && selectedFile.assets[0]
                ? selectedFile.assets[0].fileName
                : "Choose an Opportunity Image"}
            </Text>
          </TouchableOpacity>

          <Text style={styles.label}>Registration Due</Text>
          <TouchableOpacity style={styles.dateInput} onPress={showDatePicker}>
            <View style={styles.dateInputContent}>
              <Ionicons
                name="calendar-outline"
                size={20}
                color="#000"
                style={styles.iconStyle}
              />
              <Text style={styles.dateText}>
                {registrationDue
                  ? registrationDue.toDateString()
                  : "Select Date"}
              </Text>
            </View>
          </TouchableOpacity>

          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            display="inline"
            onConfirm={handleDateConfirm}
            // value={registrationDue}
            // onCancel={hideDatePicker}
            onCancel={() => setDatePickerVisibility(false)}
            date={registrationDue || new Date()} // Default to current date
            minimumDate={new Date()} // Propportunity past dates
          />

          <Text style={styles.label}>Capacity (Number of participants)</Text>
          <TextInput
            style={styles.hpInput}
            placeholder="Capacity"
            value={capacity}
            onChangeText={setCapacity}
            keyboardType="numeric"
          />
          {/* <Text style={styles.label}>Event Status</Text>
          <TextInput
            style={styles.hpInput}
            placeholder="Event Status"
            value={opportunityStatus}
            onChangeText={setEventStatus}
          /> */}
          <Text style={styles.label}>Event Status</Text>
          <RadioButton.Group
            onValueChange={setOpportunityStatus}
            value={opportunityStatus}
          >
            <View style={styles.hpradioButtonContainer}>
              <RadioButton.Item
                label="Active"
                value="Active"
                mode="android"
                position="leading"
                color="#FFA500" // Replace with your desired color
                labelStyle={styles.hpradioLabel}
              />
            </View>
            <View style={styles.hpradioButtonContainer}>
              <RadioButton.Item
                label="Not Active"
                value="Not Active"
                mode="android"
                position="leading"
                color="#FFA500"
                labelStyle={styles.hpradioLabel}
              />
            </View>
          </RadioButton.Group>
        </View>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSubmit}>
          <Text style={styles.signOutButtonText}>Done</Text>
        </TouchableOpacity>
        <View style={[{ marginTop: -14 }]}></View>
        {opportunityId && ( // Conditionally render the delete button
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>Delete Event</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
      {/* Navigation Bar */}
      <CoNavigationBar navigation={navigation} />
    </ImageBackground>
  );
};

export default CoCreateNEditOpportunity;
