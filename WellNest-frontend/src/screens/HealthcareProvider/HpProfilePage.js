import React, { useContext, useState } from "react";
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
import { useNavigation } from "@react-navigation/native";
import HpNavigationBar from "../../components/HpNavigationBar"; // Import here
import styles from "../../components/styles"; // Import shared styles
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../../../config/config";
import { AuthContext } from "../../../context/AuthProvider";

const HpProfilePage = () => {
  const { logout } = useContext(AuthContext); // Get logout from AuthContext
  const [profileImage, setProfileImage] = useState(null);
  const navigation = useNavigation();

  // Function to pick an image from the gallery
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setProfileImage(result.uri);
    }
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
              await logout(navigation); // Log out function from AuthContext
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
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={
              profileImage
                ? { uri: profileImage }
                : require("../../../assets/defaultProfile.jpg")
            }
            style={styles.profileImage}
          />
        </TouchableOpacity>
        <Text style={styles.userName}>John Doe</Text>
        <Text style={styles.profileId}>ID: 78906</Text>
        <TouchableOpacity
          style={styles.editProfileButton}
          onPress={() => navigation.navigate("HpEditProfilePage")}
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
            <TouchableOpacity style={styles.optionContainer}>
              <Text style={styles.optionText}>Change Password</Text>
              <Ionicons name="chevron-forward" size={20} color="#333" />
            </TouchableOpacity>

            {/* Delete Account */}
            <TouchableOpacity style={styles.optionContainer}>
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
      <HpNavigationBar navigation={navigation} activePage="HpProfilePage" />
    </ImageBackground>
  );
};

export default HpProfilePage;
