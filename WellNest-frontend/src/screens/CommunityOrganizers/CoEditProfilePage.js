//HpEditProfilePage.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  ActivityIndicator, // Import ActivityIndicator for loading state
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { RadioButton } from "react-native-paper";
import styles from "../../components/styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../../../config/config";
import { Buffer } from "buffer"; // Import Buffer if you're using React Native
import { getUserIdFromToken } from "../../../services/authService";

const CoEditProfilePage = () => {
  const [profile_image, setProfile_image] = useState(null);
  const [username, setUsername] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [identification_card_number, setIdentification_card_number] =
    useState("");
  const [date_of_birth, setDate_of_birth] = useState(new Date());
  const [phone_number, setPhone_number] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [emergency_contact, setEmergency_contact] = useState("");
  const [organizerDetails, setOrganizerDetails] = useState("");
  const [education, setEducation] = useState("");
  const [credentials, setCredentials] = useState("");
  const [languages, setLanguages] = useState("");
  const [services, setServices] = useState("");
  const [business_hours, setBusiness_hours] = useState("");
  const [business_days, setBusiness_days] = useState("");
  const [hospital, setHospital] = useState("");
  const [experience, setExperience] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [userId, setUserId] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true); // Loading state

  // Get today's date
  const today = new Date();

  // Validate input fields
  const validateInputs = () => {
    if (phone_number.length < 10) {
      alert("Phone number must be at least 10 digits.");
      return false;
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return false;
    }

    if (emergency_contact.length < 10) {
      alert("Emergency contact number must be at least 10 digits.");
      return false;
    }

    return true;
  };

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
        // console.log("Image selected:", result.assets[0].uri);
        setProfile_image(result.assets[0].uri);
      } else {
        console.log("Image selection was cancelled.");
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate_of_birth(selectedDate);
    }
  };

  useEffect(() => {
    const fetchUserId = async () => {
      const userId = await getUserIdFromToken();
      console.log("userId:", userId);
      if (userId) {
        setUserId(userId);
        fetchProfile(userId);
      }
    };
    fetchUserId();
  }, []);

  //   useEffect(() => {
  const fetchProfile = async (userId) => {
    setLoading(true); // Start loading
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

      if (response.data) {
        // console.log("Fetched profile data:", response.data);

        const data = response.data;
        // Batch state updates
        setUsername(data.username || "");
        setAge(data.age ? data.age.toString() : "");
        setGender(data.gender || "");
        setIdentification_card_number(data.identity_card || "");
        // setDob(new Date(data.date_of_birth) || new Date());
        setDate_of_birth(
          data.date_of_birth ? new Date(data.date_of_birth) : today
        );
        setPhone_number(data.phone_no || "");
        setEmail(data.email || "");
        setAddress(data.address || "");
        setEmergency_contact(data.emergency_contact || "");
        setOrganizerDetails(data.organizer_details || "");

        // console.log("data", data);

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
    } finally {
      setLoading(false); // End loading
    }
  };

  // Debug log after setting the image URI
  // console.log("Profile image URI after selection:", profile_image);
  //     fetchProfile();
  //   }, [userId]);

  const handleUpdate = async () => {
    if (!validateInputs()) {
      return;
    }

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
      formData.append(
        "date_of_birth",
        date_of_birth.toISOString().split("T")[0]
      );
      // console.log("Identification Card:", identification_card_number);
      // formData.append("identity_card", identification_card_number.toString());
      formData.append("phone_number", phone_number.toString());
      formData.append("email", email);
      formData.append("address", address);
      formData.append("emergency_contact", emergency_contact.toString());
      formData.append("organizer_details", organizerDetails);

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
        <Text style={styles.title}>Edit Profile</Text>
      </View>
      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={
              profile_image
                ? { uri: profile_image }
                : require("../../../assets/defaultProfile.jpg")
            }
            style={styles.profileImage}
            onError={(error) =>
              console.log("Image loading error:", error.nativeEvent.error)
            }
          />

          <Text style={styles.changePictureText}>Change Picture</Text>
        </TouchableOpacity>
      </View>
      {loading ? ( // Show loading indicator
        <ActivityIndicator size="large" color="gray" />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollView}>
          {/* <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <Text>Change Picture</Text>
          )}
        </TouchableOpacity> */}

          <View style={styles.container}>
            <Text style={styles.question}>Username</Text>
            <View style={styles.underline} />
            <View style={styles.inputContainer}>
              {/* Input Fields */}
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
              <TextInput
                placeholder="Age"
                value={age}
                onChangeText={(text) => setAge(text)}
                style={styles.input}
                keyboardType="numeric"
              />
            </View>
          </View>
          {/* Gender Radio Button */}
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

          {/* Date of Birth Picker */}
          <Text style={styles.question}>Date of Birth</Text>
          <View style={styles.underline} />
          {/* <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={styles.datePickerButton}
        >
          <Text style={styles.datePickerText}>
            {dob ? dob.toDateString() : "Select Date"}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={dob}
            mode="date"
            display="default"
            maximumDate={new Date()}
            onChange={handleDateChange}
          />
        )} */}
          <View style={styles.leftDateInput}>
            <View style={styles.dateInputContent}>
              <Ionicons
                name="calendar-outline"
                size={20}
                color="#000"
                style={styles.iconStyle}
              />
              <DateTimePicker
                value={date_of_birth}
                mode="date"
                display="default"
                maximumDate={today}
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  setDate_of_birth(selectedDate || date_of_birth);
                }}
              />
            </View>
          </View>

          <View style={styles.container}>
            {/* Other fields */}
            <Text style={styles.question}>Identification Card Number</Text>
            <View style={styles.underline} />
            <View style={styles.inputContainer}>
              {/* Other Fields */}
              <TextInput
                placeholder="Identification Card Number"
                value={identification_card_number}
                // onChangeText={setIdentification_card_number}
                style={styles.input}
                editable={false} // Make it non-editable
              />
            </View>

            <Text style={styles.question}>Phone Number</Text>
            <View style={styles.underline} />
            <View style={styles.inputContainer}>
              {/* Other Fields */}
              <TextInput
                placeholder="Phone Number"
                value={phone_number}
                onChangeText={setPhone_number}
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
                value="Community Organizer"
                editable={false}
                style={styles.input}
              />

              {/* <TextInput value={role} editable={false} style={styles.input} /> */}
            </View>

            <Text style={styles.question}>Emergency Contact</Text>
            <View style={styles.underline} />
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Emergency Contact"
                value={emergency_contact}
                onChangeText={setEmergency_contact}
                style={styles.input}
              />
            </View>

            <Text style={styles.question}>Organizer Details</Text>
            <View style={styles.underline} />
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Organizer Details"
                value={organizerDetails}
                onChangeText={setOrganizerDetails}
                style={styles.input}
                multiline
              />
            </View>

            {/* Update and Cancel Buttons */}
            <TouchableOpacity onPress={handleUpdate} style={styles.button}>
              <Text style={styles.buttonText}>Save Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </ImageBackground>
  );
};

export default CoEditProfilePage;
