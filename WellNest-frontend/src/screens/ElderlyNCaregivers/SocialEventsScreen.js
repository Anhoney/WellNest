import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  FlatList,
} from "react-native";
import EventCard from "../../components/EventCard";
import ChatRoomCard from "../../components/ChatRoomCard";
import styles from "../../components/styles";
import { Ionicons } from "@expo/vector-icons";
import { getUserIdFromToken } from "../../../services/authService";
import NavigationBar from "../../components/NavigationBar"; // Import your custom navigation bar component
import API_BASE_URL from "../../../config/config";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const SocialEventsScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState(new Date()); // Initialize with today's date
  const [selectedDoctor, setSelectedDoctor] = useState(null); // <-- Add this line
  const [selectedTime, setSelectedTime] = useState(null); // <-- Add this line for selected time
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const handleSearch = () => {
    console.log("Search:", searchQuery, location, date);
    // Implement search functionality here
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
    // Fetch available times for the newly selected date
    if (selectedDoctor) {
      handleDoctorSelect(selectedDoctor);
    }
  };

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
      source={require("../../../assets/AppointmentPage.png")}
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
        <Text style={styles.title}>Social Events and{"\n"} Support Groups</Text>
      </View>

      <View style={styles.appointmentContainer}>
        <Text style={styles.smallTitle}>Find Your Events and Groups</Text>

        <View style={styles.searchContainer}>
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Icon name="search" size={20} color="white" />
          </TouchableOpacity>
          <TextInput
            style={styles.searchInput}
            placeholder="Search Doctor..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.smallInputContainer}>
            <Ionicons
              name="location-outline"
              size={20}
              color="#000"
              style={styles.iconStyle}
            />
            <TextInput
              style={styles.searchInputWithIcon}
              placeholder="Location"
              value={location}
              onChangeText={setLocation}
            />
          </View>

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
            // onDateChange={(selectedDate) => setDate(selectedDate)}
          />
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.header}>Social Events and Support Groups</Text>

        <Text style={styles.sectionTitle}>Events</Text>
        <EventCard
          image="https://via.placeholder.com/150"
          title="Morning Exercise Sabah 2024"
          location="Kota Kinabalu"
          date="Every Sunday"
          price="FREE"
        />

        <Text style={styles.sectionTitle}>Let's Chat</Text>
        <ChatRoomCard
          title="Dementia Support!"
          onJoin={() => alert("Joining Dementia Support!")}
        />
        <ChatRoomCard
          title="Mental Talk"
          onJoin={() => alert("Joining Mental Talk")}
        />
      </ScrollView>
      <NavigationBar navigation={navigation} activePage="" />
    </ImageBackground>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: "#f5f5f5",
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 16,
//   },
//   searchContainer: {
//     marginBottom: 20,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 8,
//     padding: 10,
//     marginBottom: 10,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginVertical: 10,
//   },
// });

export default SocialEventsScreen;
