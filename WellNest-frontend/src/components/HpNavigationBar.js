//HpNavigationBar.js
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import styles from "./styles"; // Assuming you have your styles.js setup
import { useNotification } from "../../context/NotificationProvider";

const HpNavigationBar = ({ navigation, activePage }) => {
  const { unreadCount } = useNotification();

  const tabs = [
    { name: "HealthcareProviderMainPage", label: "Home", icon: "home-outline" },
    { name: "Schedule", label: "Schedule", icon: "calendar-outline" },
    { name: "Chat", label: "Chat", icon: "chatbubble-ellipses-outline" },
    {
      name: "HpNotification",
      label: "Notification",
      icon: "notifications-outline",
    },
    { name: "HpProfilePage", label: "Account", icon: "person-outline" },
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
            {tab.name === "HpNotification" && unreadCount > 0 && (
              <View style={styles.redDot}>
                <Text style={styles.redDotText}>{unreadCount}</Text>
              </View>
            )}
          </View>
          {/* <Ionicons
            name={tab.icon}
            size={28}
            color={activePage === tab.name ? "#e67e22" : "#273746"}
          /> */}
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

export default HpNavigationBar;
