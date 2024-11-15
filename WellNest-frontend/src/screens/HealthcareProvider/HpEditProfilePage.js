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
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { RadioButton } from "react-native-paper";
import styles from "../../components/styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import API_BASE_URL from "../../../config/config";

const HpEditProfilePage = () => {
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
  const [summary, setSummary] = useState("");
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
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setProfile_image(result.uri);
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
      try {
        const token = await AsyncStorage.getItem("token");
        console.log("token:", token);
        if (!token) {
          alert("No token found. Please log in.");
          return;
        }

        const decodedToken = jwt_decode(token);
        const decodedUserId = decodedToken.id;
        // console.log("decodeuserid:", decodedUserId);
        if (decodedUserId) {
          setUserId(decodedUserId);
          fetchProfile(decodedUserId);
        } else {
          alert("Failed to retrieve user ID from token.");
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        Alert.alert("Error", "Failed to decode token");
      }
    };
    fetchUserId();
  }, [userId]);

  //   useEffect(() => {
  const fetchProfile = async (userId) => {
    console.log("fetchuserid", userId);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        alert("No token found. Please log in.");
        return;
      }
      console.log("Authorization token:", token); // Debugging log
      const response = await axios.get(`${API_BASE_URL}/hp-profile/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data) {
        console.log("Fetched profile data:", response.data);

        const data = response.data;
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
        setSummary(data.summary || "");
        setEducation(data.education || "");
        setCredentials(data.credentials || "");
        setLanguages(data.languages || "");
        setServices(data.services || "");
        setBusiness_hours(data.business_hours || "");
        setBusiness_days(data.business_days || "");
        setHospital(data.hospital || "");
        setExperience(data.experience || "");
        setSpecialist(data.specialist || "");
        setProfile_image(
          data.profile_image ? `${API_BASE_URL}${data.profile_image}` : null
        ); // Set image URL
        setUsername(data.username || "");
        setAge(data.age ? data.age.toString() : "");
      }
    } catch (error) {
      console.log("Error fetching profile:", error);
    }
  };

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
      console.log("Identification Card:", identification_card_number);
      formData.append("identity_card", identification_card_number.toString());
      formData.append("phone_number", phone_number.toString());
      formData.append("email", email);
      formData.append("address", address);
      formData.append("emergency_contact", emergency_contact.toString());
      formData.append("summary", summary);
      formData.append("education", education);
      formData.append("credentials", credentials);
      formData.append("languages", languages);
      formData.append("services", services);
      formData.append("business_hours", business_hours);
      formData.append("business_days", business_days);
      formData.append("experience", experience.toString());
      formData.append("specialist", specialist);
      formData.append("hospital", hospital);

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
      console.log("profile_image before if statement:", profile_image);
      if (profile_image) {
        const uri = profile_image;
        // const localUri = uri;
        const filename = uri.split("/").pop();
        const type = `image/${filename.split(".").pop()}`;

        console.log("Filename:", filename);
        // formData.append("profile_image", {
        //   uri,
        //   name: filename,
        //   type,
        // });
        const file = {
          // uri: localUri,
          uri: uri,
          name: filename,
          type: type,
        };
        formData.append("profile_image", file);
      }

      // Log the FormData entries here
      console.log("FormData Entries:", [...formData]);

      const response = await axios.put(
        `${API_BASE_URL}/hp-profile/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }

        // const response = await axios.put(
        //   `${API_BASE_URL}/hp-profile/${userId}`,
        //   {
        //     username,
        //     age: parseInt(age, 10),
        //     gender,
        //     identification_card_number: identification_card_number.toString(),
        //     date_of_birth: date_of_birth.toISOString().split("T")[0],
        //     phone_number: phone_number.toString(),
        //     email,
        //     address,
        //     emergency_contact: emergency_contact.toString(),
        //     summary,
        //     education,
        //     credentials,
        //     languages,
        //     services,
        //     business_hours,
        //     business_days,
        //     experience: experience.toString(),
        //     specialist,
        //     hospital,
        //   },
        //   {
        //     headers: {
        //       // "Content-Type": "application/json",
        //       Authorization: `Bearer ${token}`,
        //     },
        //   }
      );
      console.log("Profile update response:", response.data);
      if (response.status === 200) {
        alert("Profile updated successfully!");
        // alert("Profile updated successfully!");
        // Optionally, fetch the updated profile image and display it again
        // setProfileImage(response.data.profile_image); // Assuming the API returns the profile image URL
        setProfile_image(
          response.data.profile_image
            ? `${API_BASE_URL}${response.data.profile_image}`
            : null
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
          />
        </TouchableOpacity>
        <Text style={styles.changePictureText}>Change Picture</Text>
      </View>
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
              onChangeText={setIdentification_card_number}
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

          <Text style={styles.question}>Summary</Text>
          <View style={styles.underline} />
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Summary"
              value={summary}
              onChangeText={setSummary}
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

          <Text style={styles.question}>Credentials</Text>
          <View style={styles.underline} />
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="credentials"
              value={credentials}
              onChangeText={setCredentials}
              style={styles.input}
              multiline
            />
          </View>

          <Text style={styles.question}>Languages</Text>
          <View style={styles.underline} />
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Languages"
              value={languages}
              onChangeText={setLanguages}
              style={styles.input}
              multiline
            />
          </View>

          <Text style={styles.question}>Services</Text>
          <View style={styles.underline} />
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Services"
              value={services}
              onChangeText={setServices}
              style={styles.input}
              multiline
            />
          </View>

          <Text style={styles.question}>Business Hours</Text>
          <View style={styles.underline} />
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Bussiness hours"
              value={business_hours}
              onChangeText={setBusiness_hours}
              style={styles.input}
              multiline
            />
          </View>

          <Text style={styles.question}>Business Days</Text>
          <View style={styles.underline} />
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Business days"
              value={business_days}
              onChangeText={setBusiness_days}
              style={styles.input}
              multiline
            />
          </View>

          <Text style={styles.question}>Working Experience</Text>
          <View style={styles.underline} />
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Working experience"
              value={experience}
              onChangeText={setExperience}
              style={styles.input}
              multiline
            />
          </View>

          <Text style={styles.question}>Specialist</Text>
          <View style={styles.underline} />
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Specialist"
              value={specialist}
              onChangeText={setSpecialist}
              style={styles.input}
              multiline
            />
          </View>

          <Text style={styles.question}>Hospital</Text>
          <View style={styles.underline} />
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Hospital"
              value={hospital}
              onChangeText={setHospital}
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

export default HpEditProfilePage;
