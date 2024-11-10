//HpAppointmentCreationPage.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ImageBackground,
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

const HpAppointmentCreationPage = () => {
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [availableDays, setAvailableDays] = useState("Everyday");
  const [availableTimes, setAvailableTimes] = useState([]);
  const [newTime, setNewTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [errors, setErrors] = useState({}); // State to track validation errors
  const navigation = useNavigation();
  const [category, setCategory] = useState("Cardiology"); // New state for category
  const [otherCategory, setOtherCategory] = useState(""); // For custom category

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
      } else if (availableTimes.length === 0) {
        alert("Please select at least one available time.");
      }
      return;
    }
    // Clear errors and proceed with form submission
    setErrors({});
    // Validate that all fields are filled
    // if (!description.trim()) {
    //   alert("Please enter a description.");
    //   return;
    // }

    // if (!location.trim()) {
    //   alert("Please enter a location.");
    //   return;
    // }

    // if (availableTimes.length === 0) {
    //   alert("Please select at least one available time.");
    //   return;
    // }

    try {
      const token = await AsyncStorage.getItem("token"); // Retrieve token from AsyncStorage or other storage
      // console.log("Token:", token); // Log the token

      // if (token) {
      //   const decoded = jwt_decode(token);
      //   console.log("Decoded Token:", decoded); // Log the decoded token
      //   // Check if the token is expired
      //   if (decoded.exp * 1000 < Date.now()) {
      //     alert("Token has expired. Please log in again.");
      //     return;
      //   }
      // } else {
      //   alert("No token found. Please log in.");
      //   return;
      // }
      if (!token) {
        alert("No token found. Please log in.");
        return;
      }

      const response = await axios.post(
        "http://localhost:5001/api/appointments",
        {
          description,
          location,
          availableDays,
          availableTimes,
          category: finalCategory, // Add category to the request body
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response);
      if (response.status === 200) {
        alert("Appointment created successfully!");
        navigation.goBack(); // Navigate back to previous page after submission
      }
    } catch (error) {
      console.error("Error creating appointment:", error);
      alert("Failed to create appointment.");
    }
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
        <Text style={styles.hpTitle}>Appointment {"\n"} Creation</Text>
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

          <Text style={styles.label}>Location</Text>
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

          {/* <Text style={styles.label}>Available Time</Text>
          <View style={styles.timeContainer}>
            {availableTimes.map((time, index) => (
              <Text key={index} style={styles.timeSlot}>
                {time}
              </Text>
            ))}
          </View>
          <TouchableOpacity onPress={() => setShowPicker(true)}>
            <Text style={styles.addTimeText}>Select Time</Text>
          </TouchableOpacity>
          {showPicker && (
            <DateTimePicker
              value={newTime}
              mode="time"
              is24Hour={false}
              display="default"
              onChange={(event, selectedDate) => {
                const currentDate = selectedDate || newTime;
                setNewTime(currentDate);
                handleAddTime(); // Automatically add time when selected
              }}
            />
          )} */}

          {/*almost prefect*/}
          {/* <Text style={styles.label}>Available Times</Text>
          <View style={styles.timeContainer}>
            {availableTimes.map((time, index) => (
              <View key={index} style={styles.timeSlotContainer}>
                <TouchableOpacity onPress={() => handleEditTime(index)}>
                  <Text style={styles.timeSlot}>{time}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleRemoveTime(index)}>
                  <Ionicons name="close-circle" size={20} color="#FF0000" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
          <TouchableOpacity onPress={() => setShowPicker(true)}>
            <Text style={styles.addTimeText}>Select Time</Text>
          </TouchableOpacity>
          {showPicker && (
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
              onTouchCancel={() => setShowPicker(false)} // Close picker without changes
            />
          )}
          {showPicker && (
            <TouchableOpacity onPress={handleAddOrUpdateTime}>
              <Text style={styles.confirmButton}>Confirm Time</Text>
            </TouchableOpacity>
          )} */}
          {/*almost prefect*/}

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

          {/* <Text style={styles.label}>Available Time</Text>
          <View style={styles.timeContainer}>
            {availableTimes.map((time, index) => (
              <Text key={index} style={styles.timeSlot}>
                {time}
              </Text>
            ))}
          </View>
          <TextInput
            style={styles.timeInput}
            value={newTime}
            placeholder="Add time (e.g., 09:00 AM)"
            onChangeText={setNewTime}
          />
          <TouchableOpacity onPress={handleAddTime}>
            <Text style={styles.addTimeText}>add time +</Text>
          </TouchableOpacity> */}
        </View>

        <TouchableOpacity style={styles.doneButton} onPress={handleSubmit}>
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
      </ScrollView>
      {/* Navigation Bar */}
      <HpNavigationBar navigation={navigation} />
    </ImageBackground>
  );
};

export default HpAppointmentCreationPage;
