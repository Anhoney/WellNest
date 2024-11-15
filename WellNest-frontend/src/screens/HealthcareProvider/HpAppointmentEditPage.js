//HpMyCreatedAppointments.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Import icons from Expo
import styles from "../../components/styles"; // Import shared styles
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import { RadioButton } from "react-native-paper"; // For the radio button
import HpNavigationBar from "../../components/HpNavigationBar"; // Import your custom navigation bar component
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import API_BASE_URL from "../../../config/config";

const HpAppointmentEditPage = () => {
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [availableDays, setAvailableDays] = useState("");
  const [availableTimes, setAvailableTimes] = useState([]); // Initialize as an empty array
  const [newTime, setNewTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [errors, setErrors] = useState({});
  const navigation = useNavigation();
  const route = useRoute();
  const [category, setCategory] = useState(""); // New state for category
  const [otherCategory, setOtherCategory] = useState(""); // For custom category
  const { appointmentId } = route.params; // Assume appointmentId is passed as a parameter

  useEffect(() => {
    if (!appointmentId) {
      console.warn("appointmentId is undefined");
      navigation.goBack();
      return;
    }

    const fetchAppointmentDetails = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        console.log("Token:", token); // Log the token to verify it's correct
        const response = await axios.get(
          `${API_BASE_URL}/appointments/${appointmentId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Received appointmentId:", appointmentId);
        const appointment = response.data;
        console.log(response.data);
        console.log("Fetched appointment:", appointment); // Log the entire appointment object
        setDescription(appointment.description);
        setLocation(appointment.location);
        setAvailableDays(appointment.available_days);
        console.log("Available days:", appointment.available_days);
        setCategory(appointment.category);
        // Safely set availableTimes only if it's an array
        setAvailableTimes(
          Array.isArray(appointment.available_times)
            ? appointment.available_times
            : []
        );
      } catch (error) {
        console.error("Error fetching appointment:", error);
        alert("Failed to fetch appointment details.");
      }
    };

    fetchAppointmentDetails();
  }, [appointmentId]);

  const handleUpdate = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        alert("No token found. Please log in.");
        return;
      }

      const response = await axios.put(
        `${API_BASE_URL}/appointments/${appointmentId}`,
        {
          description,
          location,
          available_days: availableDays,
          available_times: availableTimes,
          category: category,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        alert("Appointment updated successfully!");
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error updating appointment:", error);
      alert("Failed to update appointment.");
    }
  };

  const handleAddTime = () => {
    const timeString = newTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    if (!availableTimes.includes(timeString)) {
      setAvailableTimes([...availableTimes, timeString]);
    }
    setShowPicker(false);
  };

  const handleRemoveTime = (time) => {
    setAvailableTimes(availableTimes.filter((t) => t !== time));
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
        <Text style={styles.hpTitle}>Edit Appointment</Text>
      </View>

      <ScrollView contentContainerStyle={styles.hpContainer}>
        <Text style={styles.sectionTitle}>
          {"\n"}Appointment Details{"\n"}
        </Text>
        <View style={styles.singleUnderline}></View>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.hpInput}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            multiline
          />

          <Text style={styles.label}>Location</Text>
          <TextInput
            placeholder="Location"
            style={styles.hpInput}
            value={location}
            onChangeText={setLocation}
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
                color="#FFA500"
                position="leading"
                labelStyle={styles.hpradioLabel}
              />
            </View>
            <View style={styles.hpradioButtonContainer}>
              <RadioButton.Item
                label="Every Weekday"
                value="Every Weekday"
                mode="android"
                color="#FFA500"
                position="leading"
                labelStyle={styles.hpradioLabel}
              />
            </View>
            <View style={styles.hpradioButtonContainer}>
              <RadioButton.Item
                label="Every Weekend"
                value="Every Weekend"
                mode="android"
                color="#FFA500"
                position="leading"
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

          <Text style={styles.label}>Available Times</Text>
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
        </View>

        <TouchableOpacity style={styles.doneButton} onPress={handleUpdate}>
          <Text style={styles.doneButtonText}>Update</Text>
        </TouchableOpacity>
      </ScrollView>
      <HpNavigationBar navigation={navigation} />
    </ImageBackground>
  );
};

export default HpAppointmentEditPage;
