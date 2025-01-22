import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // For icons
import styles from "../components/styles"; // Import shared styles
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../../config/config";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isOldPasswordVisible, setIsOldPasswordVisible] = useState(false); // State for old password visibility
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false); // State for new password visibility
  const navigation = useNavigation();

  const validatePassword = (password) => {
    // Ensure password is at least 8 characters and contains both numbers and letters
    const isValidLength = password.length >= 8; // Changed to >= 8 for clarity
    const hasLetters = /[A-Za-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    return isValidLength && hasLetters && hasNumbers;
  };

  const handleChangePassword = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");

      if (!userId) {
        Alert.alert("Error", "User ID not found. Please log in again.");
        return;
      }

      if (!oldPassword || !newPassword) {
        Alert.alert("Error", "Please fill in all fields");
        return;
      }

      // Validate the new password
      if (!validatePassword(newPassword)) {
        Alert.alert(
          "Validation Error",
          "New password must be at least 8 characters long and contain both letters and numbers."
        );
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/auth/changePassword/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ oldPassword, newPassword }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        Alert.alert("Success", data.message, [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert("Error", data.error);
      }
    } catch (error) {
      console.error("Change password error:", error);
      Alert.alert(
        "Error",
        "Failed to change password. Please try again later."
      );
    }
  };

  const debugUserId = async () => {
    const userId = await AsyncStorage.getItem("userId");
    console.log("Stored userId:", userId);
  };
  useEffect(() => {
    debugUserId();
  }, []);

  //   // Toggle password visibility
  //   const togglePasswordVisibility = () => {
  //     setPasswordVisible(!isPasswordVisible);
  //   };

  return (
    <ImageBackground
      source={require("../../assets/PlainGrey.png")}
      style={styles.background}
    >
      <View style={styles.smallHeaderContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Change Password</Text>
      </View>

      <View style={styles.changePwdContainer}>
        {/* <Text style={styles.title}>Change Password</Text> */}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Old Password"
            secureTextEntry={!isOldPasswordVisible} // Toggle visibility
            style={styles.input}
            value={oldPassword}
            onChangeText={setOldPassword}
          />
          <TouchableOpacity
            onPress={() => setIsOldPasswordVisible(!isOldPasswordVisible)} // Toggle state
            style={{ marginLeft: 10 }}
          >
            <Ionicons
              name={isOldPasswordVisible ? "eye-off" : "eye"} // Change icon
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="New Password"
            secureTextEntry={!isNewPasswordVisible} // Toggle visibility
            style={styles.input}
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TouchableOpacity
            onPress={() => setIsNewPasswordVisible(!isNewPasswordVisible)} // Toggle state
            style={{ marginLeft: 10 }}
          >
            <Ionicons
              name={isNewPasswordVisible ? "eye-off" : "eye"} // Change icon
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
          <Text style={styles.buttonText}>Change Password</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]} // Styled Cancel Button
          onPress={() => navigation.goBack()} // Go back to the previous page
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     justifyContent: "center",
//     backgroundColor: "#fff",
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 20,
//     textAlign: "center",
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 5,
//     padding: 10,
//     marginBottom: 20,
//   },
//   button: {
//     backgroundColor: "#007BFF",
//     padding: 15,
//     borderRadius: 5,
//   },
//   buttonText: {
//     color: "#fff",
//     textAlign: "center",
//     fontSize: 16,
//   },
// });

export default ChangePassword;
