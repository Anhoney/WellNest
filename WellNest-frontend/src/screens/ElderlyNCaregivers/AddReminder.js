//AddReminder.js
import React, { useState, useEffect } from "react";
import {
  ImageBackground,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import axios from "axios";
import * as ImagePicker from "expo-image-picker"; // Import ImagePicker
import styles from "../../components/styles";
import Ionicons from "react-native-vector-icons/Ionicons";
import { getUserIdFromToken } from "../../../services/authService";
import NavigationBar from "../../components/NavigationBar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../../../config/config";

const AddReminder = ({ navigation }) => {
  const getCurrentTime = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? String(hours).padStart(2, "0") : "12";

    return `${hours}:${minutes} ${ampm}`;
  };

  const [pillName, setPillName] = useState("");
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState("");
  const [time, setTime] = useState(getCurrentTime());
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [repeatOption, setRepeatOption] = useState("Everyday");
  const [foodRelation, setFoodRelation] = useState("flexible");
  const [selectedFile, setSelectedFile] = useState(null);
  const [userId, setUserId] = useState(null);

  const handleTimeConfirm = (selectedTime) => {
    const formattedTime = selectedTime.toTimeString().substring(0, 5);
    setTime(formattedTime);
    setTimePickerVisibility(false);
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
      console.log("Selected File:", selectedFile);
      if (selectedFile) {
        formData.append("medicineImage", {
          uri: selectedFile.assets[0].uri,
          name: selectedFile.assets[0].uri.split("/").pop(),
          type: selectedFile.mimeType || "image/jpeg",
        });
      }

      await axios.post(`${API_BASE_URL}/medication`, formData, {
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
        <Text style={styles.title}> Medical History </Text>
      </View>
      <View style={styles.mrcontainer}>
        <Text style={styles.mrheader}>Add Medication Reminder</Text>

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
          onConfirm={handleTimeConfirm}
          onCancel={() => setTimePickerVisibility(false)}
        />

        <View style={styles.mrrow}>
          <Ionicons name="repeat" size={18} color="#000" />
          <Text style={styles.mrlabel}>Repeat</Text>
        </View>
        <View style={styles.mrfoodButtons}>
          {["Everyday", "Monday-Friday", "One-time only"].map((option) => (
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
        <TouchableOpacity style={styles.mrinput} onPress={handleFileSelection}>
          <Text>
            {selectedFile
              ? selectedFile.assets[0].fileName
              : "Choose Medicine Image"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signOutButton} onPress={handleSubmit}>
          <Text style={styles.signOutButtonText}>Done</Text>
        </TouchableOpacity>
      </View>
      <NavigationBar navigation={navigation} activePage="" />
    </ImageBackground>
  );
};

export default AddReminder;
