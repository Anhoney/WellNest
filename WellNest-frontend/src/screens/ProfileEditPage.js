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

const ProfileEditPage = () => {
  const [profileImage, setProfileImage] = useState(null);
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

  // Get today's date
  const today = new Date();

  // Function to handle profile picture change
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setProfileImage(result.uri);
      uploadImage(result.uri);
    }
  };

  // Function to upload image to the server
  const uploadImage = async (uri) => {
    const formData = new FormData();
    formData.append("profileImage", {
      uri,
      name: "profile.jpg",
      type: "image/jpeg",
    });

    try {
      await axios.post("YOUR_API_ENDPOINT/profile/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error) {
      console.log("Image upload error:", error);
    }
  };

  // Function to handle profile update
  const handleUpdate = async () => {
    try {
      await axios.put("YOUR_API_ENDPOINT/profile/update", {
        username,
        age,
        gender,
        idCard,
        dob,
        phone,
        email,
        address,
        role,
        emergencyContact,
        coreQualifications,
        education,
      });
      alert("Profile updated successfully!");
    } catch (error) {
      console.log("Profile update error:", error);
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
              profileImage
                ? { uri: profileImage }
                : require("../../assets/defaultProfile.jpg")
            }
            style={styles.profileImage}
          />
        </TouchableOpacity>
        <Text style={styles.changePictureText}>Change Picture</Text>
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
              onChangeText={setAge}
              style={styles.input}
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
            <TextInput value={role} editable={false} style={styles.input} />
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

// const styles = StyleSheet.create({
//   container: { padding: 20, backgroundColor: "#F5F5F5" },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginVertical: 10,
//   },
//   imageContainer: { alignItems: "center", marginBottom: 20 },
//   profileImage: { width: 100, height: 100, borderRadius: 50 },
//   changePictureText: { color: "gray", marginTop: 5 },
//   fieldContainer: {
//     backgroundColor: "#fff",
//     padding: 10,
//     borderRadius: 10,
//     marginBottom: 10,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 5,
//     padding: 8,
//     marginBottom: 10,
//   },
//   dateInput: {
//     padding: 10,
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 5,
//     backgroundColor: "#f9f9f9",
//   },
//   radioContainer: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     marginBottom: 10,
//   },
//   updateButton: {
//     backgroundColor: "#F1A55C",
//     padding: 10,
//     borderRadius: 5,
//     alignItems: "center",
//   },
//   updateButtonText: { color: "#fff", fontWeight: "bold" },
//   cancelButton: {
//     backgroundColor: "#ccc",
//     padding: 10,
//     borderRadius: 5,
//     alignItems: "center",
//     marginTop: 10,
//   },
//   cancelButtonText: { color: "#333" },
// });

export default ProfileEditPage;
