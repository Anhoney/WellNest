//CoEventParticipants.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import styles from "../../components/styles";
import { Ionicons } from "@expo/vector-icons";
import { getUserIdFromToken } from "../../../services/authService";
import CoNavigationBar from "../../components/CoNavigationBar";
import API_BASE_URL from "../../../config/config";
import {
  useRoute,
  useNavigation,
  useFocusEffect,
} from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CoEventParticipants = () => {
  const navigation = useNavigation();
  const [participants, setParticipants] = useState([]);
  const [participantCount, setParticipantCount] = useState(0);
  const route = useRoute(); // Get route params
  const { eventId } = route.params || {};
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      fetchParticipants();
      fetchParticipantCount();
    }, [])
  );

  const fetchParticipants = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        alert("No token found. Please log in.");
        return;
      }
      console.log("fetchEventId", eventId);
      const response = await axios.get(
        `${API_BASE_URL}/events/${eventId}/participants`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Check the response data
      console.log("Response data:", response.data);

      // Ensure the participants are set correctly
      if (response.data.participants) {
        setParticipants(response.data.participants);
        console.log("Fetched participants:", response.data.participants);
      } else {
        console.error("No participants found in response.");
      }
      //   setParticipants(response.data.participants);
      //   console.log("Fetched participants:", response.data.participants);
    } catch (error) {
      console.error("Error fetching participants:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };
  const fetchParticipantCount = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        alert("No token found. Please log in.");
        return;
      }
      const response = await axios.get(
        `${API_BASE_URL}/events/${eventId}/participants/count`, // Adjust the endpoint as needed
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Check the response data
      console.log("Participant count response:", response.data);

      if (response.data.count !== undefined) {
        setParticipantCount(response.data.count);
      } else {
        console.error("No count found in response.");
      }
    } catch (error) {
      console.error("Error fetching participant count:", error);
    }
  };

  const renderParticipant = ({ item }) => (
    <View style={styles.participantContainer}>
      <Text style={styles.participantUsername}>{item.username}</Text>
      <Text style={styles.participantEmail}>{item.email}</Text>
    </View>
  );
  const renderEmptyComponent = () => (
    <View style={styles.coEmptyContainer}>
      <Image
        source={require("../../../assets/NothingDog.png")}
        style={styles.emptyImage}
      />
      <Text style={styles.emptyText}>No participants.</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

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
        <Text style={styles.title}>Events Participants</Text>
      </View>
      <View style={styles.assessmentContainer}>
        <Text style={styles.participantCountText}>
          Total Participants: {participantCount}{" "}
          {/* Display participant count */}
        </Text>
        <FlatList
          data={participants}
          keyExtractor={(item) =>
            item.id ? item.id.toString() : Math.random().toString()
          } // Handle undefined IDs
          //   keyExtractor={(item) => item.id.toString()}
          renderItem={renderParticipant}
          ListEmptyComponent={renderEmptyComponent}
        />
      </View>
      <CoNavigationBar navigation={navigation} activePage="" />
    </ImageBackground>
  );
};

export default CoEventParticipants;
