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
} from "react-native";
import styles from "../components/styles"; // Import shared styles
import { KeyboardAvoidingView } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { RadioButton } from "react-native-paper"; // For the radio button
import { SafeAreaView } from "react-native-safe-area-context"; // Import SafeAreaView for iOS
import axios from "axios";
// import DocumentPicker from "react-native-document-picker";
// import FormData from "form-data";
// import * as FileSystem from "expo-file-system"; // or another relevant file handling package for React Native

const RegisterPage = () => {
  const [role, setRole] = useState("User");
  const [fullName, setFullName] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [email, setEmail] = useState("");
  const [identityCard, setIdentityCard] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigation = useNavigation();
  const [isPasswordVisible, setPasswordVisible] = useState(false); // For toggling password visibility
  const [healthcareLicenseNo, setHealthcareLicenseNo] = useState("");
  // const [identityCardFile, setIdentityCardFile] = useState(null);
  // const [healthcareLicenseFile, setHealthcareLicenseFile] = useState(null);
  // const [communityOrganizerFile, setCommunityOrganizerFile] = useState(null);

  // Function to map role to its corresponding numeric value
  // const getRoleNumber = (selectedRole) => {
  //   switch (selectedRole) {
  //     case "User":
  //       return 1;
  //     case "Community Organizer":
  //       return 2;
  //     case "Healthcare Provider":
  //       return 3;
  //     default:
  //       return 1;
  //   }
  // };

  // const handleDocumentUpload = async () => {
  //   try {
  //     const file = await DocumentPicker.pick({
  //       type: [DocumentPicker.types.pdf, DocumentPicker.types.images],
  //     });
  //     // Upload this file to your server
  //     console.log(file);
  //   } catch (err) {
  //     if (DocumentPicker.isCancel(err)) {
  //       console.warn("User cancelled the picker");
  //     } else {
  //       console.error("Unknown error:", err);
  //     }
  //   }
  // };

  // const handleDocumentUpload = async (documentType) => {
  //   try {
  //     const file = await DocumentPicker.pick({
  //       type: [DocumentPicker.types.pdf, DocumentPicker.types.images],
  //     });

  //     // Based on the type of document, set the state accordingly
  //     if (documentType === "identityCard") {
  //       setIdentityCardFile(file);
  //     } else if (documentType === "healthcareLicense") {
  //       setHealthcareLicenseFile(file);
  //     } else if (documentType === "communityOrganizer") {
  //       setCommunityOrganizerFile(file);
  //     }
  //   } catch (err) {
  //     if (DocumentPicker.isCancel(err)) {
  //       console.warn("User cancelled the picker");
  //     } else {
  //       console.error("Unknown error:", err);
  //     }
  //   }
  // };

  const handleRegister = () => {
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.(com|my)$/;
    if (!emailRegex.test(email)) {
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
    if (identityCard.length !== 12 || !/^\d+$/.test(identityCard)) {
      Alert.alert(
        "Invalid Identity Card Number",
        "Identity card number must be exactly 12 digits."
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    // const roleNumber = getRoleNumber(role);

    // Role mapping: "1" for User, "2" for Community Organizer, "3" for Healthcare Provider
    const roleMapping = {
      User: 1,
      "Community Organizer": 2,
      "Healthcare Provider": 3,
    };
    const roleValue = roleMapping[role];

    // Create a FormData instance for file upload
    // const formData = new FormData();
    // formData.append("fullName", fullName);
    // formData.append("phoneNo", phoneNo);
    // formData.append("email", email);
    // formData.append("identityCard", identityCard);
    // formData.append("password", password);
    // formData.append("role", roleValue); // 1 for User, 2 for Community Organizer, 3 for Healthcare Provider

    // // Attach identity card file
    // if (identityCardFile) {
    //   formData.append("identityCardImage", {
    //     uri: identityCardFile.uri,
    //     type: identityCardFile.type,
    //     name: identityCardFile.name || "identity_card",
    //   });
    // }

    // // Attach healthcare license file if role is Healthcare Provider
    // if (role === "Healthcare Provider" && healthcareLicenseFile) {
    //   formData.append("healthcareLicenseDocument", {
    //     uri: healthcareLicenseFile.uri,
    //     type: healthcareLicenseFile.type,
    //     name: healthcareLicenseFile.name || "healthcare_license",
    //   });
    // }

    // // Attach community organizer document if role is Community Organizer
    // if (role === "Community Organizer" && communityOrganizerFile) {
    //   formData.append("communityOrganizerDocument", {
    //     uri: communityOrganizerFile.uri,
    //     type: communityOrganizerFile.type,
    //     name: communityOrganizerFile.name || "community_organizer",
    //   });
    // }

    axios
      .post("http://localhost:5001/api/auth/register", {
        fullName,
        phoneNo,
        email,
        identityCard,
        password,
        // role: roleNumber,
        role: roleValue,
        healthcareLicenseNo:
          role === "Healthcare Provider" ? healthcareLicenseNo : null, // Optional based on role
      })
      .then((response) => {
        console.log("Registration success:", response.data);
        Alert.alert("Success", "You are registered successfully!", [
          { text: "OK", onPress: () => navigation.navigate("LoginPage") },
        ]);
      })
      .catch((error) => {
        console.error("Registration error:", error);
        Alert.alert("Error", "Failed to register. Please try again.");
      });
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
      {/* Title Section with Back Arrow */}
      <View style={styles.smallHeaderContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
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
                // onPress={() => handleDocumentUpload("identityCard")}
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
                  label="User"
                  value="User"
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
                  // onPress={() => handleDocumentUpload("healthcareLicense")}
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
                <Text
                  style={styles.uploadPrecautions}
                  onPress={handleDocumentUpload}
                >
                  Please upload related documents to verify your role identity.
                </Text>
              </View>
            )}

            {role === "Community Organizer" && (
              <View style={styles.container}>
                <TouchableOpacity
                  style={styles.uploadButton}
                  // onPress={() => handleDocumentUpload("communityOrganizer")}
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
// onPress={() => { }}
