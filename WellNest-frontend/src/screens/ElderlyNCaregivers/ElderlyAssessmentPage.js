// ElderlyAssessmentPage.js
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import API_BASE_URL from "../../../config/config";
import NavigationBar from "../../components/NavigationBar";
import styles from "../../components/styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserIdFromToken } from "../../../services/authService";

const EmptyAssessment = () => (
  <View style={[{ marginTop: 100 }, styles.emptyFavoritesContainer]}>
    <Image
      source={require("../../../assets/NothingDog.png")} // Replace with empty state image
      style={styles.emptyFavoritesImage}
    />
    <Text style={styles.noDataText}>No assessments available.</Text>
  </View>
);

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
    if (assessments.length === 0) {
      return <EmptyAssessment />;
    }
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
    if (history.length === 0) {
      return <EmptyAssessment />;
    }
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

  const handleSearch = () => {
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

      <View style={[{ marginLeft: -10 }, styles.userInfo]}>
        <Text style={[{ marginLeft: -35 }, styles.userName]}>
          {userData.name || "User"}
        </Text>
        {/* <Text style={[styles.userAgeNGender, { marginTop: -15 }]}> */}
        <Text style={[{ marginBottom: -100 }, styles.userAgeNGender]}>
          Gender: {userData.gender || "N/A"}
        </Text>
        <Text style={[styles.userAgeNGender]}>
          {/* <Text style={[styles.userAgeNGender, { marginTop: -15 }]}> */}
          Age: {userData.age || "N/A"} Years Old
        </Text>
      </View>

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
        <View style={[{ marginTop: 15 }]}></View>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : selectedTab === "Test" ? (
          <ScrollView>{renderAssessments()}</ScrollView>
        ) : (
          <ScrollView>{renderHistory()}</ScrollView>
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

export default ElderlyAssessmentPage;
