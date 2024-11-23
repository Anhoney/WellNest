import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ImageBackground,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons"; // For icons
import DateTimePicker from "@react-native-community/datetimepicker";
import { Pressable } from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import NavigationBar from "../components/NavigationBar"; // Import here
import styles from "../components/styles"; // Import shared styles
import { RadioButton } from "react-native-paper"; // For the radio button
import API_BASE_URL from "../../config/config";
import { Buffer } from "buffer"; // Import Buffer if you're using React Native
import { getUserIdFromToken } from "../../services/authService";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProfileEditPage = () => {
  const [profile_image, setProfile_image] = useState(null);
  const [username, setUsername] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [idCard, setIdCard] = useState("");
  const [dob, setDob] = useState(new Date());
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("Elderly");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [coreQualifications, setCoreQualifications] = useState("");
  const [education, setEducation] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const navigation = useNavigation();
  const [userId, setUserId] = useState(null);

  // Get today's date
  const today = new Date();

  // Function to handle profile picture change
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setProfile_image(result.assets[0].uri);
        // uploadImage(result.uri);
      } else {
        console.log("Image selection was cancelled.");
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  useEffect(() => {
    const fetchUserId = async () => {
      const userId = await getUserIdFromToken();
      // console.log("userId:", userId);
      if (userId) {
        setUserId(userId);
        fetchProfile(userId);
      }
    };
    fetchUserId();
  }, []);

  const fetchProfile = async (userId) => {
    console.log("fetchuserid", userId);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        alert("No token found. Please log in.");
        return;
      }
      console.log("Authorization token:", token); // Debugging log
      const response = await axios.get(`${API_BASE_URL}/profile/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // console.log(response);
      // console.log("Fetched profile data:", response.data);
      if (response.data) {
        const data = response.data;
        // Batch state updates
        setUsername(data.username || "");
        setAge(data.age ? data.age.toString() : "");
        setGender(data.gender || "");
        setIdCard(data.identity_card || "");
        // setDob(new Date(data.date_of_birth) || new Date());
        setDob(data.date_of_birth ? new Date(data.date_of_birth) : today);
        setPhone(data.phone_no || "");
        setEmail(data.email || "");
        setAddress(data.address || "");
        setEmergencyContact(data.emergency_contact || "");
        setCoreQualifications(data.core_qualifications || "");
        setEducation(data.education || "");
        setRole(data.role || "");
        console.log("Role:", role);
        console.log("Email:", data.email);
        // console.log("data", data);
        // Role mapping: "1" for User, "2" for Community Organizer, "3" for Healthcare Provider
        // const roleMapping = {
        //   Elderly: 1,
        //   "Family / Caregiver / Volunteer": 4,
        //   "Community Organizer": 2,
        //   "Healthcare Provider": 3,
        // };
        // const roleValue = roleMapping[role];
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
      console.log("Error fetching profile:", error);
    }
  };
  const roleMapping = {
    1: "Elderly",
    4: "Family / Caregiver / Volunteer",
  };
  // Function to handle profile update
  const handleUpdate = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        alert("No token found. Please log in.");
        return;
      }

      console.log("handleupdateuserid", userId);
      const formData = new FormData();
      formData.append("username", username);
      formData.append("age", parseInt(age, 10));
      formData.append("gender", gender);
      formData.append("date_of_birth", dob.toISOString().split("T")[0]);
      // console.log("Identification Card:", identification_card_number);
      // formData.append("identity_card", identification_card_number.toString());
      formData.append("phone_number", phone.toString());
      formData.append("email", email);
      formData.append("address", address);
      formData.append("emergency_contact", emergencyContact.toString());
      formData.append("core_qualifications", coreQualifications);
      formData.append("education", education);

      // // Add profile image if selected
      // if (profileImage) {
      //   const uri = profileImage;
      //   const localUri = uri;
      //   const filename = localUri.split("/").pop();
      //   const type = `image/${filename.split(".").pop()}`;
      //   // const file = {
      //   //   uri: localUri,
      //   //   name: filename,
      //   //   type,
      //   // };
      //   // formData.append("profile_image", file);
      //   formData.append("profile_image", { uri, name: filename, type });
      // Add profile image as binary data (send as a file)
      const normalizeFilePath = (uri) => {
        if (uri.startsWith("file://")) {
          return uri.replace("file://", "");
        }
        return uri;
      };

      // console.log("profile_image before if statement:", profile_image);
      if (profile_image) {
        // const uri = profile_image;
        // const uri = profile_image.startsWith("file://")
        //   ? profile_image
        //   : `file://${profile_image}`; // Ensure correct URI format
        // const localUri = uri;
        const uri = normalizeFilePath(profile_image);
        const filename = uri.split("/").pop();
        const type = `image/${filename.split(".").pop()}`;

        const file = {
          uri: profile_image,
          name: filename,
          type: type,
        };
        // console.log("Appending image to FormData:", file);
        formData.append("profile_image", file);
      } else {
        console.log("No profile image to upload.");
      }

      const response = await axios.put(
        `${API_BASE_URL}/profile/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      //Handle response
      if (response.status === 200) {
        alert("Profile updated successfully!");

        console.log(
          "Server response data after profile update:",
          response.data
        );

        // Optionally, fetch the updated profile image and display it again
        // setProfileImage(response.data.profile_image); // Assuming the API returns the profile image URL
        setProfile_image(
          response.data.profile_image
            ? `${API_BASE_URL}${response.data.profile_image}`
            : profile_image
        ); // Set new image
      }
      // alert("Profile updated successfully!");
    } catch (error) {
      console.log("Profile update error:", error);
      console.log("Headers sent:", { Authorization: `Bearer ${token}` });
    }
  };

  const handleConfirm = (selectedDate) => {
    setShowDatePicker(false); // Hide the picker
    if (selectedDate) {
      setDob(selectedDate); // Update date of birth with the selected date
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
        <Text style={styles.title}>Edit Profile</Text>
      </View>

      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={
              profile_image
                ? { uri: profile_image }
                : require("../../assets/defaultProfile.jpg")
            }
            style={styles.profileImage}
            onError={(error) =>
              console.log("Image loading error:", error.nativeEvent.error)
            }
          />

          <Text style={styles.changePictureText}>Change Picture</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.container}>
          <Text style={styles.question}>Username</Text>
          <View style={styles.underline} />
          <View style={styles.inputContainer}>
            {/* <Ionicons
              name="person"
              size={24}
              color="#666"
              style={styles.icon}
            /> */}
            <TextInput
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              style={styles.input}
            />
          </View>

          <Text style={styles.question}>Age</Text>
          <View style={styles.underline} />
          <View style={styles.inputContainer}>
            {/* <Ionicons name="age" size={24} color="#666" style={styles.icon} /> */}
            <TextInput
              placeholder="Age"
              value={age}
              onChangeText={(text) => setAge(text)}
              style={styles.input}
              keyboardType="numeric"
            />
          </View>
        </View>
        {/* Gender Section */}
        <Text style={styles.question}>Gender</Text>
        <View style={styles.underline} />
        <RadioButton.Group onValueChange={setGender} value={gender}>
          <View style={styles.genderRadioButtonContainer}>
            <RadioButton.Item
              label="Male"
              value="Male"
              mode="android"
              position="leading"
              color={styles.radioButtonColor.color}
              labelStyle={styles.radioLabel}
            />
          </View>
          <View style={styles.genderRadioButtonContainer}>
            <RadioButton.Item
              label="Female"
              value="Female"
              mode="android"
              position="leading"
              color={styles.radioButtonColor.color}
              labelStyle={styles.radioLabel}
            />
          </View>
          <View style={styles.genderRadioButtonContainer}>
            <RadioButton.Item
              label="Other"
              value="Other"
              mode="android"
              position="leading"
              color={styles.radioButtonColor.color}
              labelStyle={styles.radioLabel}
            />
          </View>
        </RadioButton.Group>
        <View style={styles.container}>
          <Text style={styles.question}>Identification Card Number</Text>
          <View style={styles.underline} />
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Identification Card Number"
              value={idCard}
              onChangeText={setIdCard}
              style={styles.input}
            />
          </View>
        </View>
        {/* <View style={styles.container}> */}
        <Text style={styles.question}>Date Of Birth</Text>
        <View style={styles.underline} />
        {/* <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.dateInput}
          >
            <Text style={styles.dateText}>{dob.toDateString()}</Text>
          </TouchableOpacity>
          {showDatePicker && ( */}
        <View style={styles.leftDateInput}>
          <View style={styles.dateInputContent}>
            <Ionicons
              name="calendar-outline"
              size={20}
              color="#000"
              style={styles.iconStyle}
            />
            <DateTimePicker
              value={dob}
              mode="date"
              display="default"
              maximumDate={today}
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                setDob(selectedDate || dob);
              }}
            />
            {/* )} */}
          </View>
        </View>

        <View style={styles.container}>
          {/* Other fields */}
          <Text style={styles.question}>Phone Number</Text>
          <View style={styles.underline} />
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Phone Number"
              value={phone}
              onChangeText={setPhone}
              style={styles.input}
            />
          </View>

          <Text style={styles.question}>Email</Text>
          <View style={styles.underline} />
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
            />
          </View>

          <Text style={styles.question}>Address</Text>
          <View style={styles.underline} />
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Address"
              value={address}
              onChangeText={setAddress}
              style={styles.input}
              multiline
            />
          </View>

          <Text style={styles.question}>Role</Text>
          <View style={styles.underline} />
          <View style={styles.inputContainer}>
            <TextInput
              // value="Elderly"
              value={roleMapping[role] || ""}
              editable={false}
              style={styles.input}
            />

            {/* <TextInput value={role} editable={false} style={styles.input} /> */}
          </View>
          {/* Role Section */}
          {/* <View style={styles.underline} />
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
          </RadioButton.Group> */}

          {/* Dynamic Fields Based on Role */}
          {/* {role === "Healthcare Provider" && (
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
                onPress={() => handleFileSelection(setHealthcareLicenseFile)}
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
              <Text style={styles.uploadPrecautions}>
                Please upload related documents to verify your role identity.
              </Text>
            </View>
          )}

          {role === "Community Organizer" && (
            <View style={styles.container}>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={() => handleFileSelection(setCommunityOrganizerFile)}
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
          )} */}

          <Text style={styles.question}>Emergency Contact</Text>
          <View style={styles.underline} />
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Emergency Contact"
              value={emergencyContact}
              onChangeText={setEmergencyContact}
              style={styles.input}
            />
          </View>

          <Text style={styles.question}>Core Qualifications</Text>
          <View style={styles.underline} />
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Core Qualifications"
              value={coreQualifications}
              onChangeText={setCoreQualifications}
              style={styles.input}
              multiline
            />
          </View>

          <Text style={styles.question}>Education</Text>
          <View style={styles.underline} />
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Education"
              value={education}
              onChangeText={setEducation}
              style={styles.input}
              multiline
            />
          </View>

          {/* Update and Cancel Buttons */}
          <TouchableOpacity onPress={handleUpdate} style={styles.button}>
            <Text style={styles.buttonText}>Update</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.cancelButton}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default ProfileEditPage;
