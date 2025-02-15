// ProfilePage.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ImageBackground,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // For icons
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import NavigationBar from "../../components/NavigationBar"; // Import here
import styles from "../../components/styles"; // Import shared styles
import API_BASE_URL from "../../../config/config";
import axios from "axios";
import { Buffer } from "buffer";
import { getUserIdFromToken } from "../../../services/authService";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProfilePage = () => {
  const [profile_image, setProfile_image] = useState(null);
  const navigation = useNavigation();
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState("");

  const fetchUserId = async () => {
    const userId = await getUserIdFromToken();
    setUserId(userId);
    fetchProfileData(userId);
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
        <TouchableOpacity
          style={styles.editProfileButton}
          onPress={() => navigation.navigate("ProfileEditPage")}
        >
          <Text style={styles.editProfileText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[{ marginLeft: -30 }, styles.pageContainer]}
      >
        <TouchableOpacity
          style={[{ marginLeft: 80 }, styles.optionCard]}
          onPress={() => {
            navigation.navigate("CarePlanScreen", {
              userId: userId,
            });
          }}
        >
          <Image
            source={require("../../../assets/CarePlanDevelopment.png")}
            style={styles.optionIcon}
          />
          <Text style={styles.statusText}>Care Plan</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Account Settings */}
      <TouchableOpacity
        style={styles.accountSettings}
        onPress={() => navigation.navigate("SettingPage")}
      >
        <Text style={styles.accountSettingsText}>Account Settings</Text>
        <Ionicons name="chevron-forward" size={20} color="#000" />
      </TouchableOpacity>
      {/* Navigation Bar */}
      <NavigationBar navigation={navigation} activePage="ProfilePage" />
    </ImageBackground>
  );
};

export default ProfilePage;
