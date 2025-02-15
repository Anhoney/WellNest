// NavigationBar.js
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import styles from "./styles";
import { useNotification } from "../../context/NotificationProvider";
import { getUserIdFromToken } from "../../services/authService";
import { useNavigation, useRoute } from "@react-navigation/native";

const NavigationBar = ({ activePage }) => {
  const route = useRoute();
  const navigation = useNavigation();
  const { unreadCount } = useNotification();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const userId = await getUserIdFromToken();
      if (userId) {
        setUserId(userId);
      }
    };
    fetchUserId();
  }, []);

  const tabs = [
    { name: "MainPage", label: "Home", icon: "home-outline" },
    { name: "AppointmentHistory", label: "Schedule", icon: "calendar-outline" },
    { name: "GroupChat", label: "Chat", icon: "chatbubble-ellipses-outline" },
    {
      name: "Notifications",
      label: "Notification",
      icon: "notifications-outline",
    },
    { name: "ProfilePage", label: "Account", icon: "person-outline" },
  ];

  return (
    <View style={styles.navigationBar}>
      {tabs.map((tab, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => {
            if (tab.name === "AppointmentHistory") {
              navigation.navigate(tab.name, { userId }); // Pass userId as a route param
            } else {
              navigation.navigate(tab.name);
            }
          }}
          style={styles.tabButton}
        >
          <View style={{ position: "relative" }}>
            <Ionicons
              name={tab.icon}
              size={28}
              color={activePage === tab.name ? "#e67e22" : "#273746"}
            />
            {tab.name === "Notifications" && unreadCount > 0 && (
              <View style={styles.redDot}>
                <Text style={styles.redDotText}>{unreadCount}</Text>
              </View>
            )}
          </View>
          <Text
            style={[
              styles.navText,
              {
                color: activePage === tab.name ? "#e67e22" : "#273746",
                fontWeight: activePage === tab.name ? "bold" : "normal",
              },
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default NavigationBar;
