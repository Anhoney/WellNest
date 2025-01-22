//CaregiverInformation.js
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Import icons from Expo
import axios from "axios";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import styles from "../../components/styles";
import NavigationBar from "../../components/NavigationBar"; // Import your custom navigation bar component
import { useRoute } from "@react-navigation/native";
import API_BASE_URL from "../../../config/config";
import { Buffer } from "buffer";
import { FontAwesome } from "@expo/vector-icons"; // Import FontAwesome for the heart icon
import { getUserIdFromToken } from "../../../services/authService";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CaregiverInformation = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { caregiverId } = route.params;
  const [caregiver, setCaregiver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile_image, setProfile_image] = useState(null);
  const [title, setTitle] = useState("Caregiver Information");

  console.log("CaregiverProfileScreen Caregiver ID:", caregiverId);

  useEffect(() => {
    fetchCaregiverProfile();
  }, [caregiverId]);

  const fetchCaregiverProfile = async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }
    try {
      console.log("frontend caregiver Id:", caregiverId);
      const response = await axios.get(
        `${API_BASE_URL}/get/caregiver/details/${caregiverId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCaregiver(response.data);

      // Set the title based on the role
      switch (response.data.role) {
        case "1":
          setTitle("Cherish Information");
          break;
        case "2":
        case "3":
        case "4":
          setTitle("Care Buddy Information");
          break;
        default:
          setTitle("Caregiver Information");
          break;
      }

      if (response.data.profile_image) {
        const data = response.data;

        // setProfileImage(data.profile_image || null); // Set base64 profile image or null
        // Check if profile_image is a Buffer
        if (data.profile_image && data.profile_image.type === "Buffer") {
          const byteArray = data.profile_image.data; // Access the data property of the Buffer

          // Use Buffer to convert to Base64
          const base64String = Buffer.from(byteArray).toString("base64");
          const imageUri = `data:image/jpeg;base64,${base64String}`;
          console.log("Profile Image URI:", imageUri);
          setProfile_image(imageUri);
        } else {
          console.log("No valid profile image found.");
          setProfile_image(null);
        }
      }
    } catch (error) {
      console.error("Error fetching caregiver profile:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  // Show loading indicator while fetching data
  if (loading) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  if (!caregiver) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  //   const imageUri = caregiver.profile_image
  //     ? `data:image/png;base64,${caregiver.profile_image}`
  //     : "https://via.placeholder.com/150";

  return (
    <ImageBackground
      source={require("../../../assets/PlainGrey.png")}
      style={[styles.background]}
    >
      {/* Title Section with Back chevron-back */}
      <View style={styles.smallHeaderContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}> {title} </Text>
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
      </View>

      <View style={styles.uAcontainer}>
        <View style={styles.whiteUAcontainer}>
          <ScrollView
            // style={styles.container}
            contentContainerStyle={
              styles.scrollViewContent
              // alignItems: "center",
              // justifyContent: "flex-start",
            } // Move layout styles here
          >
            <Text style={styles.aSectionTitle}>ID</Text>
            <View style={styles.displayUnderline} />
            <Text style={styles.sectionContent}>{caregiver.user_id}</Text>

            <Text style={styles.aSectionTitle}>Name</Text>
            <View style={styles.displayUnderline} />
            <Text style={styles.sectionContent}>
              {caregiver.username || caregiver.full_name}
            </Text>

            <Text style={styles.aSectionTitle}>Phone No</Text>
            <View style={styles.displayUnderline} />
            <Text style={styles.sectionContent}>{caregiver.phone_no}</Text>

            <Text style={styles.aSectionTitle}>Home Address</Text>
            <View style={styles.displayUnderline} />
            <Text style={styles.sectionContent}>
              {caregiver.address || "N/A"}
            </Text>

            {/* <Text style={styles.aSectionTitle}>Core Qualifications</Text>
            <View style={styles.displayUnderline} />
            <Text style={styles.sectionContent}>
              {caregiver.core_qualifications}
            </Text> */}
            {caregiver.core_qualifications && (
              <>
                <Text style={styles.aSectionTitle}>Core Qualifications</Text>
                <View style={styles.displayUnderline} />
                <Text style={styles.sectionContent}>
                  {caregiver.core_qualifications}
                </Text>
              </>
            )}
            {caregiver.education && (
              <>
                <Text style={styles.aSectionTitle}>Education</Text>
                <View style={styles.displayUnderline} />
                <Text style={styles.sectionContent}>{caregiver.education}</Text>
              </>
            )}

            {caregiver.email && (
              <>
                <Text style={styles.aSectionTitle}>Email</Text>
                <View style={styles.displayUnderline} />
                <Text style={styles.sectionContent}>{caregiver.email}</Text>
              </>
            )}

            {/* <Text style={styles.aSectionTitle}>Education</Text>
            <View style={styles.displayUnderline} />
            <Text style={styles.sectionContent}>{caregiver.education}</Text>

            <Text style={styles.aSectionTitle}>Email</Text>
            <View style={styles.displayUnderline} />
            <Text style={styles.sectionContent}>{caregiver.email}</Text> */}
          </ScrollView>
        </View>
      </View>
      <NavigationBar navigation={navigation} activePage="" />
    </ImageBackground>
  );
};

export default CaregiverInformation;
