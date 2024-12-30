//MedicationReminderPage.js
import React, { useState } from "react";
import {
  ImageBackground,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import NavigationBar from "../../components/NavigationBar";
import styles from "../../components/styles";
import { useNavigation } from "@react-navigation/native";

const medications = [
  {
    id: 1,
    name: "Oxycodone",
    time: "10:00 AM",
    status: "Completed",
    foodRelation: "After Eating",
  },
  {
    id: 2,
    name: "Naloxone",
    time: "04:00 PM",
    status: "Skipped",
  },
  {
    id: 3,
    name: "Oxycodone",
    time: "10:00 AM",
    status: "Pending",
    foodRelation: "After Eating",
  },
];

const MedicationReminderPage = () => {
  const [medicationList, setMedicationList] = useState(medications);
  const navigation = useNavigation();

  const handleMarkAsDone = (id) => {
    const updatedList = medicationList.map((med) =>
      med.id === id ? { ...med, status: "Completed" } : med
    );
    setMedicationList(updatedList);
  };

  const renderMedicationItem = ({ item }) => (
    <TouchableOpacity
      style={{
        backgroundColor: "#FFF",
        padding: 15,
        borderRadius: 10,
        marginVertical: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
      }}
      onPress={() => {
        Alert.alert("Edit/Delete", `Options for ${item.name}`);
        // Navigate to a detailed view or edit/delete functionality
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Ionicons name="medkit-outline" size={24} color="#FF9800" />
        <View style={{ marginLeft: 10 }}>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>{item.name}</Text>
          <Text style={{ fontSize: 14, color: "#888" }}>{item.time}</Text>
          {item.foodRelation && (
            <Text style={{ fontSize: 14, color: "#888" }}>
              {item.foodRelation}
            </Text>
          )}
          <Text style={{ fontSize: 14, color: "#4CAF50" }}>{item.status}</Text>
        </View>
      </View>
      {item.status === "Pending" && (
        <TouchableOpacity
          style={{
            backgroundColor: "#FF9800",
            padding: 10,
            borderRadius: 5,
          }}
          onPress={() => handleMarkAsDone(item.id)}
        >
          <Text style={{ color: "#FFF", fontSize: 14 }}>Done</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require("../../../assets/PlainGrey.png")}
      style={[styles.background, { flex: 1 }]}
    >
      {/* Title Section */}
      <View style={styles.smallHeaderContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Medication Reminder</Text>
      </View>

      {/* Plan Summary */}
      <View
        style={{
          marginTop: 50,
          backgroundColor: "#FFEB3B",
          padding: 15,
          margin: 10,
          borderRadius: 10,
          marginBottom: 50,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          Your plan for today
        </Text>
        <Text style={{ fontSize: 18, color: "#555" }}>
          {medicationList.filter((med) => med.status === "Completed").length} of{" "}
          {medicationList.length} completed
        </Text>
      </View>

      {/* Daily Review */}
      <View style={{ flex: 1, paddingHorizontal: 15 }}>
        <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 10 }}>
          Daily Review
        </Text>
        <FlatList
          data={medicationList}
          renderItem={renderMedicationItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Add Reminder Button
      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 100,
          right: 20,
          backgroundColor: "#FF9800",
          width: 60,
          height: 60,
          borderRadius: 30,
          justifyContent: "center",
          alignItems: "center",
          elevation: 5,
        }}
        onPress={() => navigation.navigate("AddReminder")}
      >
        <Text>Add Reminder</Text>
        <Ionicons name="add" size={30} color="#FFF" />
      </TouchableOpacity> */}

      {/* Add Reminder Button */}
      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 100,
          right: 20,
          backgroundColor: "#FF9800",
          paddingHorizontal: 20,
          paddingVertical: 15,
          borderRadius: 30,
          flexDirection: "row",
          alignItems: "center",
          elevation: 5,
        }}
        onPress={() => navigation.navigate("AddReminder")}
      >
        <Text
          style={{
            color: "#FFF",
            fontSize: 16,
            fontWeight: "bold",
            marginRight: 10,
          }}
        >
          Add Reminder
        </Text>
        <Ionicons name="add" size={24} color="#FFF" />
      </TouchableOpacity>

      {/* Bottom Navigation Bar */}
      <NavigationBar navigation={navigation} activePage="" />
    </ImageBackground>
  );
};

export default MedicationReminderPage;
