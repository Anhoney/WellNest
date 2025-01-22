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
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons"; // For icons
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import NavigationBar from "../../components/NavigationBar"; // Import here
import styles from "../../components/styles"; // Import shared styles
import API_BASE_URL from "../../../config/config";
import { AuthContext } from "../../../context/AuthProvider";
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

  // Function to pick an image from the gallery
  // const pickImage = async () => {
  //   let result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //     allowsEditing: true,
  //     aspect: [1, 1],
  //     quality: 1,
  //   });

  //   if (!result.cancelled) {
  //     setProfileImage(result.uri);
  //   }
  // };

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

  // useEffect(() => {
  //   fetchUserId();
  // }, []);

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
        {/* Health Booking Status */}
        {/* <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>My Health Booking Status</Text>
          <View style={styles.statusOptions}>
            <TouchableOpacity style={styles.statusCard}>
              <Image
                source={require("../../../assets/VirtualConsultation.png")}
                style={styles.statusIcon}
              />
              <Text style={styles.statusText}>Virtual Consultation</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statusCard}>
              <Image
                source={require("../../../assets/AppointmentBooking.png")}
                style={styles.statusIcon}
              />
              <Text style={styles.statusText}>Appointment Booking</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statusCard}>
              <Image
                source={require("../../../assets/RatingStar.png")}
                style={styles.statusIcon}
              />
              <Text style={styles.statusText}>Rating</Text>
            </TouchableOpacity>
          </View>
        </View> */}

        {/* Other Options */}
        {/* <View style={styles.otherOptions}> */}
        {/* <Text style={styles.sectionTitle}>Care and Planning</Text> */}
        {/* <View style={styles.statusOptions}> */}
        {/* <TouchableOpacity style={styles.optionCard}>
             <Image
              source={require("../../../assets/Favourite.png")}
              style={styles.optionIcon}
            />
            <Text style={styles.statusText}>Favourite</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => {
              navigation.navigate("MedicalReport");
            }}
          >
            <Image
              source={require("../../../assets/MedicalHistory.png")}
              style={styles.optionIcon}
            />
            <Text style={styles.statusText}>Medical History</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => {
              navigation.navigate("CaregiverCollabScreen");
            }}
          >
            <Image
              source={require("../../../assets/PrescriptionBottle.png")}
              style={styles.optionIcon}
            />
            <Text style={styles.statusText}>Prescription History</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionCard}>
            <Image
              source={require("../../../assets/ElderlyAssessment.png")}
              style={styles.optionIcon}
            />
            <Text style={styles.statusText}>Elderly Assessment</Text>
          </TouchableOpacity> */}

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
        {/* <TouchableOpacity
              style={styles.optionCard}
              onPress={() => {
                navigation.navigate("CaregiverInformation");
              }}
            >
              <Image
                source={require("../../../assets/CaregiverInformation.png")}
                style={styles.optionIcon}
              />
              <Text style={styles.statusText}>Caregiver Information</Text>
            </TouchableOpacity> */}
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
