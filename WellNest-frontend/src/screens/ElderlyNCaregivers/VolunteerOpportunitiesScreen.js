import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  FlatList,
} from "react-native";
import styles from "../../components/styles"; // Assume you have a styles.js file for consistent styling
import { Ionicons } from "@expo/vector-icons";
import NavigationBar from "../../components/NavigationBar";
import TabNavigator from "../../components/TabNavigator"; // New component for handling tabs
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const VolunteerOpportunitiesScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState("opportunities");
  const navigation = useNavigation();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const handleTabChange = (tab) => setActiveTab(tab);

  const renderContent = () => {
    switch (activeTab) {
      case "opportunities":
        return renderOpportunities();
      case "upcoming":
        return renderUpcomingOpportunities();
      case "past":
        return renderPastOpportunities();
      default:
        return renderOpportunities();
    }
  };

  const renderOpportunities = () => (
    <View>
      <Text style={styles.sectionTitle}>Opportunities</Text>
      {/* Replace with dynamic data */}
      <OpportunityCard
        title="Volunteering At Old Folks Home"
        location="Kota Kinabalu"
        date="09 August 2024"
        price="FREE"
      />
      <OpportunityCard
        title="Community Gardens Cleaning Activity"
        location="Kota Kinabalu"
        date="18 August 2024"
        price="FREE"
      />
    </View>
  );

  const renderUpcomingOpportunities = () => (
    <Text style={styles.sectionTitle}>No upcoming opportunities yet!</Text>
  );

  const renderPastOpportunities = () => (
    <Text style={styles.sectionTitle}>Here are past opportunities...</Text>
  );

  const handleSearch = () => {
    console.log("Search:", searchQuery, location, date);
    // Implement search functionality here
  };

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
      <View style={styles.noBgSmallHeaderContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Volunteer Opportunities</Text>
      </View>

      <View style={styles.appointmentContainer}>
        <Text style={styles.smallTitle}>Find Your Volunteer Opportunities</Text>

        <View style={styles.searchContainer}>
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Ionicons name="search" size={24} color="#000" />
          </TouchableOpacity>
          <TextInput
            style={styles.searchInput}
            placeholder="Search Opportunities..."
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

      <TabNavigator activeTab={activeTab} onTabChange={handleTabChange} />
      <FlatList contentContainerStyle={styles.scrollView}>
        {renderContent()}
      </FlatList>
      <NavigationBar navigation={navigation} activePage="Home" />
    </ImageBackground>
  );
};

const OpportunityCard = ({ title, location, date, price }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardDetails}>{location}</Text>
    <Text style={styles.cardDetails}>{date}</Text>
    <Text style={styles.cardPrice}>{price}</Text>
  </View>
);

export default VolunteerOpportunitiesScreen;
