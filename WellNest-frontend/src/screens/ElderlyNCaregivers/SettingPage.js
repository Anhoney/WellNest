// SettingPage.js
import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import styles from "../../components/styles"; // Import shared styles
import NavigationBar from "../../components/NavigationBar"; // Import here
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../../../config/config";
import { AuthContext } from "../../../context/AuthProvider";
import axios from "axios";
import { getUserIdFromToken } from "../../../services/authService";
import { Buffer } from "buffer";
import { useNotification } from "../../../context/NotificationProvider";

const SettingPage = () => {
  const { logout } = useContext(AuthContext); // Get logout from AuthContext
  const [profile_image, setProfile_image] = useState(null);
  const navigation = useNavigation();
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState("");
  const { handleClearInterval } = useNotification();

  const fetchUserId = async () => {
    const userId = await getUserIdFromToken();

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
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        alert("No token found. Please log in.");
        return;
      }
      const response = await axios.get(`${API_BASE_URL}/profile/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data) {
        const data = response.data;
        setUsername(data.username || data.full_name || "");
        // Check if profile_image is a Buffer
        if (data.profile_image && data.profile_image.type === "Buffer") {
          const byteArray = data.profile_image.data; // Access the data property of the Buffer

          // Use Buffer to convert to Base64
          const base64String = Buffer.from(byteArray).toString("base64");
          const imageUri = `data:image/jpeg;base64,${base64String}`;

          setProfile_image(imageUri);
        } else {
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
        <Text style={styles.title}>Setting</Text>
      </View>

      <View style={styles.profileContainer}>
        {/* Profile Image */}
        <TouchableOpacity>
          <Image
            source={
              profile_image
                ? { uri: profile_image }
                : require("../../../assets/defaultProfile.jpg")
            }
            style={styles.profileImage}
          />
        </TouchableOpacity>
        <Text style={styles.userName}>{username}</Text>
        <Text style={styles.profileId}>ID: {userId}</Text>
      </View>

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
      {/* Sign Out Button */}
      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutButtonText}>Sign Out</Text>
      </TouchableOpacity>

      {/* Navigation Bar */}
      <NavigationBar navigation={navigation} activePage="ProfilePage" />
    </ImageBackground>
  );
};

export default SettingPage;
