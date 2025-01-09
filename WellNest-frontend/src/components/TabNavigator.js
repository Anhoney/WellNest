import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const TabNavigator = ({ activeTab, onTabChange }) => {
  return (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        style={[styles.tab, activeTab === "opportunities" && styles.activeTab]}
        onPress={() => onTabChange("opportunities")}
      >
        <Text style={styles.tabText}>Opportunities</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === "upcoming" && styles.activeTab]}
        onPress={() => onTabChange("upcoming")}
      >
        <Text style={styles.tabText}>Upcoming Opportunities</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === "past" && styles.activeTab]}
        onPress={() => onTabChange("past")}
      >
        <Text style={styles.tabText}>Past Opportunities</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
    marginTop: -380,
  },
  tab: {
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#000",
  },
  tabText: {
    // fontSize: 16,
    // fontWeight: "bold",
    fontSize: 14, // Adjust the font size as necessary
    textAlign: "center",
  },
  tabStyle: {
    paddingHorizontal: 12, // Add horizontal padding
    flex: 1, // Ensure tabs take equal space
    justifyContent: "center",
    alignItems: "center",
  },
  tabTextStyle: {
    fontSize: 12, // Adjust the font size as necessary
    textAlign: "center",
  },
});

export default TabNavigator;
