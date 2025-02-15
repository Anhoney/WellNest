// HpAppointmentManagementPage.js
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
import HpNavigationBar from "../../components/HpNavigationBar";

const HpAppointmentManagementPage = ({}) => {
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
        <Text style={styles.hpTitle}>Appointment {"\n"} Management</Text>
      </View>

      <View style={styles.pageContainer}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <TouchableOpacity
            style={styles.hpButton}
            onPress={() => navigation.navigate("HpAppointmentCreationPage")}
          >
            <Text style={styles.hpButtonText}>
              Create or Edit Physical Appointments
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.hpButton}
            onPress={() => navigation.navigate("HpUpcomingAppointments")}
          >
            <Text style={styles.hpButtonText}>
              Upcoming Physical Appointments Schedule
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.hpButton}
            onPress={() => navigation.navigate("HpPastAppointments")}
          >
            <Text style={styles.hpButtonText}>
              Past Physical Appointments Schedule
            </Text>
          </TouchableOpacity>
        </ScrollView>
        {/* Navigation Bar */}
        <HpNavigationBar navigation={navigation} />
      </View>
    </ImageBackground>
  );
};

export default HpAppointmentManagementPage;
