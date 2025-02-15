// CarePlanScreen.js
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ImageBackground,
} from "react-native";
import axios from "axios";
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";
import API_BASE_URL from "../../../config/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserIdFromToken } from "../../../services/authService";
import styles from "../../components/styles";
import { Ionicons } from "@expo/vector-icons";
import NavigationBar from "../../components/NavigationBar";

const CarePlanScreen = () => {
  const [carePlans, setCarePlans] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params;
  const [writerId, setWriterId] = useState(null);
  const [userData, setUserData] = useState({ name: "", gender: "", age: "" });

  useFocusEffect(
    React.useCallback(() => {
      const fetchWriterId = async () => {
        const id = await getUserIdFromToken();
        setWriterId(id);
      };

      fetchWriterId();
    }, [])
  );

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        alert("No token found. Please log in.");
        return;
      }
      const response = await axios.get(`${API_BASE_URL}/profile/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

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
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        if (userId) {
          await fetchCarePlans(userId);
          await fetchUserData(userId); // Pass userId to the function
        }
      };

      fetchData();

      // Optionally return a cleanup function if needed
      return () => {
        // Cleanup code if necessary
      };
    }, [userId]) // Dependency array includes userId
  );

  const fetchCarePlans = async () => {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      alert("No token found. Please log in.");
      return;
    }

    try {
      const response = await axios.get(
        `${API_BASE_URL}/careplan/${userId}`,

        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCarePlans(response.data);
    } catch (error) {
      console.error("Error fetching care plans:", error);
    }
  };

  const renderCarePlan = ({ item }) => (
    <View style={styles.cpCard}>
      <Text style={styles.cpTitle}>{item.title}</Text>
      <Text style={styles.cpText}>{item.plan}</Text>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("EditCarePlan", {
            carePlan: item,
          })
        }
      >
        <Text style={styles.cpEdit}>Edit</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmptyComponent = () => (
    <View style={styles.coEmptyContainer}>
      <Image
        source={require("../../../assets/SleepingCat.png")}
        style={styles.largeEmptyImage}
      />
      <Text style={styles.emptyText}>No Care Plan Yet.</Text>
    </View>
  );

  return (
    <ImageBackground
      source={require("../../../assets/PlainGrey.png")}
      style={styles.background}
    >
      {/* Title Section with Back chevron-back */}
      <View style={styles.smallHeaderContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Care Plan</Text>
      </View>

      <View style={[{ marginTop: 15 }]}></View>
      <View style={[{ marginLeft: -10 }, styles.userInfo]}>
        <Text style={[{ marginLeft: -35 }, styles.userName]}>
          {userData.name || "User"}
        </Text>
        <Text style={[{ marginBottom: -100 }, styles.userAgeNGender]}>
          Gender: {userData.gender || "N/A"}
        </Text>
        <Text style={[styles.userAgeNGender]}>
          Age: {userData.age || "N/A"} Years Old
        </Text>
      </View>

      <View style={styles.cpContainer}>
        <FlatList
          data={carePlans}
          keyExtractor={(item) =>
            item.id ? item.id.toString() : Math.random().toString()
          } // Provide a fallback
          renderItem={renderCarePlan}
          ListEmptyComponent={renderEmptyComponent}
          contentContainerStyle={styles.cpContentContainer}
        />
        <TouchableOpacity
          style={styles.cpAddButton}
          onPress={() =>
            navigation.navigate("EditCarePlan", { currentPlanUserId: userId })
          }
        >
          <Text style={styles.cpAddButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      <NavigationBar navigation={navigation} activePage="" />
    </ImageBackground>
  );
};

export default CarePlanScreen;
