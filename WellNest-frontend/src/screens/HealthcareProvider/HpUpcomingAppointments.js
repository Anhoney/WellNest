// HpUpcomingAppointments.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  ImageBackground,
  Image,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../../../config/config";
import axios from "axios";
import { getUserIdFromToken } from "../../../services/authService";
import Ionicons from "react-native-vector-icons/Ionicons";
import HpNavigationBar from "../../components/HpNavigationBar"; // Import your custom navigation bar component
import styles from "../../components/styles"; // Import shared styles
import * as Calendar from "expo-calendar";

const HpUpcomingAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      fetchUpcomingAppointments();
    }, [])
  );

  useEffect(() => {
    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === "granted") {
        const calendars = await Calendar.getCalendarsAsync(
          Calendar.EntityTypes.EVENT
        );

        const expoCalendarIds = calendars
          .filter((calendar) => calendar.title === "Expo Calendar")
          .map((calendar) => calendar.id);
      }
    })();
  }, []);

  async function getDefaultCalendarSource() {
    const defaultCalendar = await Calendar.getDefaultCalendarAsync();
    return defaultCalendar.source;
  }

  async function createCalendar() {
    const defaultCalendarSource = await getDefaultCalendarSource();
    const newCalendarID = await Calendar.createCalendarAsync({
      title: "Expo Calendar",
      color: "blue",
      entityType: Calendar.EntityTypes.EVENT,
      sourceId: defaultCalendarSource.id,
      source: defaultCalendarSource,
      name: "internalCalendarName",
      ownerAccount: "personal",
      accessLevel: Calendar.CalendarAccessLevel.OWNER,
    });
  }

  const setReminder = async (app_date, app_time, u_id) => {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status !== "granted") {
      console.log("Calendar permission not granted");
      return;
    }

    const calendars = await Calendar.getCalendarsAsync(
      Calendar.EntityTypes.EVENT
    );
    const expoCalendar = calendars.find(
      (calendar) => calendar.title === "Expo Calendar"
    );

    let calendarId;

    if (expoCalendar) {
      calendarId = expoCalendar.id;
    } else {
      const defaultCalendarSource = await Calendar.getDefaultCalendarAsync();
      calendarId = await Calendar.createCalendarAsync({
        title: "Expo Calendar",
        color: "blue",
        entityType: Calendar.EntityTypes.EVENT,
        sourceId: defaultCalendarSource.id,
        source: defaultCalendarSource,
        name: "internalCalendarName",
        ownerAccount: "personal",
        accessLevel: Calendar.CalendarAccessLevel.OWNER,
      });
    }

    // Parse the appointment date and time
    try {
      // Combine date and time, then parse into a 24-hour ISO format
      const [time, meridian] = app_time.split(" ");
      const [hours, minutes] = time.split(":").map(Number);
      const adjustedHours =
        meridian === "PM" && hours < 12
          ? hours + 12
          : hours === 12 && meridian === "AM"
          ? 0
          : hours;

      const parsedDate = new Date(
        `${app_date}T${String(adjustedHours).padStart(2, "0")}:${String(
          minutes
        ).padStart(2, "0")}:00`
      );

      // Check if the parsed date is valid
      if (isNaN(parsedDate.getTime())) {
        throw new RangeError(`Invalid Date: ${app_date}T${app_time}`);
      }

      // Create the calendar event
      await Calendar.createEventAsync(calendarId, {
        title: "WellNest Physical Appointment Reminder",
        startDate: parsedDate,
        endDate: new Date(parsedDate.getTime() + 60 * 60 * 1000), // Default 60 minutes duration
        timeZone: "GMT",
        alarms: [{ relativeOffset: -60 }], // Alert 1 hour before
      });
    } catch (error) {
      console.error("Error creating reminder:", error.message);
    }
  };

  const fetchUpcomingAppointments = async () => {
    try {
      const hpId = await getUserIdFromToken(); // Get healthcare provider ID

      if (!hpId) {
        Alert.alert("Error", "Unable to fetch user information.");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/getUpcomingAppointment/${hpId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch appointments.");
      }

      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      Alert.alert("Error", "Failed to fetch appointments.");
    } finally {
      setLoading(false);
    }
  };

  const approveAppointment = async (
    appointmentId,
    app_date,
    app_time,
    u_id
  ) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/appointments/approve/${appointmentId}`,
        { method: "PUT" }
      );
      if (!response.ok) {
        throw new Error("Failed to approve appointment.");
      }

      const data = await response.json();
      await setReminder(app_date, app_time, u_id); // Set the reminder
      Alert.alert("Success", "Appointment approved successfully.");
      fetchUpcomingAppointments(); // Refresh the list
    } catch (error) {
      console.error("Error approving appointment:", error);
      Alert.alert("Error", "Failed to approve appointment.");
    }
  };

  const renderAppointment = ({ item }) => {
    let imageUri = item.profile_image
      ? item.profile_image // Base64 string returned from the backend
      : "https://via.placeholder.com/150";

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate("HpUpcomingAppointmentDetails", {
            hp_app_id: item.hp_app_id,
          })
        }
      >
        <Image source={{ uri: imageUri }} style={styles.doctorImage} />
        <View style={styles.doctorInfo}>
          <Text style={styles.doctorName}>{item.full_name}</Text>
          <Text style={styles.details}>Date: {item.app_date}</Text>
          <Text style={styles.details}>Time: {item.app_time}</Text>
          <Text style={styles.details}>Patient: {item.who_will_see}</Text>
          <Text style={styles.details}>Status: {item.app_status}</Text>

          {item.app_status === "pending" && (
            <TouchableOpacity
              style={styles.approveButton}
              onPress={() =>
                approveAppointment(
                  item.hp_app_id,
                  item.app_date,
                  item.app_time,
                  item.u_id
                )
              }
            >
              <View style={styles.statusContainer}>
                <Ionicons name="checkmark-circle" size={24} color="green" />
                <Text style={styles.approveText}>Approve</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (appointments.length === 0) {
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
          <Text style={styles.hpTitle}>Upcoming Appointments </Text>
        </View>

        <View style={styles.centerContent}>
          <Image
            source={require("../../../assets/NothingDog.png")}
            style={styles.noDataImage}
          />
          <Text style={styles.noDataText}>No Upcoming Appointments</Text>
        </View>
      </ImageBackground>
    );
  }

  return (
    <View style={{ flex: 1 }}>
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
            Upcoming Physical {"\n"}Appointments{" "}
          </Text>
        </View>
        <Text>{"/n"}</Text>
        <View style={styles.singleUnderline}></View>
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <FlatList
            data={appointments}
            keyExtractor={(item) => item.hp_app_id.toString()}
            renderItem={renderAppointment}
            contentContainerStyle={styles.hpContainer}
            ListEmptyComponent={<Text>No upcoming appointments found.</Text>}
          />
        )}
        <HpNavigationBar navigation={navigation} />
      </ImageBackground>
    </View>
  );
};

export default HpUpcomingAppointments;
