import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import styles from "../../components/styles";
import { Ionicons } from "@expo/vector-icons";
import API_BASE_URL from "../../../config/config";
import axios from "axios";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserIdFromToken } from "../../../services/authService";
import NavigationBar from "../../components/NavigationBar";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";

const FamilyCaregiverCollaboration = ({ navigation }) => {
  const [collaborationRequests, setCollaborationRequests] = useState([
    {
      id: "1",
      name: "Karina",
      relationship: "Daughter",
    },
  ]); // List of incoming collaboration requests

  const [acceptedCollaborations, setAcceptedCollaborations] = useState([
    {
      id: "2",
      name: "Jenny",
      role: "Caregiver",
    },
  ]); // List of accepted collaborations

  const handleAccept = (id) => {
    const acceptedRequest = collaborationRequests.find((req) => req.id === id);
    if (acceptedRequest) {
      setAcceptedCollaborations([...acceptedCollaborations, acceptedRequest]);
      setCollaborationRequests(
        collaborationRequests.filter((req) => req.id !== id)
      );
    }
  };

  const handleDecline = (id) => {
    setCollaborationRequests(
      collaborationRequests.filter((req) => req.id !== id)
    );
  };

  const renderRequest = () => {
    if (collaborationRequests.length > 0) {
      const request = collaborationRequests[0]; // Display the first request only
      return (
        <View style={styles.requestContainer}>
          <Text style={styles.requestText}>
            {`${request.name} (Relationship: ${request.relationship}) wants to collaborate with you. Do you want to accept for information sharing?`}
          </Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={() => handleAccept(request.id)}
            >
              <Text style={styles.coButtonText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.declineButton}
              onPress={() => handleDecline(request.id)}
            >
              <Text style={styles.coButtonText}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    return null;
  };

  const renderCollaborationCard = ({ item }) => (
    <TouchableOpacity style={styles.collabCard}>
      <Text style={styles.collabCardTitle}>{item.name}</Text>
      <Text style={styles.collabCardDetails}>{item.role}</Text>
    </TouchableOpacity>
  );

  const handleConnectWithOthers = () => {
    // Navigate to a screen for searching and connecting with others (or a prompt for entering user ID)
    navigation.navigate("ConnectWithOthers");
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

      <View style={styles.collabContainer}>
        {renderRequest()}

        <Text style={styles.sectionTitle}>Collaboration Build</Text>
        <View style={styles.displayUnderline}></View>
        <FlatList
          data={acceptedCollaborations}
          renderItem={renderCollaborationCard}
          keyExtractor={(item) => item.id}
        />

        <TouchableOpacity
          style={styles.connectButton}
          onPress={handleConnectWithOthers}
        >
          <Text style={styles.connectButtonText}>Connect with others</Text>
        </TouchableOpacity>
      </View>
      <NavigationBar navigation={navigation} activePage="" />
    </ImageBackground>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: "#f5f5f5",
//   },
//   backButton: {
//     marginBottom: 16,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginBottom: 16,
//   },
//   requestContainer: {
//     padding: 16,
//     backgroundColor: "#fff",
//     borderRadius: 8,
//     marginBottom: 16,
//   },
//   requestText: {
//     fontSize: 16,
//     marginBottom: 8,
//   },
//   buttonRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   acceptButton: {
//     backgroundColor: "#fcb941",
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 4,
//   },
//   declineButton: {
//     borderColor: "#000",
//     borderWidth: 1,
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 4,
//   },
//   buttonText: {
//     fontSize: 16,
//     fontWeight: "bold",
//     textAlign: "center",
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 8,
//   },
//   card: {
//     padding: 16,
//     backgroundColor: "#fff",
//     borderRadius: 8,
//     marginBottom: 8,
//   },
//   cardTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   cardDetails: {
//     fontSize: 16,
//   },
//   connectButton: {
//     marginTop: 16,
//     backgroundColor: "#fcb941",
//     padding: 16,
//     borderRadius: 8,
//     alignItems: "center",
//   },
//   connectButtonText: {
//     fontSize: 18,
//     color: "#fff",
//   },
// });

export default FamilyCaregiverCollaboration;
