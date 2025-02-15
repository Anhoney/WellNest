// HpVAppManagementPage.js
import React, { useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import styles from "../../components/styles"; // Import shared styles
import { Ionicons } from "@expo/vector-icons"; // Import icons from Expo
import { useNavigation } from "@react-navigation/native";
import HpNavigationBar from "../../components/HpNavigationBar"; // Import your custom navigation bar component

const HpVAppManagementPage = ({}) => {
  const navigation = useNavigation();

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
        <Text style={styles.hpTitle}>Virtual Consultations </Text>
      </View>

      <View style={styles.pageContainer}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <TouchableOpacity
            style={styles.hpButton}
            onPress={() => navigation.navigate("HpCreateOrEditVApp")}
          >
            <Text style={styles.hpButtonText}>
              Create or Edit Virtual Consultations Appointments
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.hpButton}
            onPress={() => navigation.navigate("HpVUpcomingAppointments")}
          >
            <Text style={styles.hpButtonText}>
              Upcoming Virtual Consultations Schedule
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.hpButton}
            onPress={() => navigation.navigate("HpVPastAppointments")}
          >
            <Text style={styles.hpButtonText}>
              Past Virtual Consultations Schedule
            </Text>
          </TouchableOpacity>
        </ScrollView>
        {/* Navigation Bar */}
        <HpNavigationBar navigation={navigation} />
      </View>
    </ImageBackground>
  );
};

export default HpVAppManagementPage;
