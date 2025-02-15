// CollaborationScreen.js
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import styles from "../../components/styles";
import { Ionicons } from "@expo/vector-icons";
import API_BASE_URL from "../../../config/config";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserIdFromToken } from "../../../services/authService";
import NavigationBar from "../../components/NavigationBar";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

const FamilyCaregiverCollaboration = ({}) => {
  const navigation = useNavigation();
  const [collaborationRequests, setCollaborationRequests] = useState([]); // List of incoming collaboration requests
  const [acceptedCollaborations, setAcceptedCollaborations] = useState([]); // List of accepted collaborations
  const [collaborations, setCollaborations] = useState([]); // List of collaborations including accepted and pending
  const [userId, setUserId] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getUserIdFromToken();
      setUserId(id);
    };

    fetchUserId();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchRequests();
      fetchPendingRequests();
    }, [userId]) // Dependencies can be added here if needed
  );
  const fetchRequests = async () => {
    if (!userId) return; // Prevent fetching if userId is null

    const token = await AsyncStorage.getItem("token");
    if (!token) {
      console.error("No token found. Please log in.");
      return;
    }

    try {
      // Fetch pending requests
      const requestsResponse = await axios.get(
        `${API_BASE_URL}/get/requests/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCollaborationRequests(requestsResponse.data);

      // Fetch accepted collaborations
      const acceptedResponse = await axios.get(
        `${API_BASE_URL}/get/accepted/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAcceptedCollaborations(acceptedResponse.data);

      // Combine accepted and pending requests
      setCollaborations([...requestsResponse.data, ...acceptedResponse.data]);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  const fetchPendingRequests = async () => {
    if (!userId) return; // Prevent fetching if userId is null

    const token = await AsyncStorage.getItem("token");
    if (!token) {
      console.error("No token found. Please log in.");
      return;
    }

    try {
      const response = await axios.get(
        `${API_BASE_URL}/pending/requests/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPendingRequests(response.data);
    } catch (error) {
      console.error("Error fetching pending requests:", error);
    }
  };

  const handleAccept = async (collabId) => {
    if (!userId) return; // Prevent fetching if userId is null

    const token = await AsyncStorage.getItem("token");
    if (!token) {
      console.error("No token found. Please log in.");
      return;
    }

    try {
      const response = await axios.put(
        `${API_BASE_URL}/update/accepted/${collabId}`,
        {}, // No body is needed for this request
        {
          headers: { Authorization: `Bearer ${token}` }, // Ensure the token is sent in the headers
        }
      );

      if (response.status === 200) {
        setCollaborationRequests(
          collaborationRequests.filter((req) => req.collab_id !== collabId)
        );
        await fetchRequests();
      }
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  const handleDecline = async (collabId) => {
    if (!userId) return; // Prevent fetching if userId is null

    const token = await AsyncStorage.getItem("token");
    if (!token) {
      console.error("No token found. Please log in.");
      return;
    }

    try {
      const response = await axios.put(
        `${API_BASE_URL}/${collabId}/decline`,
        {}, // No body is needed for this request
        {
          headers: { Authorization: `Bearer ${token}` }, // Ensure the token is sent in the headers
        }
      );

      if (response.status === 200) {
        setCollaborationRequests(
          collaborationRequests.filter((req) => req.collab_id !== collabId)
        );
        await fetchRequests();
      }
    } catch (error) {
      console.error("Error declining request:", error);
    }
  };

  const renderRequest = () => {
    if (collaborationRequests.length > 0) {
      const request = collaborationRequests[0]; // Display the first request only
      return (
        <View style={styles.requestContainer}>
          <Text style={styles.requestText}>
            {`${request.collaborator_username} (Relationship: ${request.relationship}) wants to collaborate with you. Do you want to accept for information sharing?`}
          </Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={() => handleAccept(request.collab_id)}
            >
              <Text style={styles.coButtonText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.declineButton}
              onPress={() => handleDecline(request.collab_id)}
            >
              <Text style={styles.coButtonText}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    return null;
  };

  const renderCollaborationCard = ({ item }) => {
    const handlePress = () => {
      const userToCollabId =
        item.user_id === userId ? item.collaborator_id : item.user_id;
      navigation.navigate("FamilyCollabScreen", {
        userToCollabId: userToCollabId,
        relationship: item.relationship,
        collabId: item.collab_id,
      });
    };
    return (
      <TouchableOpacity style={styles.collabCard} onPress={handlePress}>
        <Text style={styles.collabCardTitle}>{item.collaborator_username}</Text>
        <Text style={styles.collabCardDetails}>{item.role_label}</Text>
        <Text style={styles.collabCardDetails}>{item.relationship}</Text>
      </TouchableOpacity>
    );
  };

  const handleConnectWithOthers = () => {
    // Navigate to a screen for searching and connecting with others (or a prompt for entering user ID)
    navigation.navigate("AccessCollaborators");
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Image
        source={require("../../../assets/NothingDog.png")}
        style={[{ marginTop: 80 }, styles.emptyImage]}
      />
      <Text style={styles.emptyText}>No collaborations found.</Text>
    </View>
  );

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

        {/* New Section for Pending Requests */}
        {pendingRequests.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>
              Pending Collaboration Requests
            </Text>
            <View style={styles.displayUnderline}></View>
            <View style={styles.pendingRequestsContainer}>
              <Text style={styles.pendingRequestText}>
                You have sent the following collaboration requests:
              </Text>
              {pendingRequests.map((request, index) => (
                <Text
                  key={request.id || `pending-${index}`}
                  style={styles.pendingRequestText}
                >
                  {` - ${
                    request.collaborator_username || request.full_name
                  } (Relationship: ${request.relationship}) `}
                </Text>
              ))}
            </View>
          </View>
        )}

        <Text style={styles.sectionTitle}>Collaboration Build</Text>
        <View style={styles.displayUnderline}></View>
        <FlatList
          data={acceptedCollaborations}
          renderItem={renderCollaborationCard}
          keyExtractor={(item, index) =>
            item.collab_id ? item.collab_id.toString() : `collab-${index}`
          }
          ListEmptyComponent={renderEmptyComponent}
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

export default FamilyCaregiverCollaboration;
