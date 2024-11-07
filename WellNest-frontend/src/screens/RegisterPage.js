// RegisterPage.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  Platform,
  Alert,
  Image,
} from "react-native";
import styles from "../components/styles"; // Import shared styles
import { KeyboardAvoidingView } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { RadioButton } from "react-native-paper"; // For the radio button
import { SafeAreaView } from "react-native-safe-area-context"; // Import SafeAreaView for iOS
import axios from "axios";
import * as DocumentPicker from "expo-document-picker"; // Import DocumentPicker

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
  const [selectedFile, setSelectedFile] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  // // Function to handle document picking
  // const handleFileSelection = async (setFileState, setFileName) => {
  //   try {
  //     const result = await DocumentPicker.getDocumentAsync({
  //       type: "*/*",
  //       copyToCacheDirectory: false,
  //     });
  //     if (result.type === "success") {
  //       setFileState(result);
  //       setFileName(result.name); // Set the file name for feedback
  //     } else {
  //       Alert.alert("File selection was canceled");
  //     }
  //   } catch (error) {
  //     console.error("Document selection error:", error);
  //     Alert.alert("Error selecting document");
  //   }
  // };

  const handleFileSelection = async (
    setFileState,
    setFileName,
    documentType
  ) => {
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

      if (result != null) {
        // console.log();
        setFileState(result);
        if (documentType === "identityCard") {
          setIdentityCardFile(result);
        }
        // } else if (documentType === "healthcareLicense") {
        //   setHealthcareLicenseFile(result);
        // } else if (documentType === "communityOrganizer") {
        //   setCommunityOrganizerFile(result);
        // }

        setFileName(result.assets[0].name);
        // console.log(result.type);
        console.log(healthcareLicenseFileName);
      } else {
        console.log("No file selected or result is null");
        Alert.alert("File Selection", "File selection was canceled");
      }
    } catch (error) {
      console.error("Document selection error:", error);
      Alert.alert("Error", "Error selecting document");
    }
  };

  // const handleFileChange = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     setSelectedFile(file);
  //   }
  // };

  const handleRegister = async () => {
    // Validate required fields
    if (!fullName) {
      Alert.alert("Error", "Full name is required.");
      return;
    }

    if (!phoneNo) {
      Alert.alert("Error", "Phone number is required.");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.(com|my)$/;
    if (!email) {
      Alert.alert("Error", "Email address is required.");
      return;
    } else if (!emailRegex.test(email)) {
      Alert.alert(
        "Invalid Email",
        "Please enter a valid email address ending with .com or .my."
      );
      return;
    }

    // Phone number validation (at least 10 digits)
    if (phoneNo.length < 10) {
      Alert.alert(
        "Invalid Phone Number",
        "Phone number must be at least 10 digits."
      );
      return;
    }

    // Identity card validation (must be exactly 12 digits)
    if (!identityCard) {
      Alert.alert("Error", "Identity card number is required.");
      return;
    } else if (identityCard.length !== 12 || !/^\d+$/.test(identityCard)) {
      Alert.alert(
        "Invalid Identity Card Number",
        "Identity card number must be exactly 12 digits."
      );
      return;
    }

    if (!password) {
      Alert.alert("Error", "Password is required.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

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
        Alert.alert("Error", "Healthcare license document upload is required.");
        return;
      }
    }

    if (role === "Community Organizer" && !communityOrganizerFile) {
      Alert.alert("Error", "Community organizer document upload is required.");
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
      uri: identityCardFile.uri,
      name: identityCardFile.name || "identityCard",
      type: identityCardFile.type,
    });

    if (role === "Healthcare Provider" && healthcareLicenseFile) {
      formData.append("healthcareLicenseFile", {
        uri: healthcareLicenseFile.uri,
        name: healthcareLicenseFile.name || "healthcare_license",
        type: healthcareLicenseFile.type,
      });
    }
    if (role === "Community Organizer" && communityOrganizerFile) {
      formData.append("communityOrganizerFile", {
        uri: communityOrganizerFile.uri,
        name: communityOrganizerFile.name || "community_organizer",
        type: communityOrganizerFile.mimeType || "application/octet-stream",
      });
    }

    //   axios
    //     .post("http://localhost:5001/api/auth/register", formData, {
    //       headers: { "Content-Type": "multipart/form-data" },
    //     })
    //     .then((response) => {
    //       Alert.alert("Success", "You are registered successfully!", [
    //         { text: "OK", onPress: () => navigation.navigate("LoginPage") },
    //       ]);
    //     })
    //     .catch((error) => {
    //       console.error("Registration error:", error);
    //       Alert.alert("Error", "Failed to register. Please try again.");
    //     });
    // };

    try {
      const response = await axios.post(
        "http://localhost:5001/api/auth/register",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log(response);
      Alert.alert("Success", "You are registered successfully!", [
        { text: "OK", onPress: () => navigation.navigate("LoginPage") },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to register. Please try again.");
      console.log("Registration error:", error);
    }

    // axios
    //   .post("http://localhost:5001/api/auth/register", formData, {
    //     // fullName,
    //     // phoneNo,
    //     // email,
    //     // identityCard,
    //     // password,
    //     // // role: roleNumber,
    //     // role: roleValue,
    //     // healthcareLicenseNo:
    //     //   role === "Healthcare Provider" ? healthcareLicenseNo : null, // Optional based on role
    //     headers: { "Content-Type": "multipart/form-data" },
    //   })
    //   .then((response) => {
    //     console.log("Registration success:", response.data);
    //     Alert.alert("Success", "You are registered successfully!", [
    //       { text: "OK", onPress: () => navigation.navigate("LoginPage") },
    //     ]);
    //   })
    //   .catch((error) => {
    //     console.error("Registration error:", error);
    //     Alert.alert("Error", "Failed to register. Please try again.");
    //   });
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
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          enabled
        >
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
                  style={styles.input}
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
                  style={styles.input}
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
                  style={styles.input}
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
                  style={styles.input}
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
                    setIdentityCardFileName,
                    "identityCard"
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
                  style={styles.input}
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!isPasswordVisible} // Toggle visibility
                />
                {/* Make sure TouchableOpacity wraps around the icon properly */}
                <TouchableOpacity
                  onPress={togglePasswordVisibility}
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
                  style={styles.input}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!isPasswordVisible} // Toggle visibility
                />
                {/* Make sure TouchableOpacity wraps around the icon properly */}
                <TouchableOpacity
                  onPress={togglePasswordVisibility}
                  style={{ marginLeft: 10 }}
                >
                  <Ionicons
                    name={isPasswordVisible ? "eye-off" : "eye"}
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
                    style={styles.input}
                    placeholder="Healthcare License Number"
                    value={healthcareLicenseNo}
                    onChangeText={setHealthcareLicenseNo}
                    // Add relevant input and state for healthcare-specific fields
                  />
                </View>
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={() =>
                    handleFileSelection(
                      setHealthcareLicenseFile,
                      setHealthcareLicenseFileName,
                      "healthcareLicense"
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
                      setCommunityOrganizerFileName,
                      "communityOrganizer"
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
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default RegisterPage;
