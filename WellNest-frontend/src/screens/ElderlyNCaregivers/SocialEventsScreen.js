// SocialEventsScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const SocialEventsScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("events"); // State to manage active tab
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [userId, setUserId] = useState(null);
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("publicChat");
  const [joinedChatRooms, setJoinedChatRooms] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchUserId = async () => {
        const id = await getUserIdFromToken();
        setUserId(id);
      };
      fetchUserId();
    }, [])
  );

  const fetchEvents = async (query = "") => {
    try {
      setLoading(true);
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
        fetchChatRoom();
        fetchJoinedChatRoom();
      }
    }, [userId, activeTab])
  );

  const fetchChatRoom = async () => {
    const userId = await getUserIdFromToken();
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      alert("No token found. Please log in.");
      return;
    }

    try {
      const response = await axios.get(
        `${API_BASE_URL}/getUnjoin/support_group/${userId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Use your actual token
          },
        }
      );

      if (response.status === 200) {
        // Handle the response data
        setChatRooms(response.data);
      }
    } catch (error) {
      console.log("Error fetching chat room", error);
    }
  };

  const fetchJoinedChatRoom = async () => {
    const userId = await getUserIdFromToken();
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      alert("No token found. Please log in.");
      return;
    }

    try {
      const response = await axios.get(
        `${API_BASE_URL}/get/support_group/${userId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Use your actual token
          },
        }
      );

      setJoinedChatRooms(response.data);
    } catch (error) {
      console.log("Error fetching joined chat room", error);
    }
  };

  const handleJoinChatRoom = async (room) => {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      alert("No token found. Please log in.");
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/support_group_user/`,
        {
          group_id: room.id,
          user_id: userId,
          date: new Date().toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Successfully joined the chat room!");
        fetchChatRoom(); // Refresh chat rooms after joining
        fetchJoinedChatRoom();
        // Navigate to the chat room after joining
        navigation.navigate("ChatRoomElderly", {
          group_id: room.id,
          group_name: room.group_name,
        });
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert(error.response.data.error); // Show the error message from the backend
      } else {
        console.error("Error joining chat room:", error);
        alert("An error occurred while trying to join the chat room.");
      }
    }
  };

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
    fetchEvents(searchQuery);
  };

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
            placeholder="Search Events and Groups..."
            value={searchQuery}
            onChangeText={setSearchQuery}
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
          >
            <Text style={styles.seTabText}>Events</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.seTabButton,
              activeTab === "chat" && styles.seActiveTab,
            ]}
            onPress={() => handleTabChange("chat")}
          >
            <Text style={styles.seTabText}>Chat Room</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.seTabButton,
              activeTab === "ongoing" && styles.seActiveTab,
            ]}
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
            onPress={() => handleTabChange("past")}
          >
            <Text style={styles.seTabText}>Past Events</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.eEventsScrollView}>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <>
              {activeTab === "events" && (
                <>
                  <Text style={styles.sectionTitle}>Events</Text>
                  <View style={styles.displayUnderline}></View>
                  <FlatList
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
                  <View style={styles.filterButtonContainer}>
                    <TouchableOpacity
                      style={[
                        styles.filterButton,
                        selectedFilter === "publicChat"
                          ? styles.activeFilter
                          : styles.inactiveFilter,
                      ]}
                      onPress={() => setSelectedFilter("publicChat")}
                    >
                      <Text
                        style={[
                          styles.filterButtonText,
                          selectedFilter === "publicChat"
                            ? styles.activeFilterText
                            : styles.inactiveFilterText,
                        ]}
                      >
                        Available Chat Rooms
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.filterButton,
                        selectedFilter === "myChat"
                          ? styles.activeFilter
                          : styles.inactiveFilter,
                      ]}
                      onPress={() => setSelectedFilter("myChat")}
                    >
                      <Text
                        style={[
                          styles.filterButtonText,
                          selectedFilter === "myChat"
                            ? styles.activeFilterText
                            : styles.inactiveFilterText,
                        ]}
                      >
                        My Joined Chats
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.singleUnderline}></View>

                  {selectedFilter === "myChat" ? (
                    <>
                      <Text style={styles.sectionTitle}>Joined Chat</Text>
                      <View style={styles.displayUnderline}></View>
                      <FlatList
                        data={joinedChatRooms}
                        keyExtractor={(room) => room.group_id.toString()}
                        renderItem={({ item: room }) => (
                          <ChatRoomCard
                            key={room.id}
                            group_id={room.id}
                            title={room.group_name}
                            group_photo={room.group_photo}
                            fetchChatRoom={fetchJoinedChatRoom}
                            contentContainerStyle={styles.flexListContainer}
                            onJoin={() =>
                              navigation.navigate("ChatRoomElderly", {
                                group_id: room.group_id,
                                group_name: room.group_name,
                              })
                            }
                            isJoined={true} // Pass true for joined rooms
                          />
                        )}
                        ListEmptyComponent={() => (
                          <Text style={styles.noChatRoomText}>
                            You have not joined any chat rooms yet.
                          </Text>
                        )}
                      />
                    </>
                  ) : (
                    <>
                      <Text style={styles.sectionTitle}>Public Chat</Text>
                      <View style={styles.displayUnderline}></View>
                      <FlatList
                        data={chatRooms}
                        keyExtractor={(room) => room.id.toString()}
                        renderItem={({ item: room }) => (
                          <ChatRoomCard
                            key={room.id}
                            group_id={room.id}
                            title={room.group_name}
                            group_photo={room.group_photo}
                            fetchChatRoom={fetchChatRoom}
                            contentContainerStyle={styles.flexListContainer}
                            onJoin={() => handleJoinChatRoom(room)} // Action for joining public chat
                            isJoined={false} // Pass false for public rooms
                          />
                        )}
                        ListEmptyComponent={() => (
                          <Text style={styles.noChatRoomText}>
                            No available chat rooms to join.
                          </Text>
                        )}
                      />
                    </>
                  )}
                </>
              )}

              {activeTab === "ongoing" && (
                <>
                  <Text style={styles.sectionTitle}>
                    Ongoing Registered Events
                  </Text>
                  <View style={styles.displayUnderline}></View>
                  <FlatList
                    data={events
                      .filter((event) => event.joined_at) // Ensure joined_at exists
                      .sort(
                        (a, b) => new Date(a.joined_at) - new Date(b.joined_at)
                      )} // Sort by joined_at in ascending order
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
