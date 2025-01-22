//AccessCollaborators.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
  Image,
  ScrollView,
  Modal,
  Alert,
} from "react-native";
import styles from "../../components/styles";
import { Ionicons } from "@expo/vector-icons";
import { RadioButton } from "react-native-paper";
import API_BASE_URL from "../../../config/config";
import axios from "axios";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserIdFromToken } from "../../../services/authService";
import NavigationBar from "../../components/NavigationBar";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";

const AccessCollaborators = ({ navigation }) => {
  const [relationship, setRelationship] = useState("Family");
  const [collabUserId, setCollabUserId] = useState("");
  const [username, setUsername] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [requestModalVisible, setRequestModalVisible] = useState(false);

  const handleConnectRequest = async () => {
    if (!collabUserId.trim()) {
      Alert.alert("Validation Error", "Please fill in all fields.");
      return;
    }

    const token = await AsyncStorage.getItem("token");
    const userId = await getUserIdFromToken(token); // Assuming this function parses the user ID from token

    if (collabUserId === userId.toString()) {
      Alert.alert("Validation Error", "You cannot connect to yourself.");
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}/create/request`,
        {
          user_id: collabUserId, // The ID of the user being connected to
          collaborator_id: userId, // Current user's ID
          relationship,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setModalVisible(false);
      setRequestModalVisible(true);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        Alert.alert(
          "Error",
          error.response.data.error || "User ID does not exist."
        );
      } else {
        Alert.alert("Error", "An error occurred while sending the request.");
      }
      console.error("Error sending request:", error);
      //   console.error("Error sending request:", error);
    } finally {
      setModalVisible(false); // Close the modal after registration
    }
  };

  return (
    <ImageBackground
      source={require("../../../assets/PlainGrey.png")}
      style={styles.background}
    >
      {/* Title Section with Back chevron-back */}
      <View style={styles.whiteBgSmallHeaderContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Family and Cargiver Collaboration</Text>
      </View>

      <ScrollView contentContainerStyle={styles.hpContainer}>
        <Text style={styles.sectionTitle}>Collaboration Build</Text>
        <View style={styles.displayUnderline}></View>
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Who You Try To Connect?</Text>
          <Text style={styles.label}>User ID</Text>
          <TextInput
            style={styles.hpInput}
            placeholder="User Id"
            value={collabUserId}
            onChangeText={setCollabUserId}
          />
          {/* <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.hpInput}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            multiline
          /> */}
          <Text style={styles.label}>Relationship</Text>
          <RadioButton.Group
            onValueChange={setRelationship}
            value={relationship}
          >
            <View style={styles.hpradioButtonContainer}>
              <RadioButton.Item
                label="Family"
                value="Family"
                mode="android"
                position="leading"
                color="#FFA500" // Replace with your desired color
                labelStyle={styles.hpradioLabel}
              />
            </View>
            <View style={styles.hpradioButtonContainer}>
              <RadioButton.Item
                label="Caregiver"
                value="Caregiver"
                mode="android"
                position="leading"
                color="#FFA500"
                labelStyle={styles.hpradioLabel}
              />
            </View>
          </RadioButton.Group>
        </View>

        <TouchableOpacity
          style={[styles.signOutButton, { marginTop: 200 }]}
          onPress={handleConnectRequest}
        >
          <Text style={styles.connectButtonText}>Access Request</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={requestModalVisible}
        onRequestClose={() => setRequestModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Request Sent!</Text>
            <Image
              source={require("../../../assets/BusRequest.png")}
              style={styles.successImage}
            />
            <Text style={styles.modalMessage}>
              Your request has been sent to your collaborator, please wait for
              the confirmation. You will get the notification once the request
              have approved.
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setRequestModalVisible(false); // Close the success modal
                navigation.navigate("MainPage");
              }}
            >
              <Text style={styles.modalConfirmButtonText}>Back to Home</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <NavigationBar navigation={navigation} activePage="" />
    </ImageBackground>
  );
};

export default AccessCollaborators;
