// MedicalReport.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Image,
} from "react-native";
import styles from "../../components/styles"; // Import shared styles
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../../../config/config";
import Ionicons from "react-native-vector-icons/Ionicons";
import { getUserIdFromToken } from "../../../services/authService";
import NavigationBar from "../../components/NavigationBar";
import { useNavigation, useRoute } from "@react-navigation/native";

const MedicalReport = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params;

  useEffect(() => {
    if (userId) {
      fetchMedicalReports(userId);
    }
  }, []);

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
        Appointment Date | Time:{"\n"}
        {item.appointment_type.toLowerCase() === "virtual"
          ? item.hpva_date
          : item.app_date}
        {" | "}
        {item.appointment_type.toLowerCase() === "virtual"
          ? item.hpva_time
          : item.app_time}
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

      <View style={styles.largeMedicineContainer}>
        <Text style={styles.medicineHeader}>Medicines:</Text>
        {item.medicines && item.medicines.length > 0 ? (
          renderMedicineList(item.medicines)
        ) : (
          <Text style={styles.noMedicines}>No medicines prescribed</Text>
        )}
      </View>
    </View>
  );

  if (loading) {
    return <Text>Loading...</Text>;
  }

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
      <View style={{ flex: 1, paddingBottom: 10 }}>
        <FlatList
          data={reports}
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
