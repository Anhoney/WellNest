//Notification.js
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";
import styles from "../../components/styles"; // Import shared styles
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import API_BASE_URL from "../../../config/config";
import { getUserIdFromToken } from "../../../services/authService";
import HpNavigationBar from "../../components/HpNavigationBar";

const HpNotification = () => {
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

  const fetchUserId = async () => {
    const userId = await getUserIdFromToken();
    // console.log("userId:", userId);
    if (userId) {
      setUserId(userId);
      fetchNotifications(userId); // Fetch notifications when userId is available
    }
  };

  const fetchNotifications = async (userId) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/notifications/${userId}`
      );
      setNotifications(response.data);
      const unread = response.data.filter((notif) => !notif.is_read).length;
      setUnreadCount(unread);
    } catch (error) {
      //   console.error("Error fetching notifications:", error);
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

  //   useEffect(() => {
  //     if (userId) {
  //       fetchNotifications();
  //     }
  //   }, [userId]);
  useEffect(() => {
    const interval = setInterval(() => {
      fetchUserId(); // Re-fetch userId to ensure notifications are up to date
      if (userId) {
        fetchNotifications(userId);
      }
    }, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, [userId]);

  //   useEffect(() => {
  //     const ws = new WebSocket("ws://localhost:8080"); // Connect to WebSocket server

  //     ws.onopen = () => {
  //       console.log("Connected to WebSocket server");
  //     };

  //     ws.onmessage = (event) => {
  //       const notification = JSON.parse(event.data);
  //       if (notification.userId === userId) {
  //         setNotifications((prevNotifications) => [
  //           ...prevNotifications,
  //           {
  //             notification_id: notification.id, // Assuming the notification has an ID
  //             message: notification.message,
  //             is_read: false,
  //             created_at: new Date(),
  //           },
  //         ]);
  //         setUnreadCount((prevCount) => prevCount + 1);
  //       }
  //     };

  //     ws.onclose = () => {
  //       console.log("Disconnected from WebSocket server");
  //     };

  //     return () => {
  //       ws.close(); // Clean up WebSocket connection on component unmount
  //     };
  //   }, [userId]);
  //   useEffect(() => {
  //     const ws = new WebSocket("ws://localhost:8080"); // Connect to WebSocket server

  //     ws.onopen = () => {
  //       console.log("Connected to WebSocket server");
  //     };

  //     ws.onmessage = (event) => {
  //       const notification = JSON.parse(event.data);
  //       if (notification.userId === userId) {
  //         setNotifications((prevNotifications) => [
  //           ...prevNotifications,
  //           {
  //             message: notification.message,
  //             is_read: false,
  //             created_at: new Date(),
  //           },
  //         ]);
  //         setUnreadCount((prevCount) => prevCount + 1);
  //       }
  //     };

  //     ws.onclose = () => {
  //       console.log("Disconnected from WebSocket server");
  //     };

  //     return () => {
  //       ws.close(); // Clean up WebSocket connection on component unmount
  //     };
  //   }, [userId]);

  return (
    <ImageBackground
      source={require("../../../assets/PlainGrey.png")}
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
        {/* <TouchableOpacity style={styles.iconContainer}>
          <Text style={styles.notificationIcon}>🔔</Text>
          {unreadCount > 0 && <View style={styles.redDot} />}
        </TouchableOpacity> */}

        <FlatList
          data={notifications}
          keyExtractor={(item) => item.notification_id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.notificationItem,
                !item.is_read && styles.unreadItem,
              ]}
              onPress={() => markAsRead([item.notification_id])}
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
      <HpNavigationBar navigation={navigation} activePage="HpNotification" />
    </ImageBackground>
  );
};

export default HpNotification;
