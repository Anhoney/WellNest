//NavigationBar.js
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import styles from "./styles";
import { useNotification } from "../../context/NotificationProvider";

const NavigationBar = ({ navigation, activePage }) => {
  const { unreadCount } = useNotification();

  const tabs = [
    { name: "MainPage", label: "Home", icon: "home-outline" },
    { name: "AppointmentHistory", label: "Schedule", icon: "calendar-outline" },
    { name: "Chat", label: "Chat", icon: "chatbubble-ellipses-outline" },
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
          onPress={() => navigation.navigate(tab.name)}
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
