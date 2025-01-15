import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import axios from "axios";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import API_BASE_URL from "../../../config/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserIdFromToken } from "../../../services/authService";
import styles from "../../components/styles";
import { Ionicons } from "@expo/vector-icons";
import NavigationBar from "../../components/NavigationBar";

const CarePlanScreen = () => {
  const [carePlans, setCarePlans] = useState([]);
  const navigation = useNavigation();
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState({ name: "", gender: "", age: "" });

  useFocusEffect(
    React.useCallback(() => {
      const fetchUserId = async () => {
        const id = await getUserIdFromToken();
        setUserId(id);
      };

      fetchUserId();
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
  //   useEffect(() => {
  //     if (userId) {
  //       fetchCarePlans(userId);
  //       fetchUserData(userId); // Pass userId to the function
  //     }
  //   }, [userId]); // Dependency array includes userId

  const fetchCarePlans = async () => {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      alert("No token found. Please log in.");
      return;
    }

    try {
      console.log(userId);
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
        onPress={() => navigation.navigate("EditCarePlan", { carePlan: item })}
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
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{userData.name || "User"}</Text>
        {/* <Text style={[styles.userAgeNGender, { marginTop: -15 }]}> */}
        <Text style={[styles.userAgeNGender]}>
          Gender: {userData.gender || "N/A"}
        </Text>
        <Text style={[styles.userAgeNGender]}>
          {/* <Text style={[styles.userAgeNGender, { marginTop: -15 }]}> */}
          Age: {userData.age || "N/A"} Years Old
        </Text>
        {/* </View> */}
      </View>

      <View style={styles.cpContainer}>
        <FlatList
          data={carePlans}
          keyExtractor={(item) =>
            item.id ? item.id.toString() : Math.random().toString()
          } // Provide a fallback
          //   keyExtractor={(item) => item.id.toString()}
          renderItem={renderCarePlan}
          ListEmptyComponent={renderEmptyComponent}
          contentContainerStyle={styles.cpContentContainer}
        />
        <TouchableOpacity
          style={styles.cpAddButton}
          onPress={() => navigation.navigate("EditCarePlan")}
        >
          <Text style={styles.cpAddButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      <NavigationBar navigation={navigation} activePage="" />
    </ImageBackground>
  );
};

export default CarePlanScreen;

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20 },
//   card: {
//     backgroundColor: "#f9f9f9",
//     padding: 15,
//     marginBottom: 10,
//     borderRadius: 8,
//   },
//   title: { fontSize: 18, fontWeight: "bold" },
//   edit: { color: "blue", marginTop: 10 },
//   addButton: {
//     backgroundColor: "#FFA500",
//     position: "absolute",
//     right: 20,
//     bottom: 20,
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   addButtonText: { fontSize: 30, color: "white" },
// });
