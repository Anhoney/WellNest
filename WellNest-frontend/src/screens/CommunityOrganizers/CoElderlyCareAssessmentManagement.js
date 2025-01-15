//CoElderlyCareAssessmentManagement.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Import icons from Expo
import styles from "../../components/styles"; // Import shared styles
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";
import axios from "axios";
import { RadioButton } from "react-native-paper"; // For the radio button
import CoNavigationBar from "../../components/CoNavigationBar"; // Import your custom navigation bar component
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePickerModal from "react-native-modal-datetime-picker"; // Ensure this is imported
import {
  validateFields,
  getInputStyle,
} from "../../components/validationUtils"; // Import validation functions
import API_BASE_URL from "../../../config/config";
import { getUserIdFromToken } from "../../../services/authService";
import * as ImagePicker from "expo-image-picker";
import { Buffer } from "buffer";

const CoElderlyCareAssessmentManagement = () => {
  const [assessments, setAssessments] = useState([]); // State for assessments
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    getUserIdFromToken().then((userId) => {
      setUserId(userId);
    });
  }, []);

  const fetchAssessments = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        alert("No token found. Please log in.");
        return;
      }
      const response = await axios.get(
        `${API_BASE_URL}/get/assessments/${userId}`,

        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data) {
        setAssessments(response.data);
      } else {
        setAssessments([]);
      }
    } catch (error) {
      console.error("Error fetching assessments:", error);
      Alert.alert("Error", "Unable to fetch assessments at this time.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      if (userId) {
        fetchAssessments();
      }
    }, [userId])
  );

  const renderAssessments = () => {
    return assessments.map((assessment, index) => (
      <View key={index} style={styles.assessmentCard}>
        <Image
          source={
            assessment.photo
              ? { uri: assessment.photo } // Use the photo directly
              : require("../../../assets/DefaultAssessment.png")
          }
          style={styles.assessmentImage}
        />

        <View style={styles.assessmentDetails}>
          <Text style={styles.assessmentTitle}>{assessment.title}</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() =>
              navigation.navigate("AddAssessmentScreen", {
                assessmentId: assessment.assessment_id,
              })
            }
          >
            <Text style={styles.editButtonText}>EDIT</Text>
          </TouchableOpacity>
        </View>
      </View>
    ));
  };
  const renderEmptyComponent = () => (
    <View style={styles.coEmptyContainer}>
      <Image
        source={require("../../../assets/SleepingCat.png")}
        style={styles.largeEmptyImage}
      />
      <Text style={styles.emptyText}>No Assessment Yet.</Text>
    </View>
  );

  return (
    <ImageBackground
      source={require("../../../assets/PlainGrey.png")}
      style={styles.background}
    >
      {/* Title Section with Back chevron-back */}
      <View style={styles.smallHeaderContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.hpTitle}>
          Elderly Care {"\n"}Assessment Management
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.hpContainer}>
        <Text style={styles.sectionTitle}>
          {"\n"}Feel free to assist senior citizens in obtaining the support
          they require.{"\n"}
        </Text>
        <View style={styles.singleUnderline}></View>

        {/* Add Assessment Button */}
        <TouchableOpacity
          style={styles.addAssessmentButton}
          onPress={() => navigation.navigate("AddAssessmentScreen")}
        >
          <Text style={styles.addAssessmentButtonText}>+ Add Assessment</Text>
        </TouchableOpacity>

        {/* My Assessments Section */}
        <Text style={styles.sectionHeader}>My Created Assessments</Text>
        <View style={styles.displayUnderline}></View>
        {loading ? ( // Show ActivityIndicator while loading
          <ActivityIndicator size="large" color="#0000ff" />
        ) : assessments.length === 0 ? (
          renderEmptyComponent()
        ) : (
          <View>{renderAssessments()}</View>
        )}
      </ScrollView>
      {/* Navigation Bar */}
      <CoNavigationBar navigation={navigation} />
    </ImageBackground>
  );
};

export default CoElderlyCareAssessmentManagement;
