// HistoryAppDetails.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
} from "react-native";
import API_BASE_URL from "../../../config/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../../components/styles"; // Import your custom styles
import { Ionicons } from "@expo/vector-icons";
import NavigationBar from "../../components/NavigationBar";
import { getUserIdFromToken } from "../../../services/authService";

const HistoryAppDetails = ({ route, navigation }) => {
  const { appointmentId } = route.params; // Get appointmentId from route params
  const [appointmentDetails, setAppointmentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const userId = await getUserIdFromToken();
      if (userId) {
        setUserId(userId);
      }
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        alert("No token found. Please log in.");
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/getAppointmentDetails/${appointmentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const result = await response.json();
        if (response.ok) {
          setAppointmentDetails(result);

          // Parse services_provide only for virtual appointments
          if (appointmentId.startsWith("virtual_")) {
            let parsedServices = [];
            try {
              parsedServices = JSON.parse(result.services_provide) || [];
            } catch (error) {
              console.error("Error parsing services_provide:", error);
              parsedServices = [];
            }

            setServices(parsedServices);
          }
        } else {
          alert(result.error || "Failed to fetch appointment details.");
        }
      } catch (error) {
        console.error("Error fetching appointment details:", error);
        alert("An error occurred while fetching appointment details.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointmentDetails();
  }, [appointmentId]);

  // Function to format the date and time
  const formatDateTime = (dateString, timeString) => {
    const date = new Date(dateString);
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    const formattedDate = date.toLocaleDateString("en-GB", options); // Format as DD-MM-YYYY

    const timeParts = timeString.split(":");
    let hours = parseInt(timeParts[0], 10);
    const minutes = timeParts[1];
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    const formattedTime = `${hours}:${minutes} ${ampm}`;

    return { formattedDate, formattedTime };
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (!appointmentDetails) {
    return <Text>No appointment details found.</Text>;
  }

  const imageUri = appointmentDetails.profile_image
    ? `data:image/png;base64,${appointmentDetails.profile_image}`
    : "https://via.placeholder.com/150";

  // Format the date and time for display
  const { formattedDate, formattedTime } = formatDateTime(
    appointmentDetails.appointment_date,
    appointmentDetails.appointment_time
  );

  // Function to format service names
  const formatServiceName = (serviceName) => {
    return serviceName.replace(/([A-Z])/g, " $1").trim();
  };

  // Determine if the appointment is virtual or physical
  const isVirtual = appointmentId.startsWith("virtual_");
  const isPhysical = appointmentId.startsWith("physical_");

  return (
    <ImageBackground
      source={require("../../../assets/DoctorDetails.png")}
      style={[styles.background, { flex: 1 }]}
    >
      <View style={styles.smallHeaderContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Appointment Details</Text>
      </View>

      <View style={styles.uAContainer}>
        <View style={styles.transDoctorCard}>
          <Image source={{ uri: imageUri }} style={styles.doctorImage} />
          <View style={styles.doctorInfo}>
            <Text style={styles.doctorName}>
              {appointmentDetails.doctor_name}
            </Text>
            <Text style={styles.doctorCategory}>
              {appointmentDetails.category}
            </Text>

            {isVirtual && (
              <>
                <Text style={styles.serviceText}>Services Provided :</Text>
                {(services || []).length > 0 ? (
                  services.map((service, index) => (
                    <Text key={index} style={styles.sText}>
                      {formatServiceName(service.service)}: RM {service.price}
                    </Text>
                  ))
                ) : (
                  <Text style={styles.doctorCategory}>
                    No services available
                  </Text>
                )}
              </>
            )}
            {!isVirtual && (
              <>
                <Text style={styles.description}>
                  Location: {appointmentDetails.location}
                </Text>
              </>
            )}
            <Text style={styles.doctorRating}>
              ⭐ {appointmentDetails.rating || "N/A"}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.uAContainer}>
        <Text style={styles.label}>Selected Date and Time:</Text>
        <View style={styles.infoContainer}>
          {/* <Text style={styles.infoText}>
            {appointmentDetails.appointment_date}
          </Text> */}
          <Text style={styles.infoText}>{formattedDate}</Text>
          <Text style={styles.infoText}>{formattedTime}</Text>
          {/* <Text style={styles.infoText}>{formattedDateTime}</Text> */}
        </View>
      </View>

      <View style={styles.uAcontainer}>
        <View style={styles.whiteUAcontainer}>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            {!isVirtual && (
              <>
                <Text style={styles.aLabel}>Location</Text>
                <View style={styles.displayUnderline} />
                <Text style={styles.sectionContent}>
                  {appointmentDetails.location} {"\n"}
                  {appointmentDetails.hospital_address}
                  {"\n"}
                </Text>
              </>
            )}
            <Text style={styles.aLabel}>Patient Details</Text>
            <View style={styles.displayUnderline} />
            <View style={styles.tableContainer}>
              {!isVirtual && (
                <>
                  <View style={styles.tableRow}>
                    <Text style={styles.tableCell}>Medical Coverage</Text>
                    <Text style={styles.tableCell}>
                      {appointmentDetails.medical_coverage}
                    </Text>
                  </View>
                </>
              )}
              {isVirtual && (
                <>
                  <View style={styles.tableRow}>
                    <Text style={styles.tableCell}>
                      Virtual Consultation Method
                    </Text>
                    <Text style={styles.tableCell}>
                      {formatServiceName(appointmentDetails.service)}
                    </Text>
                  </View>
                </>
              )}
              {isVirtual && appointmentDetails.meeting_link && (
                <>
                  <View style={styles.tableRow}>
                    <Text style={styles.tableCell}>Meeting Link</Text>
                    <Text style={styles.tableCell}>
                      {appointmentDetails.meeting_link}
                    </Text>
                  </View>
                </>
              )}
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>
                  {isVirtual ? "Symptoms" : "Reason"}:
                </Text>
                <Text style={styles.tableCell}>
                  {isVirtual
                    ? appointmentDetails.symptoms || "N/A"
                    : appointmentDetails.app_sickness || "N/A"}
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Customer Name:</Text>
                <Text style={styles.tableCell}>
                  {appointmentDetails.full_name}
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Gender:</Text>
                <Text style={styles.tableCell}>
                  {appointmentDetails.gender}
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Special Requests:</Text>
                <Text style={styles.tableCell}>
                  {appointmentDetails.notes || "N/A"}
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Booking No:</Text>
                <Text style={styles.tableCell}>
                  {appointmentDetails.appointment_id}
                </Text>
              </View>
              {isVirtual && (
                <>
                  <View style={styles.tableRow}>
                    <Text style={styles.tableCell}>Payment</Text>
                    <Text style={styles.tableCell}>
                      RM {appointmentDetails.fee}
                    </Text>
                  </View>
                </>
              )}
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Status:</Text>
                <Text style={styles.tableCell}>
                  {appointmentDetails.status}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.signOutButton}
              onPress={() => navigation.navigate("MainPage")}
            >
              <Text style={styles.signOutButtonText}>Back to Home</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>

      <NavigationBar navigation={navigation} activePage="" />
    </ImageBackground>
  );
};

export default HistoryAppDetails;
