// VirtualDoctorProfileScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Import icons from Expo
import axios from "axios";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import styles from "../../components/styles";
import NavigationBar from "../../components/NavigationBar"; // Import your custom navigation bar component
import { useRoute } from "@react-navigation/native";
import API_BASE_URL from "../../../config/config";
import { FontAwesome } from "@expo/vector-icons"; // Import FontAwesome for the heart icon
import { getUserIdFromToken } from "../../../services/authService";

const VirtualDoctorProfileScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { doctorId } = route.params;
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/virtual/doctor/${doctorId}`
        );
        setDoctor(response.data);

        // Parse the services_provide JSON string
        let parsedServices = [];
        try {
          parsedServices = JSON.parse(response.data.services_provide) || [];
        } catch (error) {
          console.error("Error parsing services_provide:", error);
          parsedServices = [];
        }

        setServices(parsedServices);
        // Auto-select the first service if available
        if (parsedServices.length > 0) {
          setSelectedService(parsedServices[0]); // Set the first service as default
        }
      } catch (error) {
        console.error("Error fetching doctor profile:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchDoctorProfile();
  }, [doctorId]);

  // Show loading indicator while fetching data
  if (loading) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  if (!doctor) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  const imageUri = doctor.profile_image
    ? `data:image/png;base64,${doctor.profile_image}`
    : "https://via.placeholder.com/150";

  const getBusinessDays = (businessDays) => {
    switch (businessDays) {
      case "Every Weekday":
        return "Mon-Fri";
      case "Every Weekend":
        return "Sat-Sun";
      case "Everyday":
        return "Mon-Sun";
      default:
        return "";
    }
  };

  // Function to format service names
  const formatServiceName = (serviceName) => {
    return serviceName.replace(/([A-Z])/g, " $1").trim();
  };

  return (
    <ImageBackground
      source={require("../../../assets/DoctorDetails.png")}
      style={[styles.background, { flex: 1 }]}
    >
      {/* Title Section with Back chevron-back */}
      <View style={styles.smallHeaderContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}> {doctor.category} </Text>
      </View>

      {/* Static Doctor Info */}
      <View style={styles.uAContainer}>
        <View style={styles.transDoctorCard}>
          <Image source={{ uri: imageUri }} style={styles.doctorImage} />
          <View style={styles.doctorInfo}>
            <Text style={styles.doctorName}>{doctor.username}</Text>
            <Text style={styles.doctorCategory}>{doctor.category}</Text>
            <Text style={styles.serviceText}>Services Provided :</Text>
            {/* Render the services and their prices */}
            {services.length > 0 ? (
              services.map((service, index) => (
                <Text key={index} style={styles.sText}>
                  {formatServiceName(service.service)}: RM {service.price}
                </Text>
              ))
            ) : (
              <Text style={styles.doctorCategory}>No services available</Text>
            )}
            <Text style={styles.doctorRating}>⭐ {doctor.rating || "N/A"}</Text>
          </View>
        </View>
      </View>
      <View style={styles.uAContainer}>
        <View style={styles.infoContainer}>
          <FontAwesome
            name="briefcase"
            size={16}
            color="#e67e22"
            style={{ marginRight: 5 }}
          />
          <Text style={styles.infoText}>
            {doctor.experience || "N/A"} years experience
          </Text>
          <FontAwesome
            name="clock-o"
            size={16}
            color="#e67e22"
            style={{ marginRight: 5 }}
          />
          <Text style={styles.infoText}>
            {getBusinessDays(doctor.business_days) || "N/A"} /{"\n"}
            {doctor.business_hours || "N/A"}
          </Text>
        </View>
      </View>
      <View style={styles.uAcontainer}>
        <View style={styles.whiteUAcontainer}>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <Text style={styles.aSectionTitle}>Summary</Text>
            <View style={styles.displayUnderline} />
            <Text style={styles.sectionContent}>{doctor.summary}</Text>

            <Text style={styles.aSectionTitle}>Education</Text>
            <View style={styles.displayUnderline} />
            <Text style={styles.sectionContent}>{doctor.education}</Text>

            <Text style={styles.aSectionTitle}>Credentials</Text>
            <View style={styles.displayUnderline} />
            <Text style={styles.boldSectionContent}>Qualifications:</Text>
            <Text style={styles.sectionContent}>{doctor.credentials}</Text>
            <Text style={styles.boldSectionContent}>
              Malaysian Medical Council (MMC) Registration Number:
            </Text>
            <Text style={styles.sectionContent}>
              {doctor.healthcare_license}
            </Text>

            <Text style={styles.aSectionTitle}>Languages</Text>
            <View style={styles.displayUnderline} />
            <Text style={styles.sectionContent}>{doctor.languages}</Text>

            <Text style={styles.aSectionTitle}>Services</Text>
            <View style={styles.displayUnderline} />
            <Text style={styles.sectionContent}>{doctor.services}</Text>

            <Text style={styles.aSectionTitle}>Business Hours</Text>
            <View style={styles.displayUnderline} />
            <Text style={styles.sectionContent}>{doctor.business_hours}</Text>

            <Text style={styles.aSectionTitle}>Email</Text>
            <View style={styles.displayUnderline} />
            <Text style={styles.sectionContent}>{doctor.email}</Text>
          </ScrollView>
        </View>
      </View>
      <NavigationBar navigation={navigation} activePage="" />
    </ImageBackground>
  );
};

export default VirtualDoctorProfileScreen;
