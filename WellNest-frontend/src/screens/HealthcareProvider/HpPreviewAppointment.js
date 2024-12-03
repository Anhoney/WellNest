//HpPreviewAppointment.js --放一边先
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  Image,
  ImageBackground,
  ScrollView,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker"; // Ensure this is imported
import styles from "../../components/styles"; // Assuming you have a styles file
import axios from "axios";
import { useRoute } from "@react-navigation/native";
import NavigationBar from "../../components/NavigationBar"; // Import here
import { Ionicons } from "@expo/vector-icons"; // Import icons from Expo
import { FontAwesome } from "@expo/vector-icons"; // Import FontAwesome for the heart icon
import API_BASE_URL from "../../../config/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserIdFromToken } from "../../../services/authService";

const HpPreviewAppointment = ({ route, navigation }) => {
  //   const { doctorId, selectedDate } = route.params;
  const [doctor, setDoctor] = useState({});
  //   const [selectedDate, setSelectedDate] = useState("");
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false); // Date picker visibility state
  //   const [favorites, setFavorites] = useState([]);
  //   const isFavorite = favorites.includes(doctorId);
  const [userId, setUserId] = useState(null);
  //   const route = useRoute();

  const imageUri = doctor.profile_image
    ? `data:image/png;base64,${doctor.profile_image}`
    : "https://via.placeholder.com/150";

  // Set the selected date from the route params
  //   const [date, setDate] = useState(selectedDate || ""); // Initialize with selectedDate
  const today = new Date();

  const fetchUserId = async () => {
    const userId = await getUserIdFromToken();
    console.log("userId:", userId);
    if (userId) {
      setUserId(userId);
      fetchProfileData(userId);
    }
  };

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/doctor/${doctorId}`);
        setDoctor(response.data);
      } catch (error) {
        Alert.alert("Error", "Failed to fetch doctor details.");
        console.error(error);
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
        const favoriteIds = response.data.map(
          (doctor) => doctor.availability_id
        ); // Adjust based on your API response
        setFavorites(favoriteIds);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    // Fetch available times for the selected date when the component mounts
    if (selectedDate) {
      fetchAvailableTimes(selectedDate);
    }

    fetchDoctorDetails();
    fetchFavorites();
  }, [doctorId, selectedDate]);

  const fetchAvailableTimes = async (date) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/availableTimes`, {
        params: { doctorId, date },
      });

      // Check if slots are returned and filter out booked ones
      const filteredTimes = response.data
        ? response.data.filter((timeSlot) => !timeSlot.booked)
        : [];

      setAvailableTimes(filteredTimes);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch available times.");
      console.error(error);
    }
  };

  const toggleFavorite = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await axios.post(
        `${API_BASE_URL}/toggleFavorite`,
        { availabilityId: doctorId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setFavorites((prevFavorites) => {
          const newFavorites = prevFavorites.includes(doctorId)
            ? prevFavorites.filter((id) => id !== doctorId)
            : [...prevFavorites, doctorId];

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

  // Handle the selected date
  const handleConfirmDate = async (selectedDate) => {
    const formattedDate = selectedDate.toISOString().split("T")[0]; // Format to YYYY-MM-DD
    setDate(formattedDate); // Update the date state
    setDatePickerVisibility(false);

    // Log the selected date for debugging
    // console.log("Selected Date:", formattedDate);

    // Fetch available times for the newly selected date
    await fetchAvailableTimes(formattedDate);
  };
  // Function to format the date with commas
  const formatDate = (dateToFormat) => {
    if (!dateToFormat) return ""; // Fallback if date is undefined
    return new Date(dateToFormat).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleBookAppointment = async () => {
    if (!date || !selectedTime) {
      Alert.alert("Error", "Please select a date and time.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      await axios.post(
        `${API_BASE_URL}/bookAppointment`,
        {
          doctorId,
          date: date,
          time: selectedTime,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      Alert.alert("Success", "Appointment booked successfully.");
      navigation.navigate("MainPage"); // Navigate back to Home
    } catch (error) {
      Alert.alert("Error", "Failed to book appointment.");
      console.error(error);
    }
  };

  const getBusinessDays = (businessDays) => {
    switch (businessDays) {
      case "Every Weekday":
        return "Mon-Fri";
      case "Every Weekend":
        return "Sat-Sun";
      case "Everyday":
        return "Mon-Sun";
      default:
        return "";
    }
  };

  const data = [
    { type: "experience" },
    { type: "businessHours" },
    { type: "description" },
    { type: "about" },
    { type: "dateSelection" },
    { type: "timeSelection" },
    { type: "bookButton" },
  ];

  const handleNext = () => {
    if (!date || !selectedTime) {
      Alert.alert("Error", "Please select a date and time.");
      return;
    }

    navigation.navigate("BookAppointmentDetailsScreen", {
      doctorId: doctorId,
      selectedDate: date,
      selectedTime: selectedTime,
    });
  };

  return (
    <ImageBackground
      source={require("../../../assets/DoctorDetails.png")}
      style={[styles.background, { flex: 1 }]}
    >
      {/* Title Section with Back chevron-back */}
      <View style={styles.smallHeaderContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}> {doctor.category} </Text>
      </View>

      <View style={styles.uAcontainer}>
        {/* Static Doctor Info */}
        <View style={styles.transDoctorCard}>
          <Image source={{ uri: imageUri }} style={styles.doctorImage} />
          <View style={styles.doctorInfo}>
            <Text style={styles.doctorName}>{doctor.username}</Text>
            <Text style={styles.doctorCategory}>{doctor.category}</Text>
            <Text style={styles.description}>Location: {doctor.location}</Text>
            <Text style={styles.doctorRating}>⭐ {doctor.rating || "N/A"}</Text>
          </View>
          <TouchableOpacity
            onPress={() => toggleFavorite(doctor.id)}
            style={styles.favoriteIcon}
          >
            <FontAwesome
              name={isFavorite ? "heart" : "heart-o"}
              size={24}
              color={isFavorite ? "red" : "gray"}
            />
          </TouchableOpacity>
        </View>

        {/* Static Doctor Info */}
        <View style={styles.uAContainer}>
          <View style={styles.infoContainer}>
            <FontAwesome
              name="briefcase"
              size={16}
              color="#e67e22"
              style={{ marginRight: 5 }}
            />
            <Text style={styles.infoText}>
              {doctor.experience || "N/A"} years experience
            </Text>
            <FontAwesome
              name="clock-o"
              size={16}
              color="#e67e22"
              style={{ marginRight: 5 }}
            />
            <Text style={styles.infoText}>
              {getBusinessDays(doctor.available_days) || "N/A"} /{"\n"}
              {doctor.business_hours || "N/A"}
            </Text>
          </View>
        </View>

        {/* Single FlatList for Entire Scrollable Content */}
        <FlatList
          data={[
            { key: "Profile" },
            { key: "Description" },
            { key: "About" },
            { key: "DatePicker" },
            { key: "TimeSlots" },
            { key: "NextButton" },
            // { key: "BookButton" },
          ]}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => {
            if (item.key === "Profile") {
              return (
                <TouchableOpacity
                  style={styles.profileButton}
                  onPress={() => {
                    navigation.navigate("DoctorProfileScreen", {
                      doctorId: doctorId, // Assuming item.id is the doctor's ID
                      // selectedDate: date.toISOString().split("T")[0], // Pass the selected date
                    });
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <FontAwesome
                      name="user"
                      size={18}
                      color="#ffffff"
                      style={{ marginRight: 8 }}
                    />
                    <Text style={styles.profileButtonText}>Profile</Text>
                  </View>
                </TouchableOpacity>
              );
            }

            if (item.key === "Description") {
              return (
                <>
                  <Text style={styles.aSectionTitle}>Descriptions</Text>
                  <View style={styles.displayUnderline} />
                  <Text style={styles.sectionContent}>
                    {doctor.description}
                  </Text>
                </>
              );
            }

            if (item.key === "About") {
              return (
                <>
                  <Text style={styles.aSectionTitle}>About</Text>
                  <View style={styles.displayUnderline} />
                  <Text style={styles.sectionContent}>
                    📞 {doctor.phone_number || "N/A"}
                  </Text>
                  <Text style={styles.sectionContent}>
                    📍 {doctor.location || "N/A"} {"\n"}{" "}
                    {doctor.hospital_address || ""}
                  </Text>
                </>
              );
            }

            if (item.key === "DatePicker") {
              return (
                <>
                  <Text style={styles.aSectionTitle}>Select Date</Text>
                  <View style={styles.displayUnderline} />
                  <TouchableOpacity
                    style={styles.datePickerButton}
                    onPress={() => setDatePickerVisibility(true)}
                  >
                    <View style={styles.dateInputContent}>
                      <Ionicons
                        name="calendar-outline"
                        size={20}
                        color="#000"
                        style={styles.iconStyle}
                      />
                      <Text style={styles.dateText}>
                        {date ? formatDate(date) : "Select a Date"}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    display="inline"
                    onConfirm={handleConfirmDate}
                    onCancel={() => setDatePickerVisibility(false)}
                    date={date ? new Date(date) : today}
                    minimumDate={today}
                  />
                </>
              );
            }

            if (item.key === "TimeSlots") {
              return (
                <>
                  <Text style={styles.aSectionTitle}>Select Time Slots</Text>
                  <View style={styles.displayUnderline} />
                  <FlatList
                    data={availableTimes}
                    keyExtractor={(time) => time}
                    renderItem={(
                      { item } // {renderItem}
                    ) => (
                      <TouchableOpacity
                        onPress={() => setSelectedTime(item)}
                        style={[
                          styles.timeSlot,
                          item === selectedTime
                            ? styles.selectedTimeSlot
                            : null,
                        ]}
                      >
                        <Text>{item}</Text>
                      </TouchableOpacity>
                    )}
                    ListEmptyComponent={
                      date && (
                        <Text style={styles.noTimesText}>
                          No available times for the selected date. {"\n"}
                        </Text>
                      )
                    }
                  />
                </>
              );
            }

            if (item.key === "NextButton") {
              // if (item.key === "BookButton") {
              return (
                <TouchableOpacity
                  style={styles.signOutButton}
                  onPress={handleNext}
                  // onPress={handleBookAppointment}
                >
                  <Text style={styles.buttonText}>Next</Text>
                  {/* <Text style={styles.buttonText}>Book Appointment</Text> */}
                </TouchableOpacity>
              );
            }
            return null;
          }}
        />
      </View>
      <NavigationBar navigation={navigation} activePage="" />
    </ImageBackground>
  );
};

export default HpPreviewAppointment;
