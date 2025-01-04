import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Image,
} from "react-native";
import styles from "../../components/styles"; // Import shared styles
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../../../config/config";
import Ionicons from "react-native-vector-icons/Ionicons";
import { getUserIdFromToken } from "../../../services/authService";
import NavigationBar from "../../components/NavigationBar";
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";

const MedicalReport = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const navigation = useNavigation();
  // console.log(reports);

  useEffect(() => {
    const fetchUserId = async () => {
      const userId = await getUserIdFromToken();
      // console.log("userId:", userId);
      if (userId) {
        // setUserId(userId);
        // fetchProfile(userId);
        fetchMedicalReports(userId);
      }
    };
    fetchUserId();
  }, []);

  // useEffect(() => {
  //   fetchMedicalReports();
  // }, []);

  const fetchMedicalReports = async (userId) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/user/medicalReports/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(userId);
      if (!response.ok) {
        throw new Error("Failed to fetch medical reports");
      }
      const data = await response.json();
      setReports(data);
    } catch (error) {
      console.error("Error fetching medical reports:", error);
    } finally {
      setLoading(false);
    }
  };

  // const renderMedicineList = (medicines) => {
  //   return medicines.map((medicine, index) => (
  //     <View
  //       key={`${medicine.medicine_id}-${index}`}
  //       style={styles.medicineContainer}
  //     >
  //       {/* <View key={index} style={styles.medicineContainer}> */}
  //       <Text style={styles.medicineText}>
  //         {medicine.medicine_name} - {medicine.dosage} ({medicine.duration})
  //       </Text>
  //     </View>
  //   ));
  // };

  const renderMedicineList = (medicines) => {
    return medicines.map((medicine) => (
      <View key={medicine.medicine_id} style={styles.medicineContainer}>
        <Text style={styles.medicineText}>
          {medicine.name} - {medicine.dosage} medicines (pills) / (
          {medicine.duration}) Hours
        </Text>
      </View>
    ));
  };

  const renderReport = ({ item }) => (
    <View style={styles.mrCard}>
      <Text style={styles.reportTitle}>
        Appointment ID: {item.appointment_id}
      </Text>
      <Text style={styles.details}>Summary: {item.encounter_summary}</Text>
      <Text style={styles.details}>
        Follow-up Date: {item.follow_up_date || "None"}
      </Text>
      <Text style={styles.details}>Advice: {item.advice_given}</Text>
      <Text style={styles.details}>
        Created At: {item.formatted_created_at}
      </Text>
      <Text style={styles.details}>
        Appointment Type: {item.appointment_type} Appointment
      </Text>

      <Text style={styles.medicineHeader}>Medicines:</Text>
      {item.medicines && item.medicines.length > 0 ? (
        renderMedicineList(item.medicines)
      ) : (
        <Text style={styles.noMedicines}>No medicines prescribed</Text>
      )}
    </View>
  );

  if (loading) {
    return <Text>Loading...</Text>;
  }

  // if (reports.length === 0) {
  //   return <Text>No medical reports available.</Text>;
  // }
  // If there are no reports, show the image and message
  if (reports.length === 0) {
    return (
      <ImageBackground
        source={require("../../../assets/PlainGrey.png")}
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
          <Text style={styles.title}> Prescription </Text>
        </View>
        <View style={styles.emptyContainer}>
          <Image
            source={require("../../../assets/NothingDog.png")} // Adjust the path as necessary
            style={styles.emptyImage}
          />
          <Text style={styles.emptyText}>
            Currently, there are no prescriptions.
          </Text>
        </View>
        <NavigationBar navigation={navigation} activePage="" />
      </ImageBackground>
    );
  }

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
        <Text style={styles.title}> Prescription </Text>
      </View>
      <View style={{ flex: 1, paddingBottom: 10 }}>
        <FlatList
          data={reports}
          // keyExtractor={(item, index) => `${item.report_id}-${index}`} // Combine `report_id` and index for uniqueness
          keyExtractor={(item) => item.report_id.toString()}
          renderItem={renderReport}
          contentContainerStyle={styles.hpContainer}
        />
      </View>
      <NavigationBar navigation={navigation} activePage="" />
    </ImageBackground>
  );
};

export default MedicalReport;
