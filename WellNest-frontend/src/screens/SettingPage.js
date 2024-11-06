// import React from "react";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Ionicons from "react-native-vector-icons/Ionicons";
import styles from "../components/styles"; // Import shared styles
import NavigationBar from "../components/NavigationBar"; // Import here
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SettingPage = () => {
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

  // Sign Out Function
  const handleSignOut = async () => {
    try {
      // Remove token from AsyncStorage
      await AsyncStorage.removeItem("authToken");
      // Navigate back to the login page
      navigation.reset({
        index: 0,
        routes: [{ name: "LoginPage" }],
      });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/MainPage.png")}
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
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={
              profileImage
                ? { uri: profileImage }
                : require("../../assets/defaultProfile.jpg")
            }
            style={styles.profileImage}
          />
        </TouchableOpacity>
        <Text style={styles.userName}>John Doe</Text>
        <Text style={styles.profileId}>ID: 78906</Text>
      </View>

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
