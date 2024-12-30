import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons"; // For icons
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import CoNavigationBar from "../../components/CoNavigationBar"; // Import here
import styles from "../../components/styles"; // Import shared styles
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../../../config/config";
import { AuthContext } from "../../../context/AuthProvider";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { Buffer } from "buffer";
import { getUserIdFromToken } from "../../../services/authService";
import { useNotification } from "../../../context/NotificationProvider";

const CoProfilePage = () => {
  const { logout } = useContext(AuthContext); // Get logout from AuthContext
  const [profile_image, setProfile_image] = useState(null);
  const navigation = useNavigation();
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState("");
  const { handleClearInterval } = useNotification();

  const fetchUserId = async () => {
    const userId = await getUserIdFromToken();
    console.log("userId:", userId);
    if (userId) {
      setUserId(userId);
      fetchProfileData(userId);
    }
  };

  // Fetch the profile data, including the profile image
  const fetchProfileData = async (userId) => {
    if (!userId) {
      console.error("User ID is missing");
      return;
    }
    try {
      console.log("Fetching profile data for user ID:", userId);
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        alert("No token found. Please log in.");
        return;
      }
      console.log("Authorization token:", token); // Debugging log
      const response = await axios.get(`${API_BASE_URL}/profile/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // const response = await fetch(`${API_BASE_URL}/profile/${userId}`);
      // if (!response.ok) {
      //   throw new Error("Failed to fetch profile data");
      // }
      if (response.data) {
        const data = response.data;
        setUsername(data.username || data.full_name || "");
        // setProfileImage(data.profile_image || null); // Set base64 profile image or null
        // Check if profile_image is a Buffer
        if (data.profile_image && data.profile_image.type === "Buffer") {
          const byteArray = data.profile_image.data; // Access the data property of the Buffer

          // Use Buffer to convert to Base64
          const base64String = Buffer.from(byteArray).toString("base64");
          const imageUri = `data:image/jpeg;base64,${base64String}`;
          // console.log("Profile Image URI:", imageUri);
          setProfile_image(imageUri);
        } else {
          console.log("No valid profile image found.");
          setProfile_image(null);
        }
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
      Alert.alert("Error", "Failed to fetch profile data. Please try again.");
    }
  };

  // Refresh data when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      console.log("Screen focused, refreshing data");
      fetchUserId();
    }, [])
  );

  //   useEffect(() => {
  //     fetchUserId();
  //   }, []);

  // Confirm and handle Delete Account
  const handleDeleteAccount = () => {
    Alert.alert(
      "Confirm Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel", // User cancels
          style: "cancel",
        },
        {
          text: "Yes", // User confirms
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("token");
              if (!token || !userId) {
                Alert.alert("Error", "Unable to authenticate. Please log in.");
                return;
              }
              const response = await axios.delete(
                `${API_BASE_URL}/deleteAccount/${userId}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              if (response.status === 200) {
                Alert.alert(
                  "Success",
                  "Your account has been deleted successfully."
                );
                await logout(); // Log out and clear token
                handleClearInterval();
                navigation.reset({
                  index: 0,
                  routes: [{ name: "LoginPage" }],
                });
              }
            } catch (error) {
              console.error("Error deleting account:", error);
              Alert.alert(
                "Error",
                "Failed to delete account. Please try again."
              );
            }
          },
        },
      ],
      { cancelable: false } // Prevent closing the alert by tapping outside
    );
  };

  // // Sign Out Function
  // const handleSignOut = async () => {
  //   try {
  //     // Remove token from AsyncStorage
  //     await AsyncStorage.removeItem("authToken");
  //     // Navigate back to the login page
  //     navigation.reset({
  //       index: 0,
  //       routes: [{ name: "LoginPage" }],
  //     });
  //   } catch (error) {
  //     console.error("Error signing out:", error);
  //   }
  // };
  // Confirm and handle Sign Out
  const handleSignOut = () => {
    Alert.alert(
      "Confirm Sign Out",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel", // User cancels
          style: "cancel",
        },
        {
          text: "Yes", // User confirms
          onPress: async () => {
            try {
              await logout(); // Log out function from AuthContext
              handleClearInterval();
              navigation.navigate("LoginPage");
            } catch (error) {
              console.error("Error signing out:", error);
            }
          },
        },
      ],
      { cancelable: false } // Prevent closing the alert by tapping outside
    );
  };

  return (
    <ImageBackground
      source={require("../../../assets/MainPage.png")}
      style={styles.background}
    >
      <View style={styles.smallHeaderContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Profile</Text>
      </View>

      <View style={styles.profileContainer}>
        {/* Profile Image */}
        {/* <TouchableOpacity onPress={pickImage}> */}
        <Image
          source={
            profile_image
              ? { uri: profile_image }
              : require("../../../assets/defaultProfile.jpg")
          }
          style={styles.profileImage}
        />
        {/* </TouchableOpacity> */}
        <Text style={styles.userName}> {username} </Text>
        <Text style={styles.profileId}>ID: {userId}</Text>
        <TouchableOpacity
          style={styles.editProfileButton}
          onPress={() => navigation.navigate("CoEditProfilePage")}
        >
          <Text style={styles.editProfileText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.pageContainer}>
        <View style={styles.pageContainer}>
          {/* Security Settings */}
          <View style={styles.settingsContainer}>
            <Text style={styles.smallSectionTitle}>Security Settings</Text>

            {/* Change Password */}
            <TouchableOpacity
              style={styles.optionContainer}
              onPress={() => navigation.navigate("ChangePassword")}
            >
              <Text style={styles.optionText}>Change Password</Text>
              <Ionicons name="chevron-forward" size={20} color="#333" />
            </TouchableOpacity>

            {/* Delete Account */}
            <TouchableOpacity
              style={styles.optionContainer}
              onPress={handleDeleteAccount}
            >
              <Text style={styles.optionText}>Delete Account</Text>
              <Ionicons name="chevron-forward" size={20} color="#333" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      {/* Sign Out Button */}
      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutButtonText}>Sign Out</Text>
      </TouchableOpacity>
      {/* Navigation Bar */}
      <CoNavigationBar navigation={navigation} activePage="CoProfilePage" />
    </ImageBackground>
  );
};

export default CoProfilePage;
