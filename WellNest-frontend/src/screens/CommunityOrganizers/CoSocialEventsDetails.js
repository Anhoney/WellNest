import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from "react-native";
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";
import API_BASE_URL from "../../../config/config";
import { Ionicons } from "@expo/vector-icons"; // Import icons from Expo
import styles from "../../components/styles"; // Import shared styles
import axios from "axios";
import CoNavigationBar from "../../components/CoNavigationBar";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Import a default photo from your assets or provide a URL
const defaultPhoto = require("../../../assets/elderlyEventPhoto.webp");

const CoSocialEventDetails = () => {
  const [eventDetails, setEventDetails] = useState(null);
  const route = useRoute(); // Get route params
  const navigation = useNavigation();
  const { eventId } = route.params; // Assume eventId is passed as a param

  useFocusEffect(
    React.useCallback(() => {
      fetchEventDetails();
    }, [])
  );

  const fetchEventDetails = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        alert("No token found. Please log in.");
        return;
      }
      const response = await fetch(`${API_BASE_URL}/single/event/${eventId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Use your actual token
        },
      });
      const data = await response.json();
      setEventDetails(data);
    } catch (error) {
      console.error("Failed to fetch event details:", error);
    }
  };

  //   const formatDate = (dateString) => {
  //     const options = { day: "numeric", month: "long", year: "numeric" };
  //     return new Date(dateString).toLocaleDateString("en-US", options);
  //   };
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

  const formatFees = (fees) => {
    if (fees && fees.toLowerCase() === "free") {
      return "FREE";
    } else if (!isNaN(fees) && !isNaN(parseFloat(fees))) {
      return `RM ${fees}`;
    } else {
      return fees; // Show fees as-is if it's not numeric or "free"
    }
  };

  if (!eventDetails) {
    return <Text>Loading event details...</Text>;
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
        <Text style={styles.hpTitle}>{eventDetails.title}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollView}>
        <Image
          source={
            eventDetails.photo ? { uri: eventDetails.photo } : defaultPhoto
          }
          style={styles.eventImage}
        />
        <View style={styles.hpContainer}>
          <View style={styles.eventDetailsCard}>
            <View style={styles.eventRow}>
              <Text style={styles.eventCardTitle}>{eventDetails.title}</Text>
              <Text style={styles.eventPrice}>
                {formatFees(eventDetails.fees)}
              </Text>
            </View>
            <View style={styles.displayUnderline} />
            <Text style={styles.eventSectionTitle}>Details</Text>
            <View style={styles.displayUnderline} />
            <Text style={styles.eventDetailText}>
              Location: {"\n"}
              {eventDetails.location}
              {"\n"}
            </Text>
            <Text style={styles.eventDetailText}>
              Date: {"\n"}
              {eventDetails.event_date}
              {"\n"}
            </Text>
            <Text style={styles.eventDetailText}>
              Time: {"\n"}
              {eventDetails.event_time}
              {"\n"}
            </Text>
            <Text style={styles.eventDetailText}>
              Registration Due: {"\n"}
              {formatDate(eventDetails.registration_due)}
              {"\n"}
            </Text>
            <Text style={styles.eventDetailText}>
              Capacity: {"\n"}
              {eventDetails.capacity || "N/A"}
              {"\n"}
            </Text>

            <Text style={styles.eventSectionTitle}>Terms And Conditions</Text>
            <View style={styles.displayUnderline} />
            <Text style={styles.eventDetailText}>
              {eventDetails.terms_and_conditions}
            </Text>

            <Text style={styles.eventSectionTitle}>Organizers</Text>
            <View style={styles.displayUnderline} />
            <Text style={[styles.eventDetailText, { fontWeight: "bold" }]}>
              {eventDetails.username}
            </Text>
            <Text style={styles.eventDetailText}>
              {eventDetails.organizer_details}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.eventButton}
            onPress={() =>
              navigation.navigate("CoEventParticipants", {
                eventId: eventDetails.id,
              })
            }
          >
            <Text style={styles.eventButtonText}>View Participants</Text>
          </TouchableOpacity>
          <View style={[{ marginTop: -14 }]}></View>

          <TouchableOpacity
            style={[styles.eventButton, { backgroundColor: "#0818A8" }]} // Different color to distinguish the Edit button
            onPress={() =>
              navigation.navigate("CoCreateNEditEvents", {
                eventId: eventDetails.id, // Pass eventId to the edit screen
              })
            }
          >
            <Text style={styles.eventButtonText}>Edit Event</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {/* Navigation Bar */}
      <CoNavigationBar navigation={navigation} />
    </ImageBackground>
  );
};

export default CoSocialEventDetails;
