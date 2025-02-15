// EditCarePlanScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ImageBackground,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../../components/styles";
import axios from "axios";
import API_BASE_URL from "../../../config/config";
import NavigationBar from "../../components/NavigationBar"; // Import your custom navigation bar component
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserIdFromToken } from "../../../services/authService";

const EditCarePlanScreen = ({ route, navigation }) => {
  const { carePlan, currentPlanUserId } = route.params || {};
  const [title, setTitle] = useState(carePlan ? carePlan.title : "");
  const [plan, setPlan] = useState(carePlan ? carePlan.plan : "");
  const [writerName, setWriterName] = useState(
    carePlan && carePlan.username
      ? carePlan.username
      : carePlan
      ? carePlan.full_name
      : ""
  );
  const [userId, setUserId] = useState(carePlan ? carePlan.user_Id : "");
  const [writerId, setWriterId] = useState(null);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

  useEffect(() => {
    getUserIdFromToken().then((writerId) => {
      setWriterId(writerId);
    });
  }, []);

  const handleSubmit = async () => {
    // Validation: Check if title and plan are filled
    if (!title.trim() || !plan.trim()) {
      Alert.alert("Validation Error", "Please fill in all fields.");
      return;
    }
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      alert("No token found. Please log in.");
      return;
    }
    console.log(
      "Care Plan ID:",
      carePlan ? carePlan.careplan_id : "New Care Plan"
    );
    try {
      let response;
      if (carePlan) {
        response = await axios.put(
          `${API_BASE_URL}/update/careplan/${carePlan.careplan_id}`,
          {
            title,
            plan,
            writerId,
          },
          {
            headers: { Authorization: `Bearer ${token}` }, // Ensure token is sent in headers
          }
        );
      } else {
        response = await axios.post(
          `${API_BASE_URL}/create/careplan/${currentPlanUserId}`,
          {
            title,
            plan,
            writerId,
          },
          {
            headers: { Authorization: `Bearer ${token}` }, // Ensure token is sent in headers
          }
        );
      }
      // Check the response status
      if (response.status === 200 || response.status === 201) {
        alert(response.data.message); // Use the message from the backend
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error saving care plan:", error);
      alert("An error occurred while saving the care plan.");
    }
  };

  const handleDelete = async () => {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      alert("No token found. Please log in.");
      return;
    }
    try {
      await axios.delete(
        `${API_BASE_URL}/careplan/${carePlan.careplan_id}`,

        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Care plan deleted successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("Error deleting care plan:", error);
    }
  };

  const confirmDeletion = () => {
    handleDelete(); // Call the delete function
    setDeleteModalVisible(false); // Close the modal
  };

  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    const date = new Date(dateString);

    // Get the day, month, and year separately
    const day = date.toLocaleString("en-US", { day: "numeric" });
    const month = date.toLocaleString("en-US", { month: "long" });
    const year = date.toLocaleString("en-US", { year: "numeric" });

    // Return the formatted date in the desired format
    return `${day} ${month} ${year}`;
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
        <Text style={styles.hpTitle}>
          {carePlan ? "Edit Care Plan" : "Add Care Plan"}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.hpContainer}>
        {carePlan && (
          <TouchableOpacity
            onPress={() => setDeleteModalVisible(true)}
            style={styles.iconDeleteButton}
          >
            <Ionicons
              name="trash"
              size={24}
              color="red"
              style={styles.trashIcon}
            />
          </TouchableOpacity>
        )}
        <Text style={styles.sectionTitle}>
          {carePlan ? "Edit Care Plan" : "Add Care Plan"}
        </Text>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.ecpInput}
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
        />
        <Text style={styles.label}>Care Plan</Text>
        <TextInput
          style={styles.ecpInput}
          placeholder="Care plan"
          multiline
          value={plan}
          onChangeText={setPlan}
        />

        {/* Only show these fields if editing an existing care plan */}
        {carePlan && (
          <>
            <Text style={styles.label}>Plan By: {writerName || "You"}</Text>
            <Text style={styles.label}>Updated By:</Text>
            <Text>{formatDate(carePlan.updated_at)}</Text>
          </>
        )}

        <TouchableOpacity
          style={[styles.signOutButton, { marginTop: 100 }]}
          onPress={handleSubmit}
        >
          <Text style={styles.signOutButtonText}>
            {carePlan ? "Update" : "Submit"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.ecpCancelButton}
          onPress={navigation.goBack}
        >
          <Text style={styles.ecpCancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isDeleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Confirm Deletion</Text>
            <Image
              source={require("../../../assets/DeleteCat.png")}
              style={styles.successImage} // Style for the image
            />
            <Text style={styles.modalMessage}>
              Are you sure you want to delete this care plan?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalConfirmButton}
                onPress={confirmDeletion}
              >
                <Text style={styles.modalConfirmButtonText}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <NavigationBar navigation={navigation} />
    </ImageBackground>
  );
};

export default EditCarePlanScreen;
