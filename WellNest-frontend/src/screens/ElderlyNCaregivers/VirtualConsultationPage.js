//VirtualConsultationPage.js
import React, { useState } from "react"; // <-- Add useState here
import {
  View,
  Text,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import styles from "../../components/styles"; // Import shared styles
import { Ionicons } from "@expo/vector-icons"; // Import icons from Expo
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import DateTimePickerModal from "react-native-modal-datetime-picker"; // Ensure this is imported
import NavigationBar from "../../components/NavigationBar"; // Import your custom navigation bar component
import API_BASE_URL from "../../../config/config";

const VirtualConsultationPage = () => {
  const navigation = useNavigation();
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("relevance");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  // const [isDatePickerOpen, setDatePickerOpen] = useState(false);

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
          <TouchableOpacity style={styles.searchButton}>
            <Icon name="search" size={20} color="white" />
          </TouchableOpacity>
          <TextInput
            style={styles.searchInput}
            placeholder="Search Consult Categories..."
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
        <ScrollView style={styles.specialtyContainer}>
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
      </View>

      <NavigationBar navigation={navigation} activePage="" />
    </ImageBackground>
  );
};

export default VirtualConsultationPage;
