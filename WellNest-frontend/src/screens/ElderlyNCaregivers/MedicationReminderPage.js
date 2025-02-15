// MedicationReminderPage.js
import React, { useState, useCallback } from "react";
import {
  ImageBackground,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import NavigationBar from "../../components/NavigationBar";
import styles from "../../components/styles";
import {
  useNavigation,
  useFocusEffect,
  useRoute,
} from "@react-navigation/native";
import axios from "axios";
import { getUserIdFromToken } from "../../../services/authService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../../../config/config";

const MedicationReminderPage = () => {
  const [medicationList, setMedicationList] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params;

  // Fetch medications from the backend
  const fetchMedications = useCallback(async (id) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        alert("No token found. Please log in.");
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/get/medication/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMedicationList(response.data);
    } catch (error) {
      console.error("Error fetching medications:", error.message);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      const fetchUserIdAndMedications = async () => {
        if (userId) {
          fetchMedications(userId);
        }
      };

      fetchUserIdAndMedications();
    }, [fetchMedications])
  );

  const handleRemindMeLater = async (id) => {
    try {
      await axios.patch(`${API_BASE_URL}/update-status/${id}`, {
        status: "RemindLater",
      });
      fetchMedications(userId); // Refresh list
    } catch (error) {
      console.error("Error updating status:", error.message);
    }
  };
  const EmptyReminder = () => (
    <View style={styles.emptyFavoritesContainer}>
      <Image
        source={require("../../../assets/NothingCat.png")}
        style={styles.emptyFavoritesImage}
      />
      <Text style={styles.noDataText}>No reminder yet.</Text>
    </View>
  );

  const handleMarkAsDone = async (id) => {
    try {
      await axios.patch(`${API_BASE_URL}/update-status/${id}`, {
        status: "Completed",
      });
      fetchMedications(userId); // Refresh list
    } catch (error) {
      console.error("Error updating status:", error.message);
    }
  };

  const renderMedicationItem = ({ item }) => (
    <TouchableOpacity
      style={styles.mrCardContainer}
      onPress={() => {
        // Navigate to Edit screen with existing medication data
        navigation.navigate("AddReminder", {
          edit: true, // Flag indicating edit mode
          medicationData: item, // Pass the item to edit
          medicationId: item.id,
        });
      }}
    >
      <View style={styles.mrCardContent}>
        {item.medicine_image ? (
          <Image
            source={{ uri: item.medicine_image }} // Use the full URL directly
            style={styles.mrMedicineImage}
          />
        ) : (
          <Ionicons name="medkit-outline" size={40} color="#FF9800" />
        )}
        <View style={styles.mrCardTextContainer}>
          <Text style={styles.mrCardTitle}>{item.pill_name}</Text>
          <Text style={styles.mrCardSubText}>{item.time}</Text>
          {item.foodRelation && (
            <Text style={styles.mrCardSubText}>{item.food_relation}</Text>
          )}
          <Text
            style={[
              styles.mrCardStatus,
              { color: item.status === "Pending" ? "#FF9800" : "#4CAF50" },
            ]}
          >
            {item.status}
          </Text>
        </View>
      </View>
      {item.status === "Pending" && (
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.doneButton}
            onPress={() => handleMarkAsDone(item.id)}
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require("../../../assets/PlainGrey.png")}
      style={[styles.background, { flex: 1 }]}
    >
      {/* Title Section */}
      <View style={styles.smallHeaderContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Medication Reminder</Text>
      </View>

      {/* Plan Summary */}
      <View style={styles.planSummaryContainer}>
        <Text style={styles.planTitle}>Your plan for today</Text>
        <Text style={styles.planSubText}>
          {medicationList.filter((med) => med.status === "Completed").length} of{" "}
          {medicationList.length} completed
        </Text>
      </View>

      {/* Daily Review */}
      <View style={styles.dailyReviewContainer}>
        <Text style={styles.dailyReviewTitle}>Daily Review</Text>
        <FlatList
          data={medicationList}
          renderItem={renderMedicationItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<EmptyReminder />}
        />
      </View>

      {/* Add Reminder Button */}
      <TouchableOpacity
        style={styles.addReminderButton}
        onPress={() => navigation.navigate("AddReminder")}
      >
        <Text style={styles.addReminderText}>Add Reminder</Text>
        <Ionicons name="add" size={24} color="#FFF" />
      </TouchableOpacity>

      {/* Bottom Navigation Bar */}
      <NavigationBar navigation={navigation} activePage="" />
    </ImageBackground>
  );
};

export default MedicationReminderPage;
