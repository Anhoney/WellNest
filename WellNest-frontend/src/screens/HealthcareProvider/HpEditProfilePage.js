// // HpEditProfilePage.js
// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Image,
//   ScrollView,
//   ImageBackground,
// } from "react-native";
// import * as ImagePicker from "expo-image-picker";
// import { Ionicons } from "@expo/vector-icons"; // For icons
// import axios from "axios";
// import styles from "../../components/styles"; // Your style file

// const HpEditProfilePage = ({ navigation, userId }) => {
//   const [profileData, setProfileData] = useState({
//     username: "",
//     age: "",
//     gender: "",
//     identificationCardNumber: "",
//     dateOfBirth: "",
//     phoneNumber: "",
//     email: "",
//     address: "",
//     emergencyContact: "",
//     summary: "",
//     education: "",
//     credentials: "",
//     languages: "",
//     services: "",
//     businessHours: "",
//     businessDays: "",
//     experience: "",
//     specialist: "",
//     hospital: "",
//   });
//   const [profileImage, setProfileImage] = useState(null);

//   useEffect(() => {
//     // Fetch existing profile data
//     axios
//       .get(`http://localhost:5000/api/hp-profile/${userId}`)
//       .then((response) => setProfileData(response.data))
//       .catch((error) => console.error(error));
//   }, []);

//   const handleInputChange = (field, value) => {
//     setProfileData({ ...profileData, [field]: value });
//   };

//   const pickImage = async () => {
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [1, 1],
//       quality: 1,
//     });

//     if (!result.cancelled) {
//       setProfileImage(result.uri);
//     }
//   };

//   const saveProfile = async () => {
//     try {
//       const formData = new FormData();
//       if (profileImage) {
//         const fileName = profileImage.split("/").pop();
//         const fileType = profileImage.substring(
//           profileImage.lastIndexOf(".") + 1
//         );
//         formData.append("profileImage", {
//           uri: profileImage,
//           name: fileName,
//           type: `image/${fileType}`,
//         });
//       }

//       formData.append("profileData", JSON.stringify(profileData));

//       await axios.put(
//         `http://localhost:5000/api/hp-profile/${userId}`,
//         formData,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//         }
//       );

//       alert("Profile updated successfully");
//     } catch (error) {
//       console.error("Failed to save profile:", error);
//     }
//   };

//   return (
//     <ImageBackground
//       source={require("../../../assets/MainPage.png")}
//       style={styles.background}
//     >
//       <View style={styles.smallHeaderContainer}>
//         <TouchableOpacity
//           onPress={() => navigation.goBack()}
//           style={styles.backButton}
//         >
//           <Ionicons name="chevron-back" size={24} color="#000" />
//         </TouchableOpacity>
//         <Text style={styles.title}>Edit Profile</Text>
//       </View>
//       <ScrollView contentContainerStyle={styles.contentContainer}>
//         <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
//           {profileImage ? (
//             <Image source={{ uri: profileImage }} style={styles.profileImage} />
//           ) : (
//             <Text>Change Picture</Text>
//           )}
//         </TouchableOpacity>

//         {/* Render input fields */}
//         {Object.keys(profileData).map((key) => (
//           <TextInput
//             key={key}
//             placeholder={key.replace(/([A-Z])/g, " $1").toUpperCase()}
//             style={styles.input}
//             value={profileData[key]}
//             onChangeText={(text) => handleInputChange(key, text)}
//           />
//         ))}

//         <TouchableOpacity onPress={saveProfile} style={styles.saveButton}>
//           <Text style={styles.saveButtonText}>Save Profile</Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </ImageBackground>
//   );
// };

// export default HpEditProfilePage;

//second version
// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   Image,
//   TouchableOpacity,
//   ScrollView,
//   ImageBackground,
// } from "react-native";
// import * as ImagePicker from "expo-image-picker";
// import { Ionicons } from "@expo/vector-icons";
// import axios from "axios";
// import styles from "../../components/styles"; // Adjusted import path for shared styles

// const HpEditProfilePage = ({ navigation, userId }) => {
//   const [profileData, setProfileData] = useState({
//     username: "",
//     age: "",
//     gender: "",
//     identificationCardNumber: "",
//     dateOfBirth: "",
//     phoneNumber: "",
//     email: "",
//     address: "",
//     emergencyContact: "",
//     summary: "",
//     education: "",
//     credentials: "",
//     languages: "",
//     services: "",
//     businessHours: "",
//     businessDays: "",
//     experience: "",
//     specialist: "",
//     hospital: "",
//   });
//   const [profileImage, setProfileImage] = useState(null);

//   useEffect(() => {
//     axios
//       .get(`http://localhost:5000/api/hp-profile/${userId}`)
//       .then((response) => setProfileData(response.data))
//       .catch((error) => console.error(error));
//   }, [userId]);

//   const handleInputChange = (field, value) => {
//     setProfileData({ ...profileData, [field]: value });
//   };

//   const pickImage = async () => {
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [1, 1],
//       quality: 1,
//     });

//     if (!result.cancelled) {
//       setProfileImage(result.uri);
//     }
//   };

//   const saveProfile = async () => {
//     try {
//       const formData = new FormData();
//       if (profileImage) {
//         const fileName = profileImage.split("/").pop();
//         const fileType = profileImage.substring(
//           profileImage.lastIndexOf(".") + 1
//         );
//         formData.append("profileImage", {
//           uri: profileImage,
//           name: fileName,
//           type: `image/${fileType}`,
//         });
//       }
//       formData.append("profileData", JSON.stringify(profileData));

//       await axios.put(
//         `http://localhost:5000/api/hp-profile/${userId}`,
//         formData,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//         }
//       );

//       alert("Profile updated successfully");
//     } catch (error) {
//       console.error("Failed to save profile:", error);
//     }
//   };

//   return (
//     <ImageBackground
//       source={require("../../../assets/MainPage.png")}
//       style={styles.background}
//     >
//       <View style={styles.smallHeaderContainer}>
//         <TouchableOpacity
//           onPress={() => navigation.goBack()}
//           style={styles.backButton}
//         >
//           <Ionicons name="chevron-back" size={24} color="#000" />
//         </TouchableOpacity>
//         <Text style={styles.title}>Edit Profile</Text>
//       </View>

//       <View style={styles.profileContainer}>
//         <TouchableOpacity onPress={pickImage}>
//           <Image
//             source={
//               profileImage
//                 ? { uri: profileImage }
//                 : require("../../../assets/defaultProfile.jpg")
//             }
//             style={styles.profileImage}
//           />
//         </TouchableOpacity>
//         <Text style={styles.changePictureText}>Change Picture</Text>
//       </View>

//       <ScrollView contentContainerStyle={styles.scrollView}>
//         {Object.keys(profileData).map((key) => (
//           <View style={styles.fieldContainer} key={key}>
//             <Text style={styles.fieldLabel}>
//               {key.replace(/([A-Z])/g, " $1").toUpperCase()}
//             </Text>
//             <TextInput
//               style={styles.input}
//               placeholder={key.replace(/([A-Z])/g, " $1")}
//               value={profileData[key]}
//               onChangeText={(text) => handleInputChange(key, text)}
//             />
//           </View>
//         ))}

//         <TouchableOpacity onPress={saveProfile} style={styles.updateButton}>
//           <Text style={styles.updateButtonText}>Save Profile</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           onPress={() => navigation.goBack()}
//           style={styles.cancelButton}
//         >
//           <Text style={styles.cancelButtonText}>Cancel</Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </ImageBackground>
//   );
// };

// export default HpEditProfilePage;

//Third version
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { RadioButton } from "react-native-paper";
import styles from "../../components/styles";

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
  const [emergencyContact, setEmergencyContact] = useState("");
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
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDob(selectedDate);
    }
  };

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
        emergencyContact,
        education,
      });
      alert("Profile updated successfully!");
    } catch (error) {
      console.log("Profile update error:", error);
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

      <ScrollView contentContainerStyle={styles.scrollView}>
        {/* <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <Text>Change Picture</Text>
          )}
        </TouchableOpacity> */}
        <View style={styles.profileContainer}>
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
          <Text style={styles.changePictureText}>Change Picture</Text>
        </View>
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
              onChangeText={setAge}
              style={styles.input}
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
              value={dob}
              mode="date"
              display="default"
              maximumDate={today}
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                setDob(selectedDate || dob);
              }}
            />
          </View>
        </View>

        <View style={styles.container}>
          {/* Other fields */}
          <Text style={styles.question}>Phone Number</Text>
          <View style={styles.underline} />
          <View style={styles.inputContainer}>
            {/* Other Fields */}
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
    </ImageBackground>
  );
};

export default ProfileEditPage;
