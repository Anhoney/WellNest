// CategoryDoctorsScreen.js
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ImageBackground,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import styles from "../../components/styles";
import axios from "axios";
import { FontAwesome } from "@expo/vector-icons"; // Import FontAwesome for heart icon
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import API_BASE_URL from "../../../config/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NavigationBar from "../../components/NavigationBar"; // Import here

const CategoryDoctorsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { category, searchParams } = route.params || {}; // Get category or search parameters
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true); // Handle loading state
  // Manage favorites outside render function
  const [favorites, setFavorites] = useState([]);
  const selectedDate = searchParams?.date; // Extract the date

  // Fetch doctors and favorites when the screen is focused
  const fetchDoctors = async () => {
    setLoading(true);
    try {
      let response;
      if (category) {
        // Fetch doctors by category
        response = await axios.get(`${API_BASE_URL}/searchByCategory`, {
          params: { category },
        });
      } else if (searchParams) {
        // Fetch doctors by search parameters
        response = await axios.post(`${API_BASE_URL}/search`, searchParams);
      }
      setDoctors(response.data || []);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/getFavorites`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const favoriteIds = response.data.map((doctor) => doctor.availability_id); // Adjust based on your API response
      setFavorites(favoriteIds);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  // Polling function to keep data updated
  const pollData = useCallback(() => {
    fetchDoctors();
    fetchFavorites();
  }, []);

  useFocusEffect(
    useCallback(() => {
      pollData(); // Initial fetch

      // Set up polling to fetch data every 10 seconds
      const intervalId = setInterval(pollData, 10000); // Poll every 10 seconds

      // Cleanup function to clear the interval
      return () => clearInterval(intervalId);
    }, [pollData])
  );

  const toggleFavorite = async (doctorId) => {
    try {
      // Retrieve the token from AsyncStorage
      const token = await AsyncStorage.getItem("token"); // Replace 'token' with the actual key  used to store the token

      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await axios.post(
        `${API_BASE_URL}/toggleFavorite`,
        {
          availabilityId: doctorId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      );
      if (response.data.success) {
        setFavorites((prevFavorites) => {
          const newFavorites = prevFavorites.includes(doctorId)
            ? prevFavorites.filter((id) => id !== doctorId)
            : [...prevFavorites, doctorId];

          // Store the updated favorites array in AsyncStorage
          AsyncStorage.setItem("favorites", JSON.stringify(newFavorites)); // Store as a single key
          return newFavorites;
        });
      } else {
        console.error("Failed to update favorite status.");
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const renderDoctorCard = ({ item }) => {
    // Determine if doctor is a favorite
    const isFavorite = favorites.includes(item.id);

    let imageUri = item.profile_image
      ? item.profile_image // Base64 string returned from the backend
      : "https://via.placeholder.com/150";

    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("DoctorDetails", {
            doctorId: item.id,
            selectedDate: selectedDate, // Pass the selectedDate here
          })
        }
      >
        <View style={styles.doctorCard}>
          <Image source={{ uri: imageUri }} style={styles.doctorImage} />
          <View style={styles.doctorInfo}>
            <Text style={styles.doctorName}>{item.username}</Text>
            <Text style={styles.doctorCategory}>{item.category}</Text>
            <Text style={styles.doctorCategory}>Location: {item.location}</Text>
            <Text style={styles.doctorRating}>⭐ {item.rating || "N/A"}</Text>
          </View>
          <TouchableOpacity
            onPress={() => toggleFavorite(item.id)}
            style={styles.favoriteIcon}
          >
            <FontAwesome
              name={isFavorite ? "heart" : "heart-o"}
              size={24}
              color={isFavorite ? "red" : "gray"}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ImageBackground
      source={require("../../../assets/PlainGrey.png")}
      style={styles.background}
    >
      <View style={styles.smallHeaderContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.hpTitle}>
          {category ? `Doctors for \n ${category}` : "Search Results"}
        </Text>
      </View>
      <Text style={{ marginBottom: 20 }}> </Text>
      <View style={styles.hpAcontainer}>
        {loading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : (
          <FlatList
            data={doctors}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderDoctorCard}
            ListEmptyComponent={
              <Text style={styles.noDataText}>
                No doctors available{" "}
                {category ? `for ${category}` : "matching your search"}.
              </Text>
            }
          />
        )}
      </View>
      <NavigationBar navigation={navigation} activePage="" />
    </ImageBackground>
  );
};

export default CategoryDoctorsScreen;
