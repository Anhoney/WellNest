// Notification.js
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from "react-native";
import axios from "axios";
import styles from "../components/styles"; // Import shared styles
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import API_BASE_URL from "../../config/config";
import { getUserIdFromToken } from "../../services/authService";
import * as Calendar from "expo-calendar";

const Notifications = () => {
  // Accept route prop to determine user type
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true); // Loading state
  const [userId, setUserId] = useState(null);

  useFocusEffect(
    useCallback(() => {
      fetchUserId();
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

  const createOrGetCalendar = async () => {
    const calendars = await Calendar.getCalendarsAsync(
      Calendar.EntityTypes.EVENT
    );
    const expoCalendar = calendars.find(
      (calendar) => calendar.title === "Expo Calendar"
    );

    if (expoCalendar) {
      return expoCalendar.id;
    } else {
      const defaultCalendarSource = await getDefaultCalendarSource();
      const newCalendarId = await Calendar.createCalendarAsync({
        title: "Expo Calendar",
        color: "blue",
        entityType: Calendar.EntityTypes.EVENT,
        sourceId: defaultCalendarSource.id,
        source: defaultCalendarSource,
        name: "ExpoCalendar",
        ownerAccount: "personal",
        accessLevel: Calendar.CalendarAccessLevel.OWNER,
      });
      return newCalendarId;
    }
  };

  const addToCalendar = async (title, dateTime) => {
    try {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Calendar permissions are required.");
        return;
      }

      const calendarId = await createOrGetCalendar();
      const startDate = new Date(dateTime);
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1-hour event

      await Calendar.createEventAsync(calendarId, {
        title: title,
        startDate: startDate,
        endDate: endDate,
        timeZone: "GMT",
        alarms: [{ relativeOffset: -5 }], // 5 minutes before
        notes: "Reminder for your appointment.",
      });

      Alert.alert("Success", "Event added to your calendar!");
    } catch (error) {
      console.error("Error adding to calendar:", error);
    }
  };

  const fetchUserId = async () => {
    const userId = await getUserIdFromToken();

    if (userId) {
      setUserId(userId);
      fetchNotifications(userId); // Fetch notifications when userId is available
    }
  };

  const fetchNotifications = async (userId) => {
    // Accept userType

    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/notifications/${userId}`
      );
      setNotifications(response.data);
      const unread = response.data.filter((notif) => !notif.is_read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error(
        "Error fetching notifications:",
        error.response ? error.response.data : error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationIds) => {
    try {
      await axios.put(`${API_BASE_URL}/notifications/mark-as-read`, {
        notificationIds,
      });
      // Optimistically update the notifications state
      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) =>
          notificationIds.includes(notif.notification_id)
            ? { ...notif, is_read: true }
            : notif
        )
      );

      // Update the unread count
      setUnreadCount((prevCount) =>
        Math.max(prevCount - notificationIds.length, 0)
      );
      //   fetchNotifications(userId); // Refresh notifications after marking as read
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  const handleNotificationPress = async (item) => {
    await markAsRead([item.notification_id]); // Mark notification as read

    if (item.notification_type === "appointment_approved") {
      const title = "WellNest Appointment Scheduled"; // Customize as needed

      // Extract date and time from the message
      const dateTimeRegex =
        /at (\d{1,2}:\d{2} [APM]{2}) on (\d{1,2} [A-Z][a-z]+ \d{4})/;
      const match = item.message.match(dateTimeRegex);

      if (match) {
        const [_, timeString, dateString] = match; // Destructure the matched groups
        // Combine dateString and timeString to form a full date-time string
        const dateTimeString = `${dateString} ${timeString}`;

        // Parse the date-time string to a Date object
        const [day, month, year, time, period] = dateTimeString
          .match(/(\d{1,2}) ([A-Za-z]+) (\d{4}) (\d{1,2}:\d{2}) (AM|PM)/)
          .slice(1);
        const months = {
          Jan: 0,
          Feb: 1,
          Mar: 2,
          Apr: 3,
          May: 4,
          Jun: 5,
          Jul: 6,
          Aug: 7,
          Sep: 8,
          Oct: 9,
          Nov: 10,
          Dec: 11,
        };
        const hours = parseInt(time.split(":")[0]);
        const minutes = parseInt(time.split(":")[1]);
        const adjustedHours =
          period === "PM" && hours !== 12
            ? hours + 12
            : period === "AM" && hours === 12
            ? 0
            : hours;

        const eventDateTime = new Date(
          year,
          months[month],
          day,
          adjustedHours,
          minutes
        );

        if (isNaN(eventDateTime.getTime())) {
          Alert.alert("Error", "Invalid event date and time.");
          return;
        }

        const isoDateTime = eventDateTime.toISOString();

        addToCalendar(title, isoDateTime); // Create calendar event
      } else {
        Alert.alert(
          "Error",
          "Failed to extract date and time from the message."
        );
      }
    } else {
      Alert.alert("Notification", item.message);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchUserId(); // Re-fetch userId to ensure notifications are up to date
      if (userId) {
        fetchNotifications(userId);
      }
    }, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, [userId]);

  return (
    <ImageBackground
      source={require("../../assets/PlainGrey.png")}
      style={styles.background}
    >
      {/* Title Section with Back chevron-back */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Notification</Text>
      </View>
      <View style={styles.notiContainer}>
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.notification_id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.notificationItem,
                !item.is_read && styles.unreadItem,
              ]}
              onPress={() => handleNotificationPress(item)}
            >
              <Text style={styles.message}>{item.message}</Text>
              <Text style={styles.timestamp}>
                {new Date(item.created_at).toLocaleString()}
              </Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.noNotifications}>No notifications</Text>
          }
        />
      </View>
    </ImageBackground>
  );
};

export default Notifications;
