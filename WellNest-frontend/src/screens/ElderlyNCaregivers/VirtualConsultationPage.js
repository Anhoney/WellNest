//VirtualConsultationPage.js
import React, { useState, useCallback } from "react"; // <-- Add useState here
import {
  View,
  Text,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  FlatList,
} from "react-native";
import styles from "../../components/styles"; // Import shared styles
import { Ionicons } from "@expo/vector-icons"; // Import icons from Expo
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import DateTimePickerModal from "react-native-modal-datetime-picker"; // Ensure this is imported
import NavigationBar from "../../components/NavigationBar"; // Import your custom navigation bar component
import API_BASE_URL from "../../../config/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserIdFromToken } from "../../../services/authService";
import axios from "axios";
import { FontAwesome } from "@expo/vector-icons";

const VirtualConsultationPage = () => {
  const navigation = useNavigation();
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("relevance");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [categories, setCategories] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [favoriteDoctors, setFavoriteDoctors] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null); // <-- Add this line
  const [selectedTime, setSelectedTime] = useState(null); // <-- Add this line for selected time
  const [userId, setUserId] = useState(null);
  // const [isDatePickerOpen, setDatePickerOpen] = useState(false);

  // Fetch categories from API
  useFocusEffect(
    useCallback(() => {
      const fetchUserId = async () => {
        const userId = await getUserIdFromToken();
        // console.log("userId:", userId);
        if (userId) {
          setUserId(userId);
        }
      };

      const fetchCategories = async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/virtualCategories`);
          setCategories(response.data);
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      };

      const fetchFavoriteDoctors = async () => {
        try {
          const token = await AsyncStorage.getItem("token");
          // console.log("Token:", token); // Log the token

          if (!token) {
            console.error("No token found");
            return;
          }

          const response = await axios.get(
            `${API_BASE_URL}/virtualGetFavorites`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          // console.log("Favorite Doctors Response:", response.data); // Log the response from the backend

          // Extract the IDs for easier management
          const favoriteIds = response.data.map(
            (doctor) => doctor.virtual_availability_id
          );
          setFavoriteDoctors(response.data || []);
          setFavorites(favoriteIds);
        } catch (error) {
          console.error("Error fetching favorite doctors:", error);
        }
      };
      fetchUserId();
      fetchCategories();
      fetchFavoriteDoctors();
    }, [])
  );

  // Function to toggle favorites
  const toggleFavorite = async (availabilityId) => {
    try {
      const token = await AsyncStorage.getItem("token");

      console.log("Token:", token); // Log the token to ensure it's being retrieved correctly
      console.log("Doctor ID:", availabilityId); // Log the doctor ID being passed

      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await axios.post(
        `${API_BASE_URL}/virtualToggleFavorite`,
        { availabilityId: availabilityId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Toggle Favorite Response:", response.data); // Log the response from the backend

      if (response.data.success) {
        setFavorites((prevFavorites) => {
          const newFavorites = prevFavorites.includes(availabilityId)
            ? prevFavorites.filter((id) => id !== availabilityId)
            : [...prevFavorites, availabilityId];

          // Update favorites in AsyncStorage
          AsyncStorage.setItem("favorites", JSON.stringify(newFavorites));
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

  const renderFavoriteCard = ({ item }) => {
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
        onPress={() => {
          // Navigate to AppointmentDoctorDetails with the selected doctor and date
          navigation.navigate("DoctorDetails", {
            doctorId: item.virtual_availability_id, // Assuming item.id is the doctor's ID
            // selectedDate: date.toISOString().split("T")[0], // Pass the selected date
          });
        }}
      >
        <View style={styles.doctorCard}>
          <Image source={{ uri: imageUri }} style={styles.doctorImage} />
          <View style={styles.doctorInfo}>
            <Text style={styles.doctorName}>{item.username}</Text>
            <Text style={styles.doctorCategory}>{item.category}</Text>
            {services.length > 0 ? (
              services.map((service, index) => (
                <Text key={index} style={styles.sText}>
                  {formatServiceName(service.service)}: RM {service.price}
                </Text>
              ))
            ) : (
              <Text style={styles.doctorCategory}>No services available</Text>
            )}
            {/* <Text style={styles.doctorCategory}>{item.location}</Text> */}
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

  const handleSearch = async () => {
    // Adjust the date to local time zone
    const adjustedDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    );
    const formattedDate = adjustedDate.toISOString().split("T")[0]; // Format as 'YYYY-MM-DD'

    // Log the search parameters before making the API call
    console.log("Search Params:", {
      searchQuery,
      location,
      date: formattedDate, // Format date as 'YYYY-MM-DD'
    });

    const searchParams = {
      searchQuery,
      location,
      date: formattedDate, // Format date as 'YYYY-MM-DD'
    };

    // Log the parameters to ensure they are correct
    console.log("Formatted Search Params:", searchParams);

    navigation.navigate("VirtualCategoryDoctors", { searchParams });
    // const response = await axios.post(`${API_BASE_URL}/search`, {
    //   searchQuery,
    //   location,
    //   date,
    // });
    // setDoctors(response.data); // Update the doctor list
  };

  const handleDoctorSelect = async (doctorId) => {
    // Adjust the date to local time zone
    const adjustedDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    );
    const formattedDate = adjustedDate.toISOString().split("T")[0]; // Format as 'YYYY-MM-DD'

    // Log the doctor ID and date to verify the request
    console.log("Fetching available times for Doctor ID:", doctorId);
    console.log("For Date:", formattedDate);

    // Set the selected doctor
    setSelectedDoctor(doctorId);
    // Fetch available times for the selected doctor
    const response = await axios.get(`${API_BASE_URL}/availableTimes`, {
      params: { doctorId, date: formattedDate }, // Sending date as 'YYYY-MM-DD'
    });
    setAvailableTimes(response.data);
    // Navigate to AppointmentDoctorDetails with the selected date
    navigation.navigate("AppointmentDoctorDetails", {
      doctorId,
      selectedDate: formattedDate, // Pass the selected date
    });
  };

  // Functions to handle date picker
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (selectedDate) => {
    setDate(selectedDate);
    hideDatePicker();
  };

  const EmptyFavorites = () => (
    <View style={styles.emptyFavoritesContainer}>
      <Image
        source={require("../../../assets/NoFavourite.png")}
        style={styles.emptyFavoritesImage}
      />
      <Text style={styles.noDataText}>No favorites yet.</Text>
    </View>
  );

  // Get today's date
  const today = new Date();

  // Function to format the date with commas
  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <ImageBackground
      source={require("../../../assets/VirtualConsultationPage.png")}
      style={styles.background}
    >
      {/* Title Section with Back chevron-back */}
      <View style={styles.noBgSmallHeaderContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Virtual Consultation</Text>
      </View>

      <View style={styles.appointmentContainer}>
        <Text style={styles.smallTitle}>Search Consult Categories</Text>

        <View style={styles.searchContainer}>
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Icon name="search" size={20} color="white" />
          </TouchableOpacity>
          <TextInput
            style={styles.searchInput}
            placeholder="Search Consult Categories..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.searchContainer}>
          {/* Show the date picker on initial render */}
          <TouchableOpacity style={styles.dateInput} onPress={showDatePicker}>
            <View style={styles.dateInputContent}>
              {/* <Text style={styles.dateText}>{date.toDateString()}</Text> */}
              <Ionicons
                name="calendar-outline"
                size={20}
                color="#000"
                style={styles.iconStyle}
              />
              <Text style={styles.dateText}>{formatDate(date)}</Text>
            </View>
          </TouchableOpacity>

          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            display="inline" // Set to inline to resemble the calendar style
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
            date={date}
            minimumDate={today} // Disallow future dates by setting maximum date to today
          />
        </View>

        {/* Relevance and Favourite Buttons */}
        {/* Adding a separator between buttons and ScrollView for better spacing */}
        <View style={styles.filterButtonContainer}>
          <Text style={styles.categoriesTitle}>Categories </Text>
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedFilter === "relevance"
                ? styles.activeFilter
                : styles.inactiveFilter,
            ]}
            onPress={() => setSelectedFilter("relevance")}
          >
            <Text
              style={[
                styles.filterButtonText,
                selectedFilter === "relevance"
                  ? styles.activeFilterText
                  : styles.inactiveFilterText,
              ]}
            >
              Relevance
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedFilter === "favourite"
                ? styles.activeFilter
                : styles.inactiveFilter,
            ]}
            onPress={() => setSelectedFilter("favourite")}
          >
            <Text
              style={[
                styles.filterButtonText,
                selectedFilter === "favourite"
                  ? styles.activeFilterText
                  : styles.inactiveFilterText,
              ]}
            >
              Favourite
            </Text>
          </TouchableOpacity>
        </View>

        {/* White Underline */}
        <View style={styles.singleUnderline}></View>

        {/* ScrollView for relevant or favorite specialists */}
        {/* <ScrollView style={styles.specialtyContainer}>
          {selectedFilter === "relevance"
            ? [
                "Cardiology",
                "Dermatology",
                "General Medicine",
                "Gynecology",
                "Odontology",
                "Oncology",
                "Ophthalmology",
                "Orthopedics",
              ].map((specialty, index) => (
                <TouchableOpacity key={index} style={styles.specialtyButton}>
                  <Text style={styles.specialtyText}>{specialty}</Text>
                </TouchableOpacity>
              ))
            : ["Saved Specialist 1", "Saved Specialist 2"].map(
                (specialist, index) => (
                  <TouchableOpacity key={index} style={styles.specialtyButton}>
                    <Text style={styles.specialtyText}>{specialist}</Text>
                  </TouchableOpacity>
                )
              )}
        </ScrollView>
      </View> */}
        {selectedFilter === "favourite" ? (
          <FlatList
            data={favoriteDoctors}
            keyExtractor={(item) => item.virtual_availability_id.toString()}
            renderItem={renderFavoriteCard}
            ListEmptyComponent={
              <EmptyFavorites />
              // <Text style={styles.noDataText}>No favorites yet</Text>
            }
          />
        ) : (
          <ScrollView style={styles.specialtyContainer}>
            {categories.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.specialtyButton}
                onPress={() =>
                  navigation.navigate("VirtualCategoryDoctors", {
                    category: item.category,
                  })
                }
              >
                <Text style={styles.specialtyText}>{item.category}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      <NavigationBar navigation={navigation} activePage="" />
    </ImageBackground>
  );
};

export default VirtualConsultationPage;
