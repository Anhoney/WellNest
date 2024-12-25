// MedicalReportWriting.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  ImageBackground,
  Image,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../../components/styles";
import axios from "axios";
import HpNavigationBar from "../../components/HpNavigationBar";
import { useNavigation } from "@react-navigation/native";
import API_BASE_URL from "../../../config/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserIdFromToken } from "../../../services/authService";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const MedicalReportWriting = ({ route }) => {
  const { appointmentId, appointment_type } = route.params; // Get appointment ID from route params
  const [encounterSummary, setEncounterSummary] = useState("");
  const [followUpDate, setFollowUpDate] = useState(null);
  const [adviceGiven, setAdviceGiven] = useState("");
  const [userId, setUserId] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false); // Modal state
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false); // State for date picker visibility
  const imageUri = appointments.profile_image
    ? `data:image/png;base64 ${appointments.profile_image}`
    : "https://via.placeholder.com/150";

  const [medicines, setMedicines] = useState([
    { name: "", dosage: "", duration: "" },
  ]);
  const navigation = useNavigation();

  // useEffect(() => {
  //   const fetchUserId = async () => {
  //     const userId = await getUserIdFromToken();
  //     // console.log("userId:", userId);
  //     if (userId) {
  //       setUserId(userId);
  //       // fetchProfile(userId);
  //     }
  //   };

  //   fetchUserId();
  // }, []);
  useEffect(() => {
    const fetchMedicalReport = async () => {
      try {
        console.log("fetchMedicalReport appointmentId:", appointmentId);
        const token = await AsyncStorage.getItem("token");
        const response = await fetch(
          `${API_BASE_URL}/medicalReports/${appointmentId}?appointment_type=${appointment_type}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.status === 404) {
          setIsLoading(false); // No existing report, show empty form
          return;
        }

        const data = await response.json();
        setEncounterSummary(data.encounter_summary || "");
        setFollowUpDate(
          data.follow_up_date ? new Date(data.follow_up_date) : null
        );
        setAdviceGiven(data.advice_given || "");
        setMedicines(
          data.medicines || [{ name: "", dosage: "", duration: "" }]
        );
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching medical report:", error);
        alert("Failed to load medical report.");
        setIsLoading(false);
      }
    };

    fetchMedicalReport();
  }, [appointmentId]);
  useEffect(() => {
    // Ensure appointments are fetched only when userId is set
    // if (userId) {
    fetchAppointments();
    // }
  }, []);

  const fetchAppointments = async () => {
    try {
      console.log("MW appointmentId:", appointmentId);
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        alert("No token found. Please log in.");
        return;
      }

      // Determine the endpoint based on appointment_type
      const endpoint =
        appointment_type === "virtual"
          ? `${API_BASE_URL}/virtual/appointment/details/${appointmentId}` // Use virtual endpoint for virtual appointments
          : `${API_BASE_URL}/appointment/details/${appointmentId}`; // Use physical endpoint for physical appointments

      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Fetched appointment details:", response.data);
      setAppointments(response.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      Alert.alert("Error", "Error fetching appointments.");
    }
  };

  // const fetchAppointments = async () => {
  //   try {
  //     console.log("MW appointmentId:", appointmentId);
  //     const token = await AsyncStorage.getItem("token");
  //     if (!token) {
  //       alert("No token found. Please log in.");
  //       return;
  //     }

  //     const response = await axios.get(
  //       `${API_BASE_URL}/appointment/details/${appointmentId}`,
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );
  //     // console.log("Fetched appointment details:", response.data);
  //     setAppointments(response.data);
  //   } catch (error) {
  //     console.error("Error fetching appointments:", error);
  //     Alert.alert("Error", "Error fetching appointments.");
  //   }
  // };

  // const handleDeleteReport = async () => {
  //   Alert.alert(
  //     "Confirm Deletion",
  //     "Are you sure you want to delete this medical report?",
  //     [
  //       {
  //         text: "Cancel",
  //         style: "cancel", // This will style the button as a cancel action
  //       },
  //       {
  //         text: "Delete",
  //         onPress: async () => {
  //           try {
  //             const token = await AsyncStorage.getItem("token");
  //             const response = await fetch(
  //               `${API_BASE_URL}/medicalReports/delete/${appointmentId}`,
  //               {
  //                 method: "DELETE",
  //                 headers: {
  //                   Authorization: `Bearer ${token}`,
  //                 },
  //               }
  //             );

  //             if (!response.ok) {
  //               throw new Error("Failed to delete medical report.");
  //             }

  //             Alert.alert("Success", "Medical report deleted successfully.");
  //             navigation.goBack(); // Navigate back after deletion
  //           } catch (error) {
  //             console.error("Error deleting medical report:", error);
  //             Alert.alert("Error", "Failed to delete medical report.");
  //           }
  //         },
  //       },
  //     ],
  //     { cancelable: false } // Prevents dismissing the alert by tapping outside
  //   );
  // };

  const handleDeleteReport = () => {
    setModalVisible(true); // Show modal
  };

  const confirmDeleteReport = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/medicalReports/delete/${appointmentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete medical report.");
      }

      setModalVisible(false); // Close modal on success
      Alert.alert("Success", "Medical report deleted successfully.");
      navigation.goBack(); // Navigate back after deletion
    } catch (error) {
      console.error("Error deleting medical report:", error);
      Alert.alert("Error", "Failed to delete medical report.");
    }
  };

  if (isLoading) {
    return <Text>Loading...</Text>; // Or add a loading spinner
  }

  const handleAddMedicine = () => {
    setMedicines([...medicines, { name: "", dosage: "", duration: "" }]);
  };

  const handleMedicineChange = (index, field, value) => {
    const newMedicines = [...medicines];
    newMedicines[index][field] = value;
    setMedicines(newMedicines);
  };

  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/medical-reports`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          appointment_id: appointmentId,
          appointment_type: appointment_type,
          encounter_summary: encounterSummary,
          follow_up_date: followUpDate
            ? followUpDate.toISOString().split("T")[0]
            : null, // Format date as 'YYYY-MM-DD' or send null
          advice_given: adviceGiven,
          medicines: medicines,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create medical report.");
      }

      Alert.alert("Success", "Medical report saved successfully.");
      navigation.goBack(); // Navigate back after submission
    } catch (error) {
      console.error("Error submitting medical report:", error);
      Alert.alert("Error", "Failed to create medical report.");
    }
  };

  // Functions to handle date picker
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setFollowUpDate(date);
    hideDatePicker();
  };

  const formatServiceName = (service) => {
    if (!service) return "Not Specified";
    return service.replace(/([A-Z])/g, " $1").trim();
  };

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
        <Text style={styles.title}> Medical Report </Text>
      </View>

      {/* <View style={styles.hpAcontainer}>
        <View style={styles.doctorCard}>
          <Image source={{ uri: imageUri }} style={styles.doctorImage} />
          <View style={styles.doctorInfo}>
            <Text style={styles.doctorName}>{appointments.full_name}</Text>
            <Text style={styles.details}>Date: {appointments.app_date}</Text>
            <Text style={styles.details}>Time: {appointments.app_time}</Text>
            <Text style={styles.details}>
              Patient: {appointments.who_will_see}
            </Text>
            <Text style={styles.details}>
              Status: {appointments.app_status}
            </Text>
          </View>
        </View>
      </View> */}

      {/* Different Views for Virtual and Physical Appointments */}
      {appointment_type === "virtual" ? (
        <View style={styles.hpAcontainer}>
          <View style={styles.doctorCard}>
            <Image source={{ uri: imageUri }} style={styles.doctorImage} />
            <View style={styles.doctorInfo}>
              <Text style={styles.doctorName}>{appointments.full_name}</Text>
              <Text style={styles.details}>Date: {appointments.hpva_date}</Text>
              <Text style={styles.details}>Time: {appointments.hpva_time}</Text>
              <Text style={styles.details}>
                Patient: {appointments.who_will_see}
              </Text>
              <Text style={styles.details}>Status: {appointments.status}</Text>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.hpAcontainer}>
          <View style={styles.doctorCard}>
            <Image source={{ uri: imageUri }} style={styles.doctorImage} />
            <View style={styles.doctorInfo}>
              <Text style={styles.doctorName}>{appointments.full_name}</Text>
              <Text style={styles.details}>Date: {appointments.app_date}</Text>
              <Text style={styles.details}>Time: {appointments.app_time}</Text>
              <Text style={styles.details}>
                Patient: {appointments.who_will_see}
              </Text>
              <Text style={styles.details}>
                Status: {appointments.app_status}
              </Text>
            </View>
          </View>
        </View>
      )}

      <View style={styles.uAcontainer}>
        <View style={styles.whiteMrAcontainer}>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <Text style={styles.mrLabel}>Booking No.</Text>
            <View style={styles.mrUnderline} />
            <Text style={styles.sectionContent}>
              {appointment_type === "virtual"
                ? appointments.hpva_id
                : appointments.hp_app_id}
            </Text>

            {/* Service Type (Virtual Only) */}
            {appointment_type === "virtual" && (
              <>
                <Text style={styles.mrLabel}>Service Type</Text>
                <View style={styles.mrUnderline} />
                <Text style={styles.sectionContent}>
                  {formatServiceName(appointments.service) || "Not Specified"}
                </Text>
              </>
            )}

            <Text style={styles.mrLabel}>Encounter Summary</Text>
            <View style={styles.mrUnderline} />
            <View style={styles.mrInputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Encounter Summary"
                value={encounterSummary}
                onChangeText={setEncounterSummary}
              />
            </View>

            <Text style={styles.mrLabel}>Follow Up Date</Text>
            <View style={styles.mrUnderline} />

            <TouchableOpacity style={styles.dateInput} onPress={showDatePicker}>
              <View style={styles.dateInputContent}>
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color="#000"
                  style={styles.iconStyle}
                />
                <Text style={styles.dateText}>
                  {followUpDate ? followUpDate.toDateString() : "Select Date"}
                </Text>
              </View>
            </TouchableOpacity>

            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              display="inline"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
              date={followUpDate || new Date()} // Default to current date
              minimumDate={new Date()} // Prevent past dates
            />

            <Text style={styles.mrLabel}>Advice Given</Text>
            <View style={styles.mrUnderline} />
            <View style={styles.mrInputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Advice Given"
                value={adviceGiven}
                onChangeText={setAdviceGiven}
              />
            </View>

            <Text style={styles.mrLabel}>Prescriptions</Text>
            <View style={styles.mrUnderline} />

            {medicines.map((medicine, index) => (
              <View key={index} style={styles.medicineContainer}>
                <Text style={styles.medicineLabel}>{`Medicine ${
                  index + 1
                }`}</Text>
                <TextInput
                  style={styles.medicineInput}
                  placeholder="Medicine Name"
                  value={medicine.name}
                  onChangeText={(value) =>
                    handleMedicineChange(index, "name", value)
                  }
                />
                <TextInput
                  style={styles.medicineInput}
                  placeholder="Dosage"
                  value={medicine.dosage}
                  onChangeText={(value) =>
                    handleMedicineChange(index, "dosage", value)
                  }
                />
                <TextInput
                  style={styles.medicineInput}
                  placeholder="Duration"
                  value={medicine.duration}
                  onChangeText={(value) =>
                    handleMedicineChange(index, "duration", value)
                  }
                />
              </View>
            ))}

            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddMedicine}
            >
              <Text style={styles.addButtonText}>+ Add Medicine</Text>
            </TouchableOpacity>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.mrDeleteButton}
                // onPress={handleDeleteReport}
                onPress={() => setModalVisible(true)} // Show modal
              >
                <View style={styles.dateInputContent}>
                  <Ionicons name="trash-bin" size={20} color="#FFF" />
                  <Text style={styles.mrButtonText}> Delete Report </Text>
                </View>
              </TouchableOpacity>

              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
              >
                <View style={styles.modalContainer}>
                  <View style={styles.modalView}>
                    <Text style={styles.modalTitle}>Confirm Deletion</Text>
                    <Image
                      source={require("../../../assets/DeleteCat.png")}
                      style={styles.successImage} // Add this style in styles.js
                    />
                    <Text style={styles.modalMessage}>
                      Are you sure you want to delete this medical report?
                    </Text>
                    <View style={styles.modalButtons}>
                      <TouchableOpacity
                        style={styles.modalConfirmButton}
                        onPress={confirmDeleteReport} // Confirm action
                      >
                        <Text style={styles.modalConfirmButtonText}>
                          Confirm
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.modalCancelButton}
                        onPress={() => setModalVisible(false)} // Cancel action
                      >
                        <Text style={styles.modalCancelButtonText}>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>

              <TouchableOpacity
                style={styles.mrCancelButton}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.blueMrButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.signOutButton}
              onPress={handleSubmit}
            >
              <Text style={styles.mrButtonText}>Submit</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
      <HpNavigationBar navigation={navigation} />
    </ImageBackground>
  );
};

export default MedicalReportWriting;
