//SocialEventsManagement.js
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
import CoNavigationBar from "../../components/CoNavigationBar";
import API_BASE_URL from "../../../config/config";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const CoSocialEventsManagement = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState(new Date()); // Initialize with today's date
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [activeTab, setActiveTab] = useState("events"); // State to manage active tab

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

  // Sample data for ongoing and past events
  const ongoingEvents = [
    {
      id: "1",
      title: "Yoga Class",
      location: "Community Center",
      date: "2023-10-10",
    },
    {
      id: "2",
      title: "Cooking Workshop",
      location: "Culinary School",
      date: "2023-10-12",
    },
  ];

  const pastEvents = [
    {
      id: "1",
      title: "Art Exhibition",
      location: "Art Gallery",
      date: "2023-09-15",
    },
    {
      id: "2",
      title: "Book Club Meeting",
      location: "Library",
      date: "2023-09-20",
    },
  ];

  const chatRooms = [
    {
      id: "1",
      title: "Dementia Support!",
    },
    {
      id: "2",
      title: "Mental Talk",
    },
  ];

  return (
    <ImageBackground
      source={require("../../../assets/Assessment.png")}
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

      <View style={styles.coSearchContainer}>
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Icon name="search" size={20} color="white" />
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          // {styles.searchInput}
          placeholder="Search ..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <View style={styles.assessmentContainer}>
        {/* Tab Navigation */}
        <View style={styles.seTabContainer}>
          <TouchableOpacity
            style={[
              styles.seTabButton,
              activeTab === "events" && styles.seActiveTab,
            ]}
            onPress={() => setActiveTab("events")}
          >
            <Text style={styles.seTabText}>Events</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.seTabButton,
              activeTab === "chat" && styles.seActiveTab,
            ]}
            onPress={() => setActiveTab("chat")}
          >
            <Text style={styles.seTabText}>Chat Room</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.seTabButton,
              activeTab === "past" && styles.seActiveTab,
            ]}
            onPress={() => setActiveTab("past")}
          >
            <Text style={styles.seTabText}>Past Events</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollView}>
          {activeTab === "events" && (
            <>
              <Text style={styles.sectionTitle}>Events</Text>
              <View style={styles.displayUnderline}></View>
              <EventCard
                image="https://via.placeholder.com/150"
                title="Morning Exercise Sabah 2024"
                location="Kota Kinabalu"
                date="Every Sunday"
                price="FREE"
              />

              <TouchableOpacity
                style={styles.addEventButton}
                onPress={() => navigation.navigate("CoCreateEvents")}
              >
                <Text style={styles.addEventText}>Add Event</Text>
                <Ionicons name="add" size={24} color="#FFF" />
              </TouchableOpacity>
            </>
          )}

          {activeTab === "chat" && (
            <>
              <Text style={styles.sectionTitle}>Let's Chat</Text>
              <View style={styles.displayUnderline}></View>
              {chatRooms.map((room) => (
                <ChatRoomCard
                  key={room.id}
                  title={room.title}
                  onJoin={() => alert(`Joining ${room.title}`)}
                />
              ))}

              <TouchableOpacity
                style={styles.addEventButton}
                onPress={() => navigation.navigate("AddChatRoom")}
              >
                <Text style={styles.addEventText}>Add Chat Room</Text>
                <Ionicons name="add" size={24} color="#FFF" />
              </TouchableOpacity>
            </>
          )}

          {activeTab === "past" && (
            <>
              <Text style={styles.sectionTitle}>Past Events</Text>
              <View style={styles.displayUnderline}></View>
              {pastEvents.map((event) => (
                <EventCard
                  key={event.id}
                  title={event.title}
                  location={event.location}
                  date={event.date}
                />
              ))}
            </>
          )}
        </ScrollView>
      </View>
      <CoNavigationBar navigation={navigation} activePage="" />
    </ImageBackground>
  );
};

export default CoSocialEventsManagement;
