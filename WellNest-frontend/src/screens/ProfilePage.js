import React, { useState } from "react";
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
import { useNavigation } from "@react-navigation/native";
import NavigationBar from "../components/NavigationBar"; // Import here
import styles from "../components/styles"; // Import shared styles

const ProfilePage = () => {
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
        <Text style={styles.title}>Profile</Text>
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
        <TouchableOpacity
          style={styles.editProfileButton}
          onPress={() => navigation.navigate("ProfileEditPage")}
        >
          <Text style={styles.editProfileText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.pageContainer}>
        {/* Health Booking Status */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>My Health Booking Status</Text>
          <View style={styles.statusOptions}>
            <TouchableOpacity style={styles.statusCard}>
              <Image
                source={require("../../assets/VirtualConsultation.png")}
                style={styles.statusIcon}
              />
              <Text style={styles.statusText}>Virtual Consultation</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statusCard}>
              <Image
                source={require("../../assets/AppointmentBooking.png")}
                style={styles.statusIcon}
              />
              <Text style={styles.statusText}>Appointment Booking</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statusCard}>
              <Image
                source={require("../../assets/RatingStar.png")}
                style={styles.statusIcon}
              />
              <Text style={styles.statusText}>Rating</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Other Options */}
        <View style={styles.otherOptions}>
          <TouchableOpacity style={styles.optionCard}>
            <Image
              source={require("../../assets/Favourite.png")}
              style={styles.optionIcon}
            />
            <Text style={styles.statusText}>Favourite</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionCard}>
            <Image
              source={require("../../assets/MedicalHistory.png")}
              style={styles.optionIcon}
            />
            <Text style={styles.statusText}>Medical History</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionCard}>
            <Image
              source={require("../../assets/PrescriptionBottle.png")}
              style={styles.optionIcon}
            />
            <Text style={styles.statusText}>Prescription History</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionCard}>
            <Image
              source={require("../../assets/ElderlyAssessment.png")}
              style={styles.optionIcon}
            />
            <Text style={styles.statusText}>Elderly Assessment</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionCard}>
            <Image
              source={require("../../assets/CarePlanDevelopment.png")}
              style={styles.optionIcon}
            />
            <Text style={styles.statusText}>Care Plan</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionCard}>
            <Image
              source={require("../../assets/CaregiverInformation.png")}
              style={styles.optionIcon}
            />
            <Text style={styles.statusText}>Caregiver Information</Text>
          </TouchableOpacity>
        </View>
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

// const styles = StyleSheet.create({
//   // Add the styles here
//   background: {
//     flex: 1,
//     backgroundColor: '#f2f2f2',
//   },
//   smallHeaderContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 15,
//   },
//   backButton: {
//     marginRight: 10,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   profileContainer: {
//     alignItems: 'center',
//     paddingVertical: 20,
//   },
//   profileImage: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     borderWidth: 2,
//     borderColor: '#fff',
//   },
//   userName: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     marginTop: 10,
//   },
//   editProfileButton: {
//     backgroundColor: '#333',
//     paddingHorizontal: 15,
//     paddingVertical: 5,
//     borderRadius: 5,
//     marginTop: 10,
//   },
//   editProfileText: {
//     color: '#fff',
//     fontSize: 14,
//   },
//   contentContainer: {
//     paddingHorizontal: 15,
//   },
//   healthBookingStatus: {
//     marginBottom: 20,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   statusOptions: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   statusCard: {
//     alignItems: 'center',
//     width: '30%',
//   },
//   statusIcon: {
//     width: 50,
//     height: 50,
//     marginBottom: 5,
//   },
//   statusText: {
//     textAlign: 'center',
//     fontSize: 12,
//   },
//   otherOptions: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//   },
//   optionCard: {
//     alignItems: 'center',
//     width: '30%',
//     marginBottom: 20,
//   },
//   optionIcon: {
//     width: 50,
//     height: 50,
//     marginBottom: 5,
//   },
//   optionText: {
//     textAlign: 'center',
//     fontSize: 12,
//   },
//   accountSettings: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 15,
//     paddingVertical: 20,
//     backgroundColor: '#fff',
//     borderTopWidth: 1,
//     borderTopColor: '#ccc',
//   },
//   accountSettingsText: {
//     fontSize: 16,
//   },
// });

export default ProfilePage;
