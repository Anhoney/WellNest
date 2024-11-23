// HpMyCreatedAppointments.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  ImageBackground,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import styles from "../../components/styles"; // Import shared styles
import HpNavigationBar from "../../components/HpNavigationBar"; // Import your custom navigation bar component
import API_BASE_URL from "../../../config/config";

const HpMyCreatedAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null); // New error state
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          alert("No token found. Please log in.");
          return;
        }

        const decodedToken = jwt_decode(token);
        const decodedUserId = decodedToken.id;

        if (decodedUserId) {
          setUserId(decodedUserId);
          fetchAppointments(decodedUserId);
        } else {
          alert("Failed to retrieve user ID from token.");
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        Alert.alert("Error", "Failed to decode token");
      }
    };

    fetchUserId();
  }, []);

  const fetchAppointments = async (userId) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        alert("No token found. Please log in.");
        return;
      }

      const response = await axios.get(
        `${API_BASE_URL}/appointments/user/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAppointments(response.data);
      // console.log(response.data);
      setError(null); // Clear error if successful
    } catch (error) {
      console.error("Error fetching appointments:", error);
      alert("Error fetching appointments.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        alert("No token found. Please log in.");
        return;
      }

      await axios.delete(`${API_BASE_URL}/appointments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert("Deleted", "Appointment deleted successfully");
      fetchAppointments(userId);
    } catch (error) {
      console.error("Error deleting appointment:", error);
      Alert.alert("Error", "Failed to delete appointment");
    }
  };

  const renderAppointment = ({ item }) => (
    <View style={styles.hpAppointmentContainer}>
      <View style={styles.appointmentHeader}>
        <Text style={styles.createdByText}>Created by:</Text>
        <TouchableOpacity onPress={() => handleDelete(item.id)}>
          <FontAwesome name="trash" size={20} color="black" />
        </TouchableOpacity>
      </View>
      <Text style={styles.appointmentDate}>
        {new Date(item.created_at).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })}
      </Text>
      <View style={styles.hpAbuttonContainer}>
        <TouchableOpacity
          style={styles.hpAbutton}
          onPress={() => handleEdit(item.id)}
          // onPress={() => navigation.navigate("HpAppointmentEditPage")}
        >
          <Text style={styles.hpAbuttonText}>Edit creation</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.hpAbutton}>
          <Text style={styles.hpAbuttonText}>Preview</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  const handleEdit = (appointmentId) => {
    navigation.navigate("HpAppointmentEditPage", { appointmentId });
  };

  return (
    <ImageBackground
      source={require("../../../assets/PlainGrey.png")}
      style={styles.background}
    >
      <View style={styles.smallHeaderContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.hpTitle}>My Created Appointments</Text>
      </View>
      <View style={styles.hpAcontainer}>
        <Text style={styles.sectionTitle}>{"\n"}Created Appointments</Text>
        <FlatList
          data={appointments}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderAppointment}
          contentContainerStyle={styles.list}
        />
      </View>
      <HpNavigationBar navigation={navigation} />
    </ImageBackground>
  );
};

export default HpMyCreatedAppointments;
