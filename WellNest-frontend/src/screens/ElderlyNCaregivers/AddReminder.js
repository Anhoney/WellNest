//AddReminder.js
import React, { useState, useEffect } from "react";
import {
  ImageBackground,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Modal,
  Image,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import styles from "../../components/styles";
import Ionicons from "react-native-vector-icons/Ionicons";
import { getUserIdFromToken } from "../../../services/authService";
import NavigationBar from "../../components/NavigationBar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../../../config/config";
import { scheduleAlarmNotification } from "../../utils/notificationUtils"; // Custom utility for scheduling notifications

const AddReminder = ({ route, navigation }) => {
  const { edit, medicationData, medicationId } = route.params || {}; // Get data from route params
  const getCurrentTime = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? String(hours).padStart(2, "0") : "12";

    return `${hours}:${minutes} ${ampm}`;
  };
  // If editing, set the initial values from the medicationData
  const [pillName, setPillName] = useState("");
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState("");
  const [time, setTime] = useState(getCurrentTime());
  const [repeatOption, setRepeatOption] = useState("Everyday");
  const [foodRelation, setFoodRelation] = useState("flexible");
  const [currentImage, setCurrentImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null); // Add logic for the image if editing
  const [userId, setUserId] = useState(null);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false); // State for delete modal
  const [medications, setMedications] = useState([]);
  const [notificationFrequency, setNotificationFrequency] =
    useState("One time per day");
  const [notificationTimes, setNotificationTimes] = useState([""]); // Array to hold notification times

  const [isTimePickerVisibleArray, setTimePickerVisibleArray] = useState([
    false,
    false,
    false,
  ]);
  // const formatTimeTo12Hour = (time) => {
  //   const [hours, minutes] = time.split(":").map(Number);
  //   const ampm = hours >= 12 ? "PM" : "AM";
  //   const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
  //   return `${String(formattedHours).padStart(2, "0")}:${String(
  //     minutes
  //   ).padStart(2, "0")} ${ampm}`;
  // };

  const formatTimeTo12Hour = (time) => {
    if (!time || typeof time !== "string") {
      console.warn("Invalid time format:", time);
      return getCurrentTime(); // Fallback to current time if invalid
    }
    const [hours, minutes] = time.split(":").map(Number);
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
    return `${String(formattedHours).padStart(2, "0")}:${String(
      minutes
    ).padStart(2, "0")} ${ampm}`;
  };

  useEffect(() => {
    const fetchMedicationData = async () => {
      console.log("medicationId", medicationId);
      if (medicationId) {
        try {
          const token = await AsyncStorage.getItem("token");
          const response = await axios.get(
            `${API_BASE_URL}/getSingle/medication/${medicationId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          // console.log("Fetched medication data:", response.data);
          const data = response.data;
          // Populate the form fields with the fetched data
          setPillName(data.pill_name);
          setAmount(String(data.amount));
          setDuration(String(data.duration));
          // setTime(data.time);
          // setTime(data.time ? formatTimeTo12Hour(data.time) : getCurrentTime()); // Safely format or set current time
          // //setFrequency(data.frequency || "One time per day"); // Set frequency if available
          //setNotificationTimes(data.notificationTimes || [""]);
          //setTime(formatTimeTo12Hour(data.time)); // Format the time
          setRepeatOption(data.repeat_option);
          setFoodRelation(data.food_relation);
          setCurrentImage(data.medicine_image); // Store the current image URI
          setSelectedFile(
            data.medicine_image ? { uri: data.medicine_image } : null
          );
          setNotificationFrequency(data.frequency || "One time per day");
          setNotificationTimes(
            data.notification_times ? data.notification_times : [""]
          ); // Set notification times
        } catch (error) {
          console.error("Error fetching medication data:", error.message);
          Alert.alert("Error", "Failed to fetch medication data.");
        }
      }
    };
    fetchMedicationData();
  }, [medicationId]);

  const handleTimeConfirm = (selectedTime, index) => {
    const hours = selectedTime.getHours();
    const minutes = selectedTime.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";

    const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
    const formattedMinutes = String(minutes).padStart(2, "0");

    const formattedTime = `${String(formattedHours).padStart(
      2,
      "0"
    )}:${formattedMinutes} ${ampm}`;
    const newTimes = [...notificationTimes];
    newTimes[index] = formattedTime; // Update the specific index with the new time
    setNotificationTimes(newTimes);
    setTimePickerVisibleArray((prev) => {
      const updated = [...prev];
      updated[index] = false; // Hide the time picker for this index
      return updated;
    });
  };

  useEffect(() => {
    const fetchUserId = async () => {
      const userId = await getUserIdFromToken();
      if (userId) {
        setUserId(userId);
      }
    };
    fetchUserId();
  }, []);

  const handleFileSelection = async () => {
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

    if (result.canceled) {
      console.log("User canceled the image picker.");
      return;
    }

    setSelectedFile(result);
  };

  // Function to handle frequency change
  const handleFrequencyChange = (frequency) => {
    setNotificationFrequency(frequency);
    // Reset notification times based on frequency
    if (frequency === "One time per day") {
      setNotificationTimes([""]); // One time
      setTimePickerVisibleArray([false]); // Reset visibility
    } else if (frequency === "Twice per day") {
      setNotificationTimes(["", ""]); // Two times
      setTimePickerVisibleArray([false, false]); // Reset visibility
    } else if (frequency === "Three times per day") {
      setNotificationTimes(["", "", ""]); // Three times
      setTimePickerVisibleArray([false, false, false]); // Reset visibility
    }
  };

  // handleTimeChange: Safely parse selectedTime and apply formatting
  const handleTimeChange = (index, selectedTime) => {
    if (!(selectedTime instanceof Date)) {
      selectedTime = new Date(selectedTime); // Convert if necessary
    }
    const hours = selectedTime.getHours();
    const minutes = selectedTime.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";

    const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
    const formattedMinutes = String(minutes).padStart(2, "0");

    const formattedTime = `${String(formattedHours).padStart(
      2,
      "0"
    )}:${formattedMinutes} ${ampm}`;

    const newTimes = [...notificationTimes];
    newTimes[index] = formattedTime;
    setNotificationTimes(newTimes);
  };

  const handleSubmit = async () => {
    if (!pillName || !amount || !duration || !time) {
      Alert.alert("Error", "Please fill in all fields!");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        alert("No token found. Please log in.");
        return;
      }

      const formData = new FormData();
      formData.append("pillName", pillName);
      formData.append("amount", amount);
      formData.append("duration", duration);
      formData.append("time", time);
      formData.append("repeatOption", repeatOption);
      formData.append("foodRelation", foodRelation);
      formData.append("userId", userId);
      formData.append("notificationTimes", JSON.stringify(notificationTimes)); // Send notification times as JSON
      formData.append("frequency", notificationFrequency);
      console.log("Selected File:", selectedFile);
      console.log("Current Image:", currentImage);

      if (
        selectedFile &&
        selectedFile.assets &&
        selectedFile.assets.length > 0
      ) {
        const { uri, fileName } = selectedFile.assets[0];
        if (uri && fileName) {
          formData.append("medicineImage", {
            uri,
            name: fileName,
            type: selectedFile.mimeType || "image/jpeg",
          });
        }
      } else if (currentImage) {
        // If no new image is selected, use the current image
        formData.append("medicineImage", {
          uri: currentImage,
          name: currentImage.split("/").pop(), // Extract filename from URI
          type: "image/jpeg", // Default type
        });
      }

      const url = edit
        ? `${API_BASE_URL}/user/medication/${medicationId}` // Update API endpoint
        : `${API_BASE_URL}/medication`; // Insert API endpoint for new reminder

      const method = edit ? "PUT" : "POST";
      console.log("medicationId edit to backend", medicationId);
      // await axios.post(`${API_BASE_URL}/medication`, formData, {
      //   headers: {
      //     "Content-Type": "multipart/form-data",
      //     Authorization: `Bearer ${token}`,
      //   },
      // });
      console.log("Form Data Entries:");
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

      await axios({
        method,
        url,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      Alert.alert("Success", "Medication reminder set successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("Error saving medication:", error.message);
      Alert.alert("Error", "Failed to set the reminder.");
    }
  };

  const handleDelete = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        alert("No token found. Please log in.");
        return;
      }

      await axios.delete(`${API_BASE_URL}/delete/medication/${medicationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      Alert.alert("Success", "Medication reminder deleted successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("Error deleting medication:", error.message);
      Alert.alert("Error", "Failed to delete medication reminder.");
    }
  };

  return (
    <ImageBackground
      source={require("../../../assets/PlainGrey.png")}
      style={[styles.background, { flex: 1 }]}
    >
      <View style={styles.smallHeaderContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>
          {edit ? "Edit Medication Reminder" : "Add Medication Reminder"}{" "}
        </Text>
      </View>

      {/* Wrap content in ScrollView */}
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 20,
        }}
      >
        <View style={styles.mrcontainer}>
          <Text style={styles.mrheader}>
            {medicationId
              ? "Edit Medication Reminder"
              : "Add Medication Reminder"}
          </Text>

          <View style={styles.mrrow}>
            <Ionicons name="medkit" size={18} color="#000" />
            <Text style={styles.mrlabel}>Pills Name</Text>
          </View>
          <TextInput
            style={styles.mrinput}
            value={pillName}
            onChangeText={setPillName}
            placeholder="Enter pill name"
          />

          <View style={styles.mrrow}>
            <Ionicons name="apps" size={18} color="#000" />
            <Text style={styles.mrlabel}>Amount</Text>
          </View>
          <TextInput
            style={styles.mrinput}
            value={amount}
            onChangeText={setAmount}
            placeholder="Enter amount (e.g., 2)"
            keyboardType="numeric"
          />

          <View style={styles.mrrow}>
            <Ionicons name="calendar" size={18} color="#000" />
            <Text style={styles.mrlabel}>Duration (days)</Text>
          </View>
          <TextInput
            style={styles.mrinput}
            value={duration}
            onChangeText={setDuration}
            placeholder="Enter duration in days"
            keyboardType="numeric"
          />

          <View style={styles.mrrow}>
            <Ionicons name="repeat" size={18} color="#000" />
            <Text style={styles.mrlabel}>Notification Frequency</Text>
          </View>
          <View style={styles.mrfoodButtons}>
            {["One time per day", "Twice per day", "Three times per day"].map(
              (option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.mrfoodButton,
                    notificationFrequency === option &&
                      styles.mrfoodButtonActive,
                  ]}
                  onPress={() => handleFrequencyChange(option)}
                >
                  <Text>{option}</Text>
                </TouchableOpacity>
              )
            )}
          </View>
          <View style={{ marginVertical: 8 }} />

          {/* Render input fields for notification times */}
          {notificationTimes.map((time, index) => (
            <View key={index}>
              <View style={styles.mrrow}>
                <Ionicons name="time" size={18} color="#000" />
                <Text style={styles.mrlabel}>
                  Notification Time {index + 1}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.mrinput}
                onPress={() => {
                  setTimePickerVisibleArray((prev) => {
                    const updated = [...prev];
                    updated[index] = true; // Show the time picker for this index
                    return updated;
                  });
                }}
              >
                <Text>{time || "Select Time"}</Text>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={isTimePickerVisibleArray[index]}
                mode="time"
                date={new Date()} // Ensures the default time is the current real-world time
                onConfirm={(selectedTime) =>
                  handleTimeConfirm(selectedTime, index)
                }
                onCancel={() => {
                  setTimePickerVisibleArray((prev) => {
                    const updated = [...prev];
                    updated[index] = false; // Hide the time picker for this index
                    return updated;
                  });
                }}
              />
            </View>
          ))}

          {/* <View style={styles.mrrow}>
            <Ionicons name="repeat" size={18} color="#000" />
            <Text style={styles.mrlabel}>Notification Frequency</Text>
          </View>
          <View style={styles.mrfoodButtons}>
            {["One time per day", "Twice per day", "Three times per day"].map(
              (option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.mrfoodButton,
                    notificationFrequency === option &&
                      styles.mrfoodButtonActive,
                  ]}
                  onPress={() => handleFrequencyChange(option)}
                >
                  <Text>{option}</Text>
                </TouchableOpacity>
              )
            )}
          </View>
          <View style={{ marginVertical: 8 }} /> */}
          {/* Render input fields for notification times */}
          {/* {notificationTimes.map((time, index) => (
            <View key={index}>
              <View style={styles.mrrow}>
                <Ionicons name="time" size={18} color="#000" />
                <Text style={styles.mrlabel}>
                  Notification Time {index + 1}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.mrinput}
                onPress={() => setTimePickerVisibility(true)}
              >
                <Text>{time || "Select Time"}</Text>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={isTimePickerVisible}
                mode="time"
                date={new Date()} // Ensures the default time is the current real-world time
                onConfirm={(selectedTime) => {
                  // handleTimeChange(index, formatTimeTo12Hour(selectedTime));
                  handleTimeChange(index, selectedTime);
                  setTimePickerVisibility(false);
                }}
                onCancel={() => setTimePickerVisibility(false)}
              />
            </View>
          ))} */}

          {/* <View style={styles.mrrow}>
            <Ionicons name="time" size={18} color="#000" />
            <Text style={styles.mrlabel}>Notification Time</Text>
          </View>
          <TouchableOpacity
            style={styles.mrinput}
            onPress={() => setTimePickerVisibility(true)}
          >
            <Text>{time}</Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isTimePickerVisible}
            mode="time"
            date={new Date()} // Ensures the default time is the current real-world time
            onConfirm={handleTimeConfirm}
            onCancel={() => setTimePickerVisibility(false)}
          /> */}

          <View style={styles.mrrow}>
            <Ionicons name="repeat" size={18} color="#000" />
            <Text style={styles.mrlabel}>Repeat</Text>
          </View>
          <View style={styles.mrfoodButtons}>
            {["Everyday", "One-time only"].map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.mrfoodButton,
                  repeatOption === option && styles.mrfoodButtonActive,
                ]}
                onPress={() => setRepeatOption(option)}
              >
                <Text>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Space between Repeat and Food & Pills */}
          <View style={{ marginVertical: 8 }} />

          <View style={styles.mrrow}>
            <Ionicons name="restaurant" size={18} color="#000" />
            <Text style={styles.mrlabel}>Food & Pills</Text>
          </View>
          <View style={styles.mrfoodButtons}>
            {["beforeFood", "flexible", "afterFood"].map((relation) => (
              <TouchableOpacity
                key={relation}
                style={[
                  styles.mrfoodButton,
                  foodRelation === relation && styles.mrfoodButtonActive,
                ]}
                onPress={() => setFoodRelation(relation)}
              >
                <Text>
                  {relation === "beforeFood"
                    ? "Before Food"
                    : relation === "flexible"
                    ? "When Needed"
                    : "After Food"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Space between Food & Pills and Upload Medicine Image */}
          <View style={{ marginVertical: 8 }} />

          <View style={styles.mrrow}>
            <Ionicons name="cloud-upload" size={18} color="#000" />
            <Text style={styles.mrlabel}>Upload Medicine Image</Text>
          </View>
          <TouchableOpacity
            style={styles.mrinput}
            onPress={handleFileSelection}
          >
            {/* <Text>
            {selectedFile && selectedFile.assets && selectedFile.assets[0]
              ? selectedFile.assets[0].fileName
              : "Choose Medicine Image"}
            
          </Text> */}
            <Text>
              {selectedFile && selectedFile.assets && selectedFile.assets[0]
                ? selectedFile.assets[0].fileName
                : currentImage
                ? currentImage.split("/").pop() // Show the current image filename
                : "Choose Medicine Image"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.signOutButton} onPress={handleSubmit}>
            <Text style={styles.signOutButtonText}>
              {edit ? "Update" : "Done"}
            </Text>
          </TouchableOpacity>

          {/* Show Delete Button if in Edit Mode */}
          {/* {edit && (
            <TouchableOpacity
              style={[
                styles.signOutButton,
                { backgroundColor: "red", marginTop: 10 },
              ]}
              onPress={handleDelete}
            >
              <Text style={styles.signOutButtonText}>Delete</Text>
            </TouchableOpacity>
          )} */}
          {edit && (
            <>
              <TouchableOpacity
                style={[
                  styles.signOutButton,
                  { backgroundColor: "red", marginTop: 10 },
                ]}
                onPress={() => setDeleteModalVisible(true)} // Show modal
              >
                <Text style={styles.signOutButtonText}>Delete</Text>
              </TouchableOpacity>
              <Modal
                animationType="slide"
                transparent={true}
                visible={isDeleteModalVisible}
                onRequestClose={() => setDeleteModalVisible(false)}
              >
                <View style={styles.modalContainer}>
                  <View style={styles.modalView}>
                    <Text style={styles.modalTitle}>Confirm Deletion</Text>
                    <Image
                      source={require("../../../assets/DeleteCat.png")}
                      style={styles.successImage} // Style for the image
                    />
                    <Text style={styles.modalMessage}>
                      Are you sure you want to delete this medication reminder?
                    </Text>
                    <View style={styles.modalButtons}>
                      <TouchableOpacity
                        style={styles.modalConfirmButton}
                        onPress={() => {
                          handleDelete();
                          setDeleteModalVisible(false);
                        }}
                      >
                        <Text style={styles.modalConfirmButtonText}>
                          Confirm
                        </Text>
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
            </>
          )}
        </View>
      </ScrollView>
      <NavigationBar navigation={navigation} activePage="" />
    </ImageBackground>
  );
};

export default AddReminder;
