import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TabBarIOS,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import API_BASE_URL from "../../../config/config";
import NavigationBar from "../../components/NavigationBar";
import styles from "../../components/styles";

const ElderlyAssessmentPage = () => {
  const [userData, setUserData] = useState({ name: "", gender: "", age: "" });
  const [selectedTab, setSelectedTab] = useState("Test");
  const navigation = useNavigation();

  useEffect(() => {
    // Fetch user data from the database
    const fetchUserData = async () => {
      try {
        const response = await axios.get("YOUR_API_ENDPOINT");
        const data = response.data;
        setUserData({
          name: data.name,
          gender: data.gender,
          age: data.age,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const startAssessment = (type) => {
    navigation.navigate("AssessmentPage", { type });
  };

  return (
    <ImageBackground
      source={require("../../../assets/Assessment.png")}
      style={styles.background}
    >
      <View style={styles.noBgSmallHeaderContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Assessment</Text>
      </View>

      <View style={styles.userInfo}>
        <Text style={styles.userName}>
          Joe Doe
          {/* {userData.name} */}
        </Text>
        <Text>Gender: {userData.gender}</Text>
        <Text>Age: {userData.age} Years</Text>
      </View>

      <View style={styles.assessmentContainer}>
        <View style={styles.tabs}>
          <TouchableOpacity
            onPress={() => setSelectedTab("Test")}
            style={[styles.tab, selectedTab === "Test" && styles.activeTab]}
          >
            <Text style={styles.tabText}>Test</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedTab("History")}
            style={[styles.tab, selectedTab === "History" && styles.activeTab]}
          >
            <Text style={styles.tabText}>History Result</Text>
          </TouchableOpacity>
        </View>

        {selectedTab === "Test" ? (
          <ScrollView contentContainerStyle={styles.assessmentList}>
            <AssessmentItem
              title="Activities of Daily Living (ADLs)"
              // imageSrc={require("./path_to_ADLs_image.png")}
              onPress={() => startAssessment("ADLs")}
            />
            <AssessmentItem
              title="Instrumental Activities of Daily Living (IADLs)"
              // imageSrc={require("./path_to_IADLs_image.png")}
              onPress={() => startAssessment("IADLs")}
            />
            <AssessmentItem
              title="Social and Emotional Wellbeing Assessment"
              // imageSrc={require("./path_to_Wellbeing_image.png")}
              onPress={() => startAssessment("Wellbeing")}
            />
          </ScrollView>
        ) : (
          <View style={styles.historyContainer}>
            <Text>History Results go here</Text>
            {/* Code to display history results fetched from the database */}
          </View>
        )}
      </View>
      <NavigationBar navigation={navigation} activePage="" />
    </ImageBackground>
  );
};

const AssessmentItem = ({ title, imageSrc, onPress }) => (
  <View style={styles.assessmentItem}>
    <Image source={imageSrc} style={styles.assessmentImage} />
    <Text style={styles.assessmentTitle}>{title}</Text>
    <TouchableOpacity onPress={onPress} style={styles.startButton}>
      <Text style={styles.startButtonText}>Start Assessment</Text>
    </TouchableOpacity>
  </View>
);

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#f2f2f2" },
//   header: { padding: 20, alignItems: "center", backgroundColor: "#fff" },
//   title: { fontSize: 20, fontWeight: "bold" },
//   userInfo: { padding: 20, alignItems: "center" },
//   userName: { fontSize: 22, fontWeight: "bold" },
//   tabs: { flexDirection: "row", justifyContent: "center", marginVertical: 10 },
//   tab: { padding: 10, borderBottomWidth: 2, borderBottomColor: "transparent" },
//   activeTab: { borderBottomColor: "#000" },
//   tabText: { fontSize: 16 },
//   assessmentList: { paddingHorizontal: 20, paddingVertical: 10 },
//   assessmentItem: {
//     backgroundColor: "#fff",
//     borderRadius: 10,
//     padding: 15,
//     marginBottom: 15,
//     alignItems: "center",
//   },
//   assessmentImage: { width: 50, height: 50, marginBottom: 10 },
//   assessmentTitle: { fontSize: 16, marginBottom: 10, textAlign: "center" },
//   startButton: {
//     backgroundColor: "#FFA500",
//     borderRadius: 5,
//     paddingHorizontal: 20,
//     paddingVertical: 8,
//   },
//   startButtonText: { color: "#fff", fontWeight: "bold" },
//   historyContainer: { padding: 20 },
// });

export default ElderlyAssessmentPage;
