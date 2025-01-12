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
const defaultPhoto = require("../../../assets/elderlyOpportunityPhoto.webp");

const CoOpportunityDetails = () => {
  const [opportunityDetails, setOpportunityDetails] = useState(null);
  const route = useRoute(); // Get route params
  const navigation = useNavigation();
  const { opportunityId } = route.params; // Assume opportunityId is passed as a param

  useFocusEffect(
    React.useCallback(() => {
      fetchOpportunityDetails();
    }, [])
  );

  const fetchOpportunityDetails = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        alert("No token found. Please log in.");
        return;
      }
      const response = await fetch(
        `${API_BASE_URL}/single/opportunity/${opportunityId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Use your actual token
          },
        }
      );
      const data = await response.json();
      setOpportunityDetails(data);
    } catch (error) {
      console.error("Failed to fetch opportunity details:", error);
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

  if (!opportunityDetails) {
    return <Text>Loading opportunity details...</Text>;
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
        <Text style={styles.hpTitle}>{opportunityDetails.title}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollView}>
        <Image
          source={
            opportunityDetails.photo
              ? { uri: opportunityDetails.photo }
              : defaultPhoto
          }
          style={styles.opportunityImage}
        />
        <View style={styles.hpContainer}>
          <View style={styles.opportunityDetailsCard}>
            <View style={styles.opportunityRow}>
              <Text style={styles.opportunityCardTitle}>
                {opportunityDetails.title}
              </Text>
              <Text style={styles.opportunityPrice}>
                {formatFees(opportunityDetails.fees)}
              </Text>
            </View>
            <View style={styles.displayUnderline} />
            <Text style={styles.opportunitySectionTitle}>Details</Text>
            <View style={styles.displayUnderline} />
            <Text style={styles.opportunityDetailText}>
              Location: {"\n"}
              {opportunityDetails.location}
              {"\n"}
            </Text>
            <Text style={styles.opportunityDetailText}>
              Date: {"\n"}
              {opportunityDetails.opportunity_date}
              {"\n"}
            </Text>
            <Text style={styles.opportunityDetailText}>
              Time: {"\n"}
              {opportunityDetails.opportunity_time}
              {"\n"}
            </Text>
            <Text style={styles.opportunityDetailText}>
              Registration Due: {"\n"}
              {formatDate(opportunityDetails.registration_due)}
              {"\n"}
            </Text>
            <Text style={styles.opportunityDetailText}>
              Capacity: {"\n"}
              {opportunityDetails.capacity || "N/A"}
              {"\n"}
            </Text>

            <Text style={styles.opportunitySectionTitle}>
              Terms And Conditions
            </Text>
            <View style={styles.displayUnderline} />
            <Text style={styles.opportunityDetailText}>
              {opportunityDetails.terms_and_conditions}
            </Text>

            <Text style={styles.opportunitySectionTitle}>Organizers</Text>
            <View style={styles.displayUnderline} />
            <Text
              style={[styles.opportunityDetailText, { fontWeight: "bold" }]}
            >
              {opportunityDetails.username}
            </Text>
            <Text style={styles.opportunityDetailText}>
              {opportunityDetails.organizer_details}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.opportunityButton}
            onPress={() =>
              navigation.navigate("CoOpportunityParticipants", {
                opportunityId: opportunityDetails.id,
              })
            }
          >
            <Text style={styles.opportunityButtonText}>View Participants</Text>
          </TouchableOpacity>
          <View style={[{ marginTop: -14 }]}></View>

          <TouchableOpacity
            style={[styles.opportunityButton, { backgroundColor: "#0818A8" }]} // Different color to distinguish the Edit button
            onPress={() =>
              navigation.navigate("CoCreateNEditOpportunity", {
                opportunityId: opportunityDetails.id, // Pass opportunityId to the edit screen
              })
            }
          >
            <Text style={styles.opportunityButtonText}>Edit Opportunity</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {/* Navigation Bar */}
      <CoNavigationBar navigation={navigation} />
    </ImageBackground>
  );
};

export default CoOpportunityDetails;
