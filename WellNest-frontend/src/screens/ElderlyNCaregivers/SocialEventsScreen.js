//SocialEventsScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  ActivityIndicator,
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
const SocialEventsScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("events"); // State to manage active tab
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [userId, setUserId] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      const fetchUserId = async () => {
        const id = await getUserIdFromToken();
        setUserId(id);
      };
      fetchUserId();
    }, [])
  );

  // useFocusEffect(
  //   React.useCallback(() => {
  //     fetchEvents();
  //   }, [])
  // );

  const fetchEvents = async (query = "") => {
    try {
      setLoading(true);
      // const userId = await getUserIdFromToken();
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        alert("No token found. Please log in.");
        return;
      }
      let url;
      switch (activeTab) {
        case "ongoing":
          url = `${API_BASE_URL}/user/${userId}/registered-events?search=${query}`;
          break;
        case "past":
          url = `${API_BASE_URL}/user/${userId}/past-events?search=${query}`;
          break;
        default:
          url = `${API_BASE_URL}/user/getEvents?search=${query}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setEvents(data.events);
      } else {
        console.error("Error fetching events:", data.error);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      if (userId) {
        fetchEvents(); // Fetch events when userId is available
      }
    }, [userId, activeTab])
  );

  const archiveEvent = async (eventId) => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        alert("No token found. Please log in.");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/user/${userId}/archive-event/${eventId}`,
        {
          method: "PATCH", // Assuming PATCH method to update status
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "past" }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert("Event archived successfully!");
        fetchEvents(); // Refresh events after archiving
      } else {
        console.error("Error archiving event:", data.error);
      }
    } catch (error) {
      console.error("Error archiving event:", error);
    } finally {
      setLoading(false);
    }
  };
  const unarchiveEvent = async (eventId) => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        alert("No token found. Please log in.");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/user/${userId}/unarchive-event/${eventId}`,
        {
          method: "PATCH", // Assuming PATCH method to update status
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "ongoing" }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert("Event unarchived successfully!");
        fetchEvents(); // Refresh events after unarchiving
      } else {
        console.error("Error unarchiving event:", data.error);
      }
    } catch (error) {
      console.error("Error unarchiving event:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    console.log("Search:", searchQuery);
    // Implement search functionality here
    // setSearchQuery(query);
    fetchEvents(searchQuery);
  };

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

  const renderEmptyComponent = () => (
    <View style={styles.coEmptyContainer}>
      <Image
        source={require("../../../assets/NothingDog.png")}
        style={styles.emptyImage}
      />
      <Text style={styles.emptyText}>No Social Events or Chat Rooms.</Text>
    </View>
  );

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

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

      <View style={styles.appointmentContainer}>
        <Text style={[styles.smallTitle, { marginTop: -65 }]}>
          Find Your Events and Groups
        </Text>

        <View style={[styles.searchContainer, { marginBottom: 35 }]}>
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Icon name="search" size={20} color="white" />
          </TouchableOpacity>
          <TextInput
            style={styles.searchInput}
            // {styles.searchInput}
            placeholder="Search Events and Groups..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            // onChangeText={(text) => handleSearch(text)}
          />
        </View>

        {/* Tab Navigation */}
        <View style={styles.seTabContainer}>
          <TouchableOpacity
            style={[
              styles.seTabButton,
              activeTab === "events" && styles.seActiveTab,
            ]}
            onPress={() => handleTabChange("events")}
            // onPress={() => {
            //   setActiveTab("events");
            //   fetchEvents();
            // }}
          >
            <Text style={styles.seTabText}>Events</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.seTabButton,
              activeTab === "chat" && styles.seActiveTab,
            ]}
            onPress={() => handleTabChange("chat")}
            // onPress={() => setActiveTab("chat")}
          >
            <Text style={styles.seTabText}>Chat Room</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.seTabButton,
              activeTab === "ongoing" && styles.seActiveTab,
            ]}
            // onPress={() => {
            //   setActiveTab("ongoing");
            //   fetchEvents(); // Fetch registered events when switching tabs
            // }}
            onPress={() => handleTabChange("ongoing")}
          >
            <Text style={styles.seTabText}>
              Ongoing Events {"\n"}and Groups
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.seTabButton,
              activeTab === "past" && styles.seActiveTab,
            ]}
            // onPress={() => {
            //   setActiveTab("past");
            //   fetchEvents();
            // }}
            onPress={() => handleTabChange("past")}
          >
            <Text style={styles.seTabText}>Past Events</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.eEventsScrollView}>
          {/* <ScrollView contentContainerStyle={styles.scrollView}> */}
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <>
              {activeTab === "events" && (
                <>
                  <Text style={styles.sectionTitle}>Events</Text>
                  <View style={styles.displayUnderline}></View>
                  <FlatList
                    // data={events}
                    data={events.sort(
                      (a, b) => new Date(b.created_at) - new Date(a.created_at)
                    )} // Sort by created_at in descending order
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={renderEmptyComponent}
                    renderItem={({ item }) => {
                      let price;
                      if (item.fees && item.fees.toLowerCase() === "free") {
                        price = "FREE";
                      } else if (
                        !isNaN(item.fees) &&
                        !isNaN(parseFloat(item.fees))
                      ) {
                        price = `RM ${item.fees}`;
                      } else {
                        price = item.fees; // Show fees as-is if it's not numeric or "free"
                      }

                      return (
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate("SocialEventsDetails", {
                              eventId: item.id,
                            })
                          }
                        >
                          <EventCard
                            image={item.photo ? item.photo : null}
                            title={item.title}
                            location={item.location}
                            date={item.event_date}
                            price={price}
                          />
                        </TouchableOpacity>
                      );
                    }}
                  />
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
                </>
              )}

              {activeTab === "ongoing" && (
                <>
                  <Text style={styles.sectionTitle}>Ongoing Events</Text>
                  <View style={styles.displayUnderline}></View>
                  <FlatList
                    data={events
                      .filter((event) => event.joined_at) // Ensure joined_at exists
                      .sort(
                        (a, b) => new Date(a.joined_at) - new Date(b.joined_at)
                      )} // Sort by joined_at in ascending order
                    // data={events}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={renderEmptyComponent}
                    renderItem={({ item }) => (
                      <View>
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate("SocialEventsDetails", {
                              eventId: item.id,
                            })
                          }
                        >
                          <EventCard
                            image={item.photo ? item.photo : null}
                            title={item.title}
                            location={item.location}
                            date={item.event_date}
                            price={item.fees}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.archiveButton}
                          onPress={() => archiveEvent(item.id)}
                        >
                          <Text style={styles.archiveButtonText}>Archive</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  />
                </>
              )}

              {activeTab === "past" && (
                <>
                  <Text style={styles.sectionTitle}>Past Events</Text>
                  <View style={styles.displayUnderline}></View>
                  <FlatList
                    data={events}
                    // data={events.filter((event) => event.status === "Past")}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={renderEmptyComponent}
                    renderItem={({ item }) => (
                      <View>
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate("SocialEventsDetails", {
                              eventId: item.id,
                            })
                          }
                        >
                          <EventCard
                            image={item.photo ? item.photo : null}
                            title={item.title}
                            location={item.location}
                            date={item.event_date}
                            price={item.fees}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.archiveButton}
                          onPress={() => unarchiveEvent(item.id)}
                        >
                          <Text style={styles.archiveButtonText}>
                            Unarchive
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  />
                </>
              )}
            </>
          )}
        </View>
      </View>
      <NavigationBar navigation={navigation} activePage="" />
    </ImageBackground>
  );
};

export default SocialEventsScreen;
