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
  //   CheckBox,
} from "react-native";
// import CheckBox from "@react-native-community/checkbox";
// import { CheckBox } from "expo-checkbox";
// import CustomCheckBox from "../../components/CustomCheckBox";
// import { CheckBox } from "react-native-elements";
import { CheckBox } from "@rneui/themed";
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

const HpCreateOrEditVApp = () => {
  const [description, setDescription] = useState("");
  //   const [servicesProvide, setServicesProvide] = useState({
  //     videoConsultation: { selected: false, price: "" },
  //     textConsultation: { selected: false, price: "" },
  //   });
  const [servicesProvide, setServicesProvide] = useState([
    { service: "VideoConsultation", selected: false, price: "" },
    { service: "TextConsultation", selected: false, price: "" },
  ]);
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
  const [bankReceiverName, setBankReceiverName] = useState(""); // State for bank receiver name
  const [bankName, setBankName] = useState(""); // State for bank name
  const [accountNumber, setAccountNumber] = useState(""); // State for account number

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
            `${API_BASE_URL}/virtualAvailabilityDetails/${fetchedUserId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const appointments = response.data;

          // Set existing appointment if found
          if (appointments && appointments.length > 0) {
            const appointment = appointments[0]; // Access the first appointment object
            setExistingAppointment(appointment); // Store the existing appointment
            setAppointmentId(appointment.id);
            setDescription(appointment.description || "");
            // setLocation(appointment.location || "");
            // setHospitalAdds(appointment.hospital_address || "");
            setAvailableDays(appointment.available_days || "Everyday");
            setCategory(appointment.category || "Cardiology");
            setAvailableTimes(
              Array.isArray(appointment.available_times)
                ? appointment.available_times
                : []
            );
            setBankReceiverName(appointment.bank_receiver_name || "");
            setBankName(appointment.bank_name || "");
            setAccountNumber(appointment.account_number || "");

            // Set servicesProvide based on existing appointment
            // const services = JSON.parse(appointment.services_provide);
            // Handle servicesProvide parsing safely
            let services = [];
            try {
              // Check if services_provide is a string and parse it
              if (typeof appointment.services_provide === "string") {
                services = JSON.parse(appointment.services_provide);
              } else {
                services = appointment.services_provide; // Assume it's already an object/array
              }
              // services = JSON.parse(appointment.services_provide || "[]");
            } catch (parseError) {
              console.warn("Failed to parse services_provide:", parseError);
              services = [];
            }

            setServicesProvide((prev) =>
              prev.map((service) => ({
                ...service,
                selected: services.some((s) => s.service === service.service),
                price:
                  services.find((s) => s.service === service.service)?.price ||
                  "",
              }))
            );
          } else {
            console.log("No appointments found for this user.");
          }
          // console.log("AppointmentId:", appointment.account_number);
          console.log("Fetched appointment data:", appointments);
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

  const handleServiceChange = (index, field, value) => {
    // setServicesProvide((prev) => ({
    //   ...prev,
    //   [service]: { ...prev[service], [field]: value },
    // }));
    setServicesProvide((prev) => {
      const updatedServices = [...prev];
      updatedServices[index] = { ...updatedServices[index], [field]: value };
      return updatedServices;
    });
  };

  const handleSubmit = async () => {
    const selectedServices = servicesProvide
      .filter((service) => service.selected)
      .map(({ service, price }) => ({ service, price }));

    if (!selectedServices.length) {
      alert("Please select at least one service and set its price.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        alert("No token found. Please log in.");
        return;
      }

      const requestBody = {
        hpId: userId, // Pass the user ID as hpId
        description,
        servicesProvide: selectedServices,
        category: category === "Others" ? otherCategory : category, // Handle custom category
        availableDays,
        availableTimes,
        bank_receiver_name: bankReceiverName,
        bank_name: bankName,
        account_number: accountNumber,
      };

      const response = await axios.post(
        `${API_BASE_URL}/virtualConsultation/upsert`,
        requestBody,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        alert(response.data.message); // Use the message from the backend
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error upserting virtual consultation:", error);
      alert("Failed to save virtual consultation.");
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
                `${API_BASE_URL}/virtualConsultation/delete/${appointmentId}`,
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
          {existingAppointment
            ? "Virtual Consultation Edit"
            : "Virtual Consultation Creation"}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.hpContainer}>
        <Text style={styles.sectionTitle}>Appointments Details{"\n"}</Text>
        <View style={styles.singleUnderline}></View>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Descriptions</Text>
          <TextInput
            style={styles.hpInput}
            value={description}
            placeholder={"Enter Description"}
            onChangeText={setDescription}
            multiline
          />

          <Text style={styles.label}>Services Provide</Text>

          {servicesProvide.map((service, index) => (
            <View key={index} style={styles.checkboxContainer}>
              <CheckBox
                title={service.service.replace(/([A-Z])/g, " $1").trim()}
                checked={service.selected}
                onPress={() =>
                  handleServiceChange(index, "selected", !service.selected)
                }
                containerStyle={{
                  backgroundColor: "transparent",
                  borderWidth: 0,
                  marginBottom: -5,
                }}
                textStyle={{ fontSize: 16, fontWeight: "normal" }}
              />
              {service.selected && (
                <View>
                  <Text style={styles.label}>{`Price for ${service.service
                    .replace(/([A-Z])/g, " $1")
                    .trim()} (RM per hour) :`}</Text>

                  <TextInput
                    style={styles.hpInput}
                    placeholder={`Price for ${service.service
                      .replace(/([A-Z])/g, " $1")
                      .trim()} (RM per hour)`}
                    // placeholderTextColor="#000"
                    keyboardType="numeric"
                    value={service.price}
                    onChangeText={(text) =>
                      handleServiceChange(index, "price", text)
                    }
                  />
                </View>
              )}
            </View>
          ))}

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
                  // if (event.type === "set") {
                  //   setNewTime(selectedDate || newTime);
                  // }
                  if (selectedDate) {
                    setNewTime(selectedDate); // Always update with the selected time
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

          <Text style={styles.label}>Bank Receiver Name</Text>
          <TextInput
            style={styles.hpInput}
            value={bankReceiverName}
            placeholder={"Enter Bank Receiver Name"}
            onChangeText={setBankReceiverName}
          />

          <Text style={styles.label}>Bank Name</Text>
          <TextInput
            style={styles.hpInput}
            value={bankName}
            placeholder={"Enter Bank Name"}
            onChangeText={setBankName}
          />

          <Text style={styles.label}>Account Number</Text>
          <TextInput
            style={styles.hpInput}
            value={accountNumber}
            placeholder={"Enter Account Number"}
            onChangeText={setAccountNumber}
          />

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

export default HpCreateOrEditVApp;
