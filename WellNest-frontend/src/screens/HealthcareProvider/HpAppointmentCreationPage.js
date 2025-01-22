//HpAppointmentCreationPage.js
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
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { RadioButton } from "react-native-paper"; // For the radio button
import HpNavigationBar from "../../components/HpNavigationBar"; // Import your custom navigation bar component
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  validateFields,
  getInputStyle,
} from "../../components/validationUtils"; // Import validation functions
import API_BASE_URL from "../../../config/config";
import { getUserIdFromToken } from "../../../services/authService";

const HpAppointmentCreationPage = () => {
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [hospitalAdds, setHospitalAdds] = useState("");
  const [availableDays, setAvailableDays] = useState("Everyday");
  const [availableTimes, setAvailableTimes] = useState([]);
  const [newTime, setNewTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [errors, setErrors] = useState({}); // State to track validation errors
  const navigation = useNavigation();
  const [category, setCategory] = useState("Cardiology"); // New state for category
  const [otherCategory, setOtherCategory] = useState(""); // For custom category
  const [loading, setLoading] = useState(true); // Loading state
  const [userId, setUserId] = useState(null);
  const [appointmentId, setAppointmentId] = useState([]);
  const [existingAppointment, setExistingAppointment] = useState(null); // State to hold existing appointment

  useEffect(() => {
    const initializeData = async () => {
      try {
        // Fetch userId
        const fetchedUserId = await getUserIdFromToken();
        if (fetchedUserId) {
          setUserId(fetchedUserId);
          console.log(fetchedUserId);
          // Fetch appointments for the user
          const token = await AsyncStorage.getItem("token");
          if (!token) {
            throw new Error("No token found. Please log in.");
          }

          const response = await axios.get(
            `${API_BASE_URL}/appointments/user/${fetchedUserId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          console.log(`${API_BASE_URL}/appointments/user/${fetchedUserId}`);
          const appointment = response.data;

          // Set existing appointment if found
          if (appointment) {
            setExistingAppointment(appointment); // Store the existing appointment
            setAppointmentId(appointment.id);
            setDescription(appointment.description || "");
            setLocation(appointment.location || "");
            setHospitalAdds(appointment.hospital_address || "");
            setAvailableDays(appointment.available_days || "Everyday");
            setCategory(appointment.category || "Cardiology");
            setAvailableTimes(
              Array.isArray(appointment.available_times)
                ? appointment.available_times
                : []
            );
          }
          console.log("AppointmentId:", appointmentId);
          console.log("Fetched appointment data:", appointment);
        } else {
          throw new Error("Failed to fetch userId.");
        }
      } catch (error) {
        console.error("Error initializing data:", error);
        alert("Failed to load appointment data. Please try again later.");
      } finally {
        setLoading(false); // Ensure loading state is updated
      }
    };

    initializeData();
  }, []);

  // const fetchUserId = async () => {
  //   const userId = await getUserIdFromToken();
  //   // console.log("userId:", userId);
  //   if (userId) {
  //     setUserId(userId);
  //     fetchProfileData(userId);
  //   }
  // };
  // // Function to fetch appointments for a specific user
  // const fetchAppointments = async (userId) => {
  //   try {
  //     const token = await AsyncStorage.getItem("token");
  //     console.log("Token:", token); // Log the token to verify it's correct
  //     console.log("userId:", userId);
  //     // setLoading(true);
  //     // setError(null);
  //     const response = await axios.get(
  //       `${API_BASE_URL}/api/appointments/user/${userId}`,
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );
  //     console.log("Appointments:", response.data);
  //     const appointment = response.data;
  //     console.log(response.data);
  //     console.log("Fetched appointment:", appointment); // Log the entire appointment object
  //     setDescription(appointment.description);
  //     setLocation(appointment.location);
  //     setAvailableDays(appointment.available_days);
  //     console.log("Available days:", appointment.available_days);
  //     setCategory(appointment.category);
  //     // Safely set availableTimes only if it's an array
  //     setAvailableTimes(
  //       Array.isArray(appointment.available_times)
  //         ? appointment.available_times
  //         : []
  //     );
  //     // setAppointments(response.data);
  //   } catch (err) {
  //     console.error("Error fetching appointments:", err);
  //     setError("Failed to fetch appointments");
  //   }
  //   // finally {
  //   //   setLoading(false);
  //   // }
  // };

  // useEffect(() => {
  //   fetchUserId();
  //   fetchAppointments(userId);
  // }, [userId]);
  // useEffect(() => {
  //   if (userId) {
  //     fetchAppointments(userId);
  //   }
  // }, [userId]);

  const handleAddTime = () => {
    const timeString = newTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    if (!availableTimes.includes(timeString)) {
      setAvailableTimes([...availableTimes, timeString]);
    }
    setShowPicker(false); // Close the picker after adding the time
  };

  const handleRemoveTime = (time) => {
    setAvailableTimes(availableTimes.filter((t) => t !== time));
  };

  const handleSubmit = async () => {
    // Collect the final category value
    const finalCategory = category === "Others" ? otherCategory : category;

    const fieldsToValidate = {
      description,
      location,
      hospitalAdds,
    };

    // Validate fields and set errors if any
    const validationErrors = validateFields(fieldsToValidate);

    if (validationErrors.allFieldsEmpty) {
      alert("Please fill in all the fields.");
      return;
    }

    if (
      Object.keys(validationErrors).length > 0 ||
      availableTimes.length === 0
    ) {
      setErrors({
        ...validationErrors,
        availableTimes: availableTimes.length === 0,
      });

      if (!description.trim()) {
        alert("Please enter a description.");
      } else if (!location.trim()) {
        alert("Please enter a location.");
      } else if (!hospitalAdds.trim()) {
        alert("Please enter a hospital address.");
      } else if (availableTimes.length === 0) {
        alert("Please select at least one available time.");
      }
      return;
    }
    // Clear errors and proceed with form submission
    setErrors({});

    try {
      const token = await AsyncStorage.getItem("token"); // Retrieve token from AsyncStorage or other storage

      if (!token) {
        alert("No token found. Please log in.");
        return;
      }

      if (existingAppointment) {
        // Update existing appointment
        const response = await axios.put(
          `${API_BASE_URL}/appointments/${appointmentId}`, // Use the ID of the existing appointment
          {
            description,
            location,
            hospital_address: hospitalAdds,
            available_days: availableDays,
            available_times: availableTimes,
            category: finalCategory,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.status === 200) {
          alert("Appointment updated successfully!");
          navigation.goBack();
        }
      } else {
        const response = await axios.post(
          `${API_BASE_URL}/appointments`,
          {
            description,
            location,
            hospitalAdds,
            availableDays,
            availableTimes,
            category: finalCategory, // Add category to the request body
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        // console.log(response);
        if (response.status === 200) {
          alert("Appointment created successfully!");
          navigation.goBack(); // Navigate back to previous page after submission
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Handle duplicate category error
        alert(error.response.data.error);
      } else {
        console.error("Error creating appointment:", error);
        alert("Failed to create appointment.");
      }
      // console.error("Error creating appointment:", error);
      // alert("Failed to create appointment.");
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this appointment?",
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
              if (!token) {
                alert("No token found. Please log in.");
                return;
              }

              await axios.delete(
                `${API_BASE_URL}/appointments/${appointmentId}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              alert("Appointment deleted successfully!");
              navigation.goBack(); // Navigate back after deletion
            } catch (error) {
              console.error("Error deleting appointment:", error);
              alert("Failed to delete appointment.");
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.loadingText}>
          Checking existing appointments...
        </Text>
      </View>
    );
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
        <Text style={styles.hpTitle}>
          {existingAppointment ? "Appointment Edit" : "Appointment Creation"}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.hpContainer}>
        {/* <View style={styles.header}>
          <Text style={styles.headerText}>Appointments Creation</Text>
        </View> */}

        <Text style={styles.sectionTitle}>
          {"\n"}Appointments Details{"\n"}
        </Text>
        <View style={styles.singleUnderline}></View>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Descriptions</Text>
          <TextInput
            // style={styles.hpInput}
            // value={description}
            // onChangeText={setDescription}
            // multiline
            style={getInputStyle(!errors.description)}
            value={description}
            onChangeText={(text) => {
              setDescription(text);
              setErrors((prev) => ({ ...prev, description: false }));
            }}
            multiline
          />

          <Text style={styles.label}>Hospital Name / Location</Text>
          <TextInput
            // style={styles.hpInput}
            // value={location}
            // onChangeText={setLocation}
            style={getInputStyle(!errors.location)}
            value={location}
            onChangeText={(text) => {
              setLocation(text);
              setErrors((prev) => ({ ...prev, location: false }));
            }}
          />

          <Text style={styles.label}>Hospital Address</Text>
          <TextInput
            // style={styles.hpInput}
            // value={description}
            // onChangeText={setDescription}
            // multiline
            style={getInputStyle(!errors.hospitalAdds)}
            value={hospitalAdds}
            onChangeText={(text) => {
              setHospitalAdds(text);
              setErrors((prev) => ({ ...prev, hospitalAdds: false }));
            }}
            multiline
          />

          <Text style={styles.label}>Available Days</Text>
          <RadioButton.Group
            onValueChange={setAvailableDays}
            value={availableDays}
          >
            <View style={styles.hpradioButtonContainer}>
              <RadioButton.Item
                label="Everyday"
                value="Everyday"
                mode="android"
                position="leading"
                color="#FFA500" // Replace with your desired color
                labelStyle={styles.hpradioLabel}
              />
            </View>
            <View style={styles.hpradioButtonContainer}>
              <RadioButton.Item
                label="Every Weekday"
                value="Every Weekday"
                mode="android"
                position="leading"
                color="#FFA500"
                labelStyle={styles.hpradioLabel}
              />
            </View>
            <View style={styles.hpradioButtonContainer}>
              <RadioButton.Item
                label="Every Weekend"
                value="Every Weekend"
                mode="android"
                position="leading"
                color="#FFA500"
                labelStyle={styles.hpradioLabel}
              />
            </View>
          </RadioButton.Group>

          {/* Categories Field */}
          <Text style={styles.label}>Categories</Text>
          <RadioButton.Group onValueChange={setCategory} value={category}>
            <View style={styles.hpradioButtonContainer}>
              <RadioButton.Item
                label="Cardiology"
                value="Cardiology"
                color="#FFA500"
                mode="android"
                position="leading"
              />
            </View>
            <View style={styles.hpradioButtonContainer}>
              <RadioButton.Item
                label="Dermatology"
                value="Dermatology"
                color="#FFA500"
                mode="android"
                position="leading"
              />
            </View>
            <View style={styles.hpradioButtonContainer}>
              <RadioButton.Item
                label="General Medicine"
                value="General Medicine"
                color="#FFA500"
                mode="android"
                position="leading"
              />
            </View>
            <View style={styles.hpradioButtonContainer}>
              <RadioButton.Item
                label="Gynecology"
                value="Gynecology"
                color="#FFA500"
                mode="android"
                position="leading"
              />
            </View>
            <View style={styles.hpradioButtonContainer}>
              <RadioButton.Item
                label="Oncology"
                value="Oncology"
                color="#FFA500"
                mode="android"
                position="leading"
              />
            </View>
            <View style={styles.hpradioButtonContainer}>
              <RadioButton.Item
                label="Odontology"
                value="Odontology"
                color="#FFA500"
                mode="android"
                position="leading"
              />
            </View>
            <View style={styles.hpradioButtonContainer}>
              <RadioButton.Item
                label="Phthalmology"
                value="Phthalmology"
                color="#FFA500"
                mode="android"
                position="leading"
              />
            </View>
            <View style={styles.hpradioButtonContainer}>
              <RadioButton.Item
                label="Orthopedics"
                value="Orthopedics"
                color="#FFA500"
                mode="android"
                position="leading"
              />
            </View>
            <View style={styles.hpradioButtonContainer}>
              <RadioButton.Item
                label="Others"
                value="Others"
                color="#FFA500"
                mode="android"
                position="leading"
              />
            </View>
          </RadioButton.Group>

          {/* Custom Category Input if "Others" is selected */}
          {category === "Others" && (
            <TextInput
              style={styles.hpInput}
              value={otherCategory}
              onChangeText={setOtherCategory}
              placeholder="Please specify your category"
            />
          )}

          <Text style={styles.label}>Available Time</Text>
          <View>
            {availableTimes.map((time, index) => (
              <View key={index} style={styles.timeSlotContainer}>
                <Text style={styles.timeSlot}>{time}</Text>
                <TouchableOpacity onPress={() => handleRemoveTime(time)}>
                  <Ionicons name="close-circle" size={20} color="#FF0000" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
          <TouchableOpacity onPress={() => setShowPicker(true)}>
            <Text style={styles.addTimeText}>Select Time</Text>
          </TouchableOpacity>
          {showPicker && (
            <View style={styles.dateTimePickerContainer}>
              <DateTimePicker
                value={newTime}
                mode="time"
                is24Hour={false}
                display="default"
                onChange={(event, selectedDate) => {
                  if (event.type === "set") {
                    setNewTime(selectedDate || newTime);
                  }
                }}
              />
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleAddTime}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          )}
          <Text style={styles.uploadPrecautions}>
            {"\n"}Complete your profile details to create a more informative
            appointment listing and attract more patients. Head over to the
            profile screen now!
          </Text>
        </View>

        <TouchableOpacity style={styles.signOutButton} onPress={handleSubmit}>
          <Text style={styles.signOutButtonText}>Done</Text>
        </TouchableOpacity>

        {existingAppointment && ( // Conditionally render the delete button
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>Delete Appointment</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
      {/* Navigation Bar */}
      <HpNavigationBar navigation={navigation} />
    </ImageBackground>
  );
};

export default HpAppointmentCreationPage;
