// RegisterPage.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  Alert,
} from "react-native";
import styles from "../components/styles"; // Import shared styles
import { KeyboardAvoidingView } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { RadioButton } from "react-native-paper"; // For the radio button
import { SafeAreaView } from "react-native-safe-area-context"; // Import SafeAreaView for iOS
import axios from "axios";
import * as DocumentPicker from "expo-document-picker"; // Import DocumentPicker
import API_BASE_URL from "../../config/config";

const RegisterPage = () => {
  const [role, setRole] = useState("Elderly");
  const [fullName, setFullName] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [email, setEmail] = useState("");
  const [identityCard, setIdentityCard] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigation = useNavigation();
  const [isPasswordVisible, setPasswordVisible] = useState(false); // For toggling password visibility
  const [healthcareLicenseNo, setHealthcareLicenseNo] = useState("");
  const [identityCardFile, setIdentityCardFile] = useState(null);
  const [identityCardFileName, setIdentityCardFileName] = useState(""); // State for file name feedback
  const [healthcareLicenseFile, setHealthcareLicenseFile] = useState(null);
  const [healthcareLicenseFileName, setHealthcareLicenseFileName] =
    useState(""); // State for file name feedback
  const [communityOrganizerFile, setCommunityOrganizerFile] = useState(null);
  const [communityOrganizerFileName, setCommunityOrganizerFileName] =
    useState(""); // State for file name feedback
  const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false); // Toggle for confirm password visibility

  // State for invalid fields
  const [invalidFields, setInvalidFields] = useState({
    fullName: false,
    phoneNo: false,
    email: false,
    identityCard: false,
    password: false,
    confirmPassword: false,
    healthcareLicenseNo: false,
  });

  const validatePassword = (password) => {
    // Ensure password is at least 6 characters and contains both numbers and letters
    const isValidLength = password.length > 7;
    const hasLetters = /[A-Za-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    return isValidLength && hasLetters && hasNumbers;
  };

  const validatePhoneNumber = (phone) => {
    // Check if phone number starts with '0', has more than 10 digits, and is not a sequence of the same digit
    const isValidFormat = /^0\d{9,}$/.test(phone); // Starts with 0 and has at least 10 digits
    const isNotSequential = !/(.)\1{9}/.test(phone); // Not a sequence of the same digit
    return isValidFormat && isNotSequential;
  };

  const handleFileSelection = async (setFileState, setFileName) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "image/*",
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
        copyToCacheDirectory: false,
      });

      if (result && result.assets != null) {
        setFileState(result);
        setFileName(result.assets[0].name);
      } else {
        Alert.alert("File Selection", "File selection was canceled");
      }
    } catch (error) {
      console.error("Document selection error:", error);
      Alert.alert("Error", "Error selecting document");
    }
  };

  const handleRegister = async () => {
    const updatedInvalidFields = { ...invalidFields };
    let missingFields = [];
    let specificErrors = [];

    // Validate required fields
    if (!fullName) {
      updatedInvalidFields.fullName = true;
      // Alert.alert("Error", "Full name is required.");
      missingFields.push("Full Name");
      // return;
    } else {
      updatedInvalidFields.fullName = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.(com|my)$/;
    if (!email) {
      updatedInvalidFields.email = true;
      missingFields.push("Email");
    } else if (!emailRegex.test(email)) {
      updatedInvalidFields.email = true;
      specificErrors.push("Email must end with .com or .my.");
    } else {
      updatedInvalidFields.email = false;
    }

    if (!phoneNo) {
      updatedInvalidFields.phoneNo = true;
      missingFields.push("Phone Number");
    } else if (!validatePhoneNumber(phoneNo)) {
      updatedInvalidFields.phoneNo = true;
      specificErrors.push(
        "Phone Number must start with 0, have at least 10 digits, and cannot be a sequence of the same digit."
      );
    } else {
      updatedInvalidFields.phoneNo = false;
    }

    if (!identityCard) {
      updatedInvalidFields.identityCard = true;
      missingFields.push("Identity Card Number");
    } else if (identityCard.length !== 12 || !/^\d+$/.test(identityCard)) {
      updatedInvalidFields.identityCard = true;
      specificErrors.push("Identity Card Number must be 12 digits.");
    } else {
      updatedInvalidFields.identityCard = false;
    }

    if (!password) {
      updatedInvalidFields.password = true;
      missingFields.push("Password");
    } else if (!validatePassword(password)) {
      updatedInvalidFields.password = true;
      specificErrors.push(
        "Password must be more than 8 characters long and include a mix of letters, numbers, and symbols."
      );
    } else {
      updatedInvalidFields.password = false;
    }

    if (!confirmPassword) {
      updatedInvalidFields.confirmPassword = true;
      missingFields.push("Password");
    } else if (password !== confirmPassword) {
      updatedInvalidFields.confirmPassword = true;
      specificErrors.push("Password confirmation does not match.");
    } else {
      updatedInvalidFields.confirmPassword = false;
    }

    // Validate healthcare license number if role is Healthcare Provider
    if (role === "Healthcare Provider" && !healthcareLicenseNo) {
      updatedInvalidFields.healthcareLicenseNo = true;
      missingFields.push("Healthcare License Number");
    } else {
      updatedInvalidFields.healthcareLicenseNo = false;
    }

    setInvalidFields(updatedInvalidFields);

    // Show specific alerts if there are 1-2 issues, otherwise a general alert
    if (missingFields.length > 2 || specificErrors.length > 2) {
      Alert.alert(
        "Incomplete Registration",
        "Please fill in all required fields highlighted in red."
      );
    } else if (missingFields.length > 0) {
      Alert.alert(
        "Missing Information",
        `Please fill in the following fields: ${missingFields.join(", ")}.`
      );
    } else if (specificErrors.length > 0) {
      Alert.alert("Invalid Information", specificErrors.join("\n"));
    } else {
      if (!identityCardFile) {
        Alert.alert("Error", "Identity card photo upload is required.");
        return;
      }

      // Role-specific validations
      if (role === "Healthcare Provider") {
        if (!healthcareLicenseNo) {
          Alert.alert("Error", "Healthcare license number is required.");
          return;
        }
        if (!healthcareLicenseFile) {
          Alert.alert(
            "Error",
            "Healthcare license document upload is required."
          );
          return;
        }
      }

      if (role === "Community Organizer" && !communityOrganizerFile) {
        Alert.alert(
          "Error",
          "Community organizer document upload is required."
        );
        return;
      }

      // Role mapping: "1" for User, "2" for Community Organizer, "3" for Healthcare Provider
      const roleMapping = {
        Elderly: 1,
        "Family / Caregiver / Volunteer": 4,
        "Community Organizer": 2,
        "Healthcare Provider": 3,
      };
      const roleValue = roleMapping[role];

      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("phoneNo", phoneNo);
      formData.append("email", email);
      formData.append("identityCard", identityCard);
      formData.append("password", password);
      formData.append("role", roleValue);
      formData.append("healthcareLicenseNo", healthcareLicenseNo);
      formData.append("identityCardFile", {
        uri: identityCardFile.assets[0].uri,
        name: identityCardFile.assets[0].name || "identityCard",
        type: identityCardFile.type,
      });

      if (role === "Healthcare Provider" && healthcareLicenseFile) {
        formData.append("healthcareLicenseFile", {
          uri: healthcareLicenseFile.assets[0].uri,
          name: healthcareLicenseFile.name || "healthcare_license",
          type: healthcareLicenseFile.type,
        });
      }
      if (role === "Community Organizer" && communityOrganizerFile) {
        formData.append("communityOrganizerFile", {
          uri: communityOrganizerFile.assets[0].uri,
          name: communityOrganizerFile.name || "community_organizer",
          type: communityOrganizerFile.mimeType || "application/octet-stream",
        });
      }

      try {
        const response = await axios.post(
          `${API_BASE_URL}/auth/register`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        Alert.alert("Success", "You are registered successfully!", [
          { text: "OK", onPress: () => navigation.navigate("LoginPage") },
        ]);
      } catch (error) {
        Alert.alert("Error", "Failed to register. Please try again.");
      }
    }
  };

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  return (
    <ImageBackground
      source={require("../../assets/LoadingBackground.png")}
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
        <Text style={styles.title}>Register</Text>
      </View>

      {/* SafeAreaView wraps the content to ensure it's inside the safe area */}
      <SafeAreaView style={styles.safeAreaContainer}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.container}>
            {/* Full Name Input with Icon and Precautions */}
            <View style={styles.inputContainer}>
              <Ionicons
                name="person"
                size={24}
                color="#666"
                style={styles.icon}
              />
              <TextInput
                style={[
                  styles.input,
                  invalidFields.fullName && styles.invalidInput,
                ]}
                placeholder="Full name"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>
            <Text style={styles.precautions}>
              Make sure it matches the name on your government ID.
            </Text>
            {/* Phone Number Input with Icon */}
            <View style={styles.inputContainer}>
              <Ionicons
                name="call"
                size={24}
                color="#666"
                style={styles.icon}
              />
              <TextInput
                style={[
                  styles.input,
                  invalidFields.phoneNo && styles.invalidInput,
                ]}
                placeholder="Phone No (Eg. 0123456789)"
                value={phoneNo}
                onChangeText={setPhoneNo}
                keyboardType="phone-pad"
              />
            </View>
            {/* Email Input with Icon */}
            <View style={styles.inputContainer}>
              <Ionicons
                name="mail"
                size={24}
                color="#666"
                style={styles.icon}
              />
              <TextInput
                style={[
                  styles.input,
                  invalidFields.email && styles.invalidInput,
                ]}
                placeholder="Email Address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
            </View>
            {/* Identity Card Input with Icon and Precautions */}
            <View style={styles.inputContainer}>
              <Ionicons
                name="card"
                size={24}
                color="#666"
                style={styles.icon}
              />
              <TextInput
                style={[
                  styles.input,
                  invalidFields.identityCard && styles.invalidInput,
                ]}
                placeholder="Identity Card Number"
                value={identityCard}
                onChangeText={setIdentityCard}
                keyboardType="numeric"
              />
            </View>
            <Text style={styles.precautions}>
              We will send a notification after authentication succeeds.
            </Text>
            {/* Upload Identity Card with Camera Icon */}
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() =>
                handleFileSelection(
                  setIdentityCardFile,
                  setIdentityCardFileName
                )
              }
            >
              <Ionicons
                name="camera"
                size={24}
                color="#fff"
                style={styles.icon}
              />
              <Text style={styles.uploadButtonText}>
                Upload Identity Card Photo
              </Text>
            </TouchableOpacity>
            {identityCardFileName ? (
              <Text style={styles.uploadFeedback}>
                Uploaded file: {identityCardFileName}
                {"\n"}
              </Text>
            ) : null}
            <Text style={styles.uploadPrecautions}>
              Please make sure there are both back and front photos of the
              identity card.
            </Text>
            {/* Password Input with Icon and Visibility Toggle */}
            <View style={styles.inputContainer}>
              <Ionicons
                name="lock-closed"
                size={24}
                color="#666"
                style={styles.icon}
              />
              <TextInput
                style={[
                  styles.input,
                  invalidFields.password && styles.invalidInput,
                ]}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!isPasswordVisible} // Toggle visibility
              />
              {/* Make sure TouchableOpacity wraps around the icon properly */}
              <TouchableOpacity
                onPress={() => setPasswordVisible(!isPasswordVisible)}
                // onPress={togglePasswordVisibility}
                style={{ marginLeft: 10 }}
              >
                <Ionicons
                  name={isPasswordVisible ? "eye-off" : "eye"}
                  size={24}
                  color="gray"
                />
              </TouchableOpacity>
            </View>
            {/* Confirm Password Input with Icon and Visibility Toggle */}
            <View style={styles.inputContainer}>
              <Ionicons
                name="lock-closed"
                size={24}
                color="#666"
                style={styles.icon}
              />
              <TextInput
                style={[
                  styles.input,
                  invalidFields.confirmPassword && styles.invalidInput,
                ]}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!isConfirmPasswordVisible}
              />
              {/* Make sure TouchableOpacity wraps around the icon properly */}
              <TouchableOpacity
                onPress={() =>
                  setConfirmPasswordVisible(!isConfirmPasswordVisible)
                }
                style={{ marginLeft: 10 }}
              >
                <Ionicons
                  name={isConfirmPasswordVisible ? "eye-off" : "eye"}
                  size={24}
                  color="gray"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Role Section */}
          <View style={styles.underline} />
          <Text style={styles.question}>Role</Text>
          <View style={styles.underline} />
          <RadioButton.Group onValueChange={handleRoleChange} value={role}>
            <View style={styles.radioButtonContainer}>
              <RadioButton.Item
                label="Elderly"
                value="Elderly"
                mode="android"
                position="leading"
                color={styles.radioButtonColor.color}
                labelStyle={styles.radioLabel}
              />
            </View>
            <View style={styles.radioButtonContainer}>
              <RadioButton.Item
                label="Family / Caregiver / Volunteer"
                value="Family / Caregiver / Volunteer"
                mode="android"
                position="leading"
                color={styles.radioButtonColor.color}
                labelStyle={styles.radioLabel}
              />
            </View>
            <View style={styles.radioButtonContainer}>
              <RadioButton.Item
                label="Healthcare Provider"
                value="Healthcare Provider"
                mode="android"
                position="leading"
                color={styles.radioButtonColor.color}
                labelStyle={styles.radioLabel}
              />
            </View>
            <View style={styles.radioButtonContainer}>
              <RadioButton.Item
                label="Community Organizer"
                value="Community Organizer"
                mode="android"
                position="leading"
                color={styles.radioButtonColor.color}
                labelStyle={styles.radioLabel}
              />
            </View>
          </RadioButton.Group>

          {/* Dynamic Fields Based on Role */}
          {role === "Healthcare Provider" && (
            <View style={styles.container}>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="medkit"
                  size={24}
                  color="#666"
                  style={styles.icon}
                />
                <TextInput
                  style={[
                    styles.input,
                    invalidFields.healthcareLicenseNo && styles.invalidInput,
                  ]}
                  placeholder="MMC Registration Number"
                  value={healthcareLicenseNo}
                  onChangeText={setHealthcareLicenseNo}
                />
              </View>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={() =>
                  handleFileSelection(
                    setHealthcareLicenseFile,
                    setHealthcareLicenseFileName
                  )
                }
              >
                <Ionicons
                  name="document"
                  size={24}
                  color="#fff"
                  style={styles.icon}
                />
                <Text style={styles.uploadButtonText}>
                  Upload Healthcare License Document
                </Text>
              </TouchableOpacity>
              {healthcareLicenseFileName ? (
                <Text style={styles.uploadFeedback}>
                  Uploaded file: {healthcareLicenseFileName}
                  {"\n"}
                </Text>
              ) : null}
              <Text style={styles.uploadPrecautions}>
                Please upload related documents to verify your role identity.
              </Text>
            </View>
          )}

          {role === "Community Organizer" && (
            <View style={styles.container}>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={() =>
                  handleFileSelection(
                    setCommunityOrganizerFile,
                    setCommunityOrganizerFileName
                  )
                }
              >
                <Ionicons
                  name="document"
                  size={24}
                  color="#fff"
                  style={styles.icon}
                />
                <Text style={styles.uploadButtonText}>
                  Upload Community Organizer Document
                </Text>
              </TouchableOpacity>
              {communityOrganizerFileName ? (
                <Text style={styles.uploadFeedback}>
                  Uploaded file: {communityOrganizerFileName}
                  {"\n"}
                </Text>
              ) : null}
              <Text style={styles.uploadPrecautions}>
                Please upload related documents to verify your role identity.
              </Text>
            </View>
          )}

          <View style={styles.container}>
            {/* Sign Up Button */}
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default RegisterPage;
