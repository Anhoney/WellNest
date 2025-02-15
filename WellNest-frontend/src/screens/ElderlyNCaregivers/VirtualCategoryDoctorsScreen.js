// VirtualCategoryDoctorsScreen.js
import React, { useState } from "react";
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

const VirtualCategoryDoctorsScreen = () => {
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
        response = await axios.get(`${API_BASE_URL}/searchByVirtualCategory`, {
          params: { category },
        });
      } else if (searchParams) {
        // Fetch doctors by search parameters
        response = await axios.post(
          `${API_BASE_URL}/searchVirtualDoctors`,
          searchParams
        );
      }

      setDoctors(response.data || []);
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error fetching doctors:", error.response.data);
        console.error("Status code:", error.response.status);
        alert(
          `Error fetching doctors: ${error.response.status} - ${
            error.response.data.message || error.response.data
          }`
        );
      } else if (error.request) {
        // The request was made but no response was received
        console.error(
          "Error fetching doctors: No response received",
          error.request
        );
        alert("Error fetching doctors: No response received from the server.");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error fetching doctors:", error.message);
        alert("Error fetching doctors: " + error.message);
      }
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

      const response = await axios.get(`${API_BASE_URL}/virtualGetFavorites`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const favoriteIds = response.data.map(
        (doctor) => doctor.virtual_availability_id
      );
      setFavorites(favoriteIds);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  // Fetch doctors and favorites when the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      fetchDoctors();
      fetchFavorites();
    }, [category, searchParams]) // Dependencies for the effect
  );

  const toggleFavorite = async (availabilityId) => {
    try {
      // Retrieve the token from AsyncStorage
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await axios.post(
        `${API_BASE_URL}/virtualToggleFavorite`,
        {
          availabilityId: availabilityId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setFavorites((prevFavorites) => {
          const newFavorites = prevFavorites.includes(availabilityId)
            ? prevFavorites.filter((id) => id !== availabilityId)
            : [...prevFavorites, availabilityId];

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

  // Function to format service names
  const formatServiceName = (serviceName) => {
    // Add a space before each uppercase letter (except the first letter)
    return serviceName.replace(/([A-Z])/g, " $1").trim();
  };

  const renderDoctorCard = ({ item }) => {
    // Determine if doctor is a favorite
    const isFavorite = favorites.includes(item.virtual_availability_id);

    let imageUri = item.profile_image
      ? item.profile_image // Base64 string returned from the backend
      : "https://via.placeholder.com/150";

    // Parse the services_provide JSON string
    let services = [];
    try {
      services = JSON.parse(item.services_provide); // Parse the JSON string
    } catch (error) {
      console.error("Error parsing services_provide:", error);
      services = []; // Default to an empty array if parsing fails
    }
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("VirtualDoctorDetails", {
            doctorId: item.virtual_availability_id,
            selectedDate: selectedDate, // Pass the selectedDate here
          })
        }
      >
        <View style={styles.doctorCard}>
          <Image source={{ uri: imageUri }} style={styles.doctorImage} />
          <View style={styles.doctorInfo}>
            <Text style={styles.doctorName}>{item.username}</Text>
            <Text style={styles.doctorCategory}>{item.category}</Text>
            <Text style={styles.serviceText}>Services Provided :</Text>
            {/* Render the services and their prices */}
            {services.length > 0 ? (
              services.map((service, index) => (
                <Text key={index} style={styles.sText}>
                  {formatServiceName(service.service)}: RM {service.price}
                </Text>
              ))
            ) : (
              <Text style={styles.doctorCategory}>No services available</Text>
            )}
            <Text style={styles.doctorRating}>⭐ {item.rating || "N/A"}</Text>
          </View>
          <TouchableOpacity
            onPress={() => toggleFavorite(item.virtual_availability_id)}
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

export default VirtualCategoryDoctorsScreen;
