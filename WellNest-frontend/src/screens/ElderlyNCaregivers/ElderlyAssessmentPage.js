import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TabBarIOS,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/FontAwesome";
import API_BASE_URL from "../../../config/config";
import NavigationBar from "../../components/NavigationBar";
import styles from "../../components/styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserIdFromToken } from "../../../services/authService";

const ElderlyAssessmentPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [assessments, setAssessments] = useState([]);
  const [history, setHistory] = useState([]);
  const [userData, setUserData] = useState({ name: "", gender: "", age: "" });
  const [selectedTab, setSelectedTab] = useState("Test");
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      const fetchUserId = async () => {
        const id = await getUserIdFromToken();
        setUserId(id);
      };

      fetchUserId();
    }, [])
  );

  useFocusEffect(
    React.useCallback(() => {
      const fetchUserData = async () => {
        try {
          const token = await AsyncStorage.getItem("token");

          if (!token) {
            alert("No token found. Please log in.");
            return;
          }

          const decodedToken = await getUserIdFromToken();
          if (!decodedToken) {
            console.warn("Failed to retrieve userId.");
            return;
          }

          setUserId(decodedToken); // Set userId for future references if needed
          console.log("Fetching user data for user ID:", decodedToken);

          const response = await axios.get(
            `${API_BASE_URL}/profile/${decodedToken}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          const data = response.data;
          setUserData({
            name: data.username,
            gender: data.gender,
            age: data.age,
          });
        } catch (error) {
          console.error("Error fetching user data:", error.response || error);
        }
      };

      fetchUserData();
    }, [])
  );

  const fetchAssessments = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        alert("No token found. Please log in.");
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/user/allAssessments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAssessments(response.data);
    } catch (error) {
      console.error("Error fetching assessments:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAssessmentHistory = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        alert("No token found. Please log in.");
        return;
      }

      const response = await axios.get(
        `${API_BASE_URL}/assessments/history/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setHistory(response.data);
    } catch (error) {
      console.error("Error fetching assessment history:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchAssessments();
      if (userId) {
        fetchAssessmentHistory();
      }
    }, [userId])
  );

  const renderAssessments = () => {
    return assessments.map((assessment, index) => (
      <View key={index} style={styles.assessmentCard}>
        <Image
          source={
            assessment.photo
              ? { uri: assessment.photo } // Use the photo directly
              : require("../../../assets/DefaultAssessment.png")
          }
          style={styles.assessmentImage}
        />

        <View style={styles.assessmentDetails}>
          <Text style={styles.assessmentTitle}>{assessment.title}</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("TestAssessment", {
                assessmentId: assessment.assessment_id,
                type: "Test",
              })
            }
            style={styles.startButton}
          >
            <Text style={styles.startButtonText}>Start Assessment</Text>
          </TouchableOpacity>
        </View>
      </View>
    ));
  };

  const renderHistory = () => {
    return history.map((item, index) => (
      <View key={index} style={styles.historyCard}>
        <Image
          source={
            item.photo
              ? { uri: item.photo }
              : require("../../../assets/DefaultAssessment.png")
          }
          style={styles.historyImage}
        />
        <View style={styles.historyDetails}>
          <Text style={styles.historyTitle}>{item.title}</Text>
          <Text>Total Marks: {item.total_marks}</Text>
          <Text>Result: {item.overall_result || "N/A"}</Text>
          <Text>
            Date: {new Date(item.assessment_date).toLocaleDateString()}
          </Text>
        </View>
      </View>
    ));
  };

  const renderEmptyComponent = () => (
    <View style={styles.coEmptyContainer}>
      <Image
        source={require("../../../assets/NothingDog.png")}
        style={styles.emptyImage}
      />
      <Text style={styles.emptyText}>No Assessment.</Text>
    </View>
  );

  const handleSearch = () => {
    console.log("Search:", searchQuery);
    // Implement search functionality here
    fetchEvents(co_id, searchQuery);
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
      <View style={[{ marginTop: 15 }]}></View>
      <View style={styles.userInfo}>
        {/* <View style={styles.assessmentScoreContainer}> */}
        {/* <Text style={[styles.label]}> Scores Range</Text>
            <Text style={[styles.label, { marginLeft: 110 }]}>Results</Text> */}
        <Text style={styles.userName}>{userData.name || "User"}</Text>

        <Text style={styles.userAgeNGender}>
          Gender: {userData.gender || "N/A"}
        </Text>
        <Text style={styles.userAgeNGender}>
          Age: {userData.age || "N/A"} Years
        </Text>
        {/* </View> */}
      </View>

      {/* <View style={styles.coSearchContainer}>
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Icon name="search" size={20} color="white" />
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          // {styles.searchInput}
          placeholder="Search Event ..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View> */}
      <View style={[{ marginTop: -30 }]}></View>
      <View style={styles.assessmentContainer}>
        <View style={styles.tabs}>
          <TouchableOpacity
            onPress={() => {
              setSelectedTab("Test");
              fetchAssessments();
            }}
            style={[styles.tab, selectedTab === "Test" && styles.activeTab]}
          >
            <Text style={styles.tabText}>Test</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setSelectedTab("History");
              fetchAssessmentHistory();
            }}
            style={[styles.tab, selectedTab === "History" && styles.activeTab]}
          >
            <Text style={styles.tabText}>History Result</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : selectedTab === "Test" ? (
          <ScrollView>{renderAssessments()}</ScrollView>
        ) : (
          <ScrollView>{renderHistory()}</ScrollView>
          // <View style={styles.historyContainer}>
          //   <Text>History Results go here</Text>
          // </View>
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
