//SocialEventsManagement.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  Image,
  ActivityIndicator,
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const CoSocialEventsManagement = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [activeTab, setActiveTab] = useState("events"); // State to manage active tab
  const [co_id, setCo_id] = useState(null);
  const [events, setEvents] = useState([]);
  const [eventPhoto, setEventPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chatRooms, setChatRooms] = useState([]);
  const [coChatRooms, setCoChatRooms] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("publicChat");

  useFocusEffect(
    React.useCallback(() => {
      const fetchUserIdAndEvents = async () => {
        setLoading(true);
        const co_id = await getUserIdFromToken();
        console.log("co_id", co_id);
        if (co_id) {
          setCo_id(co_id);
          await fetchEvents(co_id);
        }
        setLoading(false);
      };
      fetchUserIdAndEvents();
      fetchAllChatRoom();
      fetchMyChatRoom();
    }, [])
  );

  const fetchAllChatRoom = async () => {
    const userId = await getUserIdFromToken();
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      alert("No token found. Please log in.");
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/get/support_group/`, {
        headers: {
          Authorization: `Bearer ${token}`, // Use your actual token
        },
      });
      console.log("response.data", response.data);

      setChatRooms(response.data);
    } catch (error) {
      console.log("Error fetching chat room", error);
    }
  };

  const fetchMyChatRoom = async () => {
    const coId = await getUserIdFromToken();
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      alert("No token found. Please log in.");
      return;
    }

    try {
      const response = await axios.get(
        `${API_BASE_URL}/getCo/support_group/${coId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Use your actual token
          },
        }
      );
      console.log("response.data", response.data);

      setCoChatRooms(response.data);
    } catch (error) {
      console.log("Error fetching chat room", error);
    }
  };

  const fetchEvents = async (co_id, query = "") => {
    try {
      console.log("Co_id of fetchEvents", co_id);
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        alert("No token found. Please log in.");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/get/events/${co_id}?search=${query}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data.events) {
        setEvents(data.events);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
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

  const handleSearch = () => {
    console.log("Search:", searchQuery);
    // Implement search functionality here
    fetchEvents(co_id, searchQuery);
  };

  // Get today's date
  const today = new Date();

  // const chatRooms = [
  //   {
  //     id: "1",
  //     title: "Dementia Support!",
  //   },
  //   {
  //     id: "2",
  //     title: "Mental Talk",
  //   },
  // ];

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
          placeholder="Search Event ..."
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
              activeTab === "registrationDue" && styles.seActiveTab,
            ]}
            onPress={() => {
              setActiveTab("registrationDue");
              fetchEvents(co_id); // Fetch events with registration due dates
            }}
          >
            <Text style={styles.seTabText}>Registration Due Events</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.scrollView}>
          {/* <ScrollView contentContainerStyle={styles.scrollView}> */}
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <>
              {activeTab === "events" && (
                <>
                  <Text style={styles.sectionTitle}>My Events</Text>
                  <View style={styles.displayUnderline}></View>
                  <FlatList
                    data={events
                      .filter(
                        (event) =>
                          new Date(event.registration_due) >= new Date()
                      )
                      .sort(
                        (a, b) =>
                          new Date(a.registration_due) -
                          new Date(b.registration_due)
                      )}
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
                            navigation.navigate("CoSocialEventsDetails", {
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

                  <TouchableOpacity
                    style={styles.addEventButton}
                    onPress={() => navigation.navigate("CoCreateNEditEvents")}
                  >
                    <Text style={styles.addEventText}>Add Event</Text>
                    <Ionicons name="add" size={24} color="#FFF" />
                  </TouchableOpacity>
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
                        My Created{"\n"}Chat Rooms
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
                        Private / Events{"\n"} {"  "}Chats Room
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.singleUnderline}></View>

                  {selectedFilter === "myChat" ? (
                    <>
                      <Text style={styles.sectionTitle}>
                        Private / Events Chats Room
                      </Text>
                      <View style={styles.displayUnderline}></View>
                      <FlatList
                        data={coChatRooms}
                        keyExtractor={(room) => room.id.toString()}
                        contentContainerStyle={styles.listContainer}
                        renderItem={({ item: room }) => (
                          <ChatRoomCard
                            key={room.id}
                            group_id={room.id}
                            title={room.group_name}
                            group_photo={room.group_photo}
                            fetchChatRoom={fetchMyChatRoom}
                            // onJoin={() => alert(`Joining ${room.group_name}`)}
                            onJoin={() =>
                              navigation.navigate("chatRoom", {
                                group_id: room.id,
                                group_name: room.group_name,
                              })
                            }
                          />
                        )}
                      />
                    </>
                  ) : (
                    <>
                      <Text style={styles.sectionTitle}>
                        My Created Chat Rooms
                      </Text>
                      <View style={styles.displayUnderline}></View>
                      <FlatList
                        data={coChatRooms}
                        keyExtractor={(room) => room.id.toString()}
                        contentContainerStyle={styles.listContainer}
                        renderItem={({ item: room }) => (
                          <ChatRoomCard
                            key={room.id}
                            group_id={room.id}
                            title={room.group_name}
                            group_photo={room.group_photo}
                            fetchChatRoom={fetchMyChatRoom}
                            // onJoin={() => alert(`Joining ${room.group_name}`)}
                            onJoin={() =>
                              navigation.navigate("chatRoom", {
                                group_id: room.id,
                                group_name: room.group_name,
                              })
                            }
                          />
                        )}
                      />
                    </>
                  )}
                  <TouchableOpacity
                    style={styles.addEventButton}
                    onPress={() =>
                      navigation.navigate("AddChatRoom", { fetchAllChatRoom })
                    }
                  >
                    <Text style={styles.addEventText}>
                      Add {"\n"}Chat {"\n"}Room
                    </Text>
                    <Ionicons name="add" size={24} color="#FFF" />
                  </TouchableOpacity>
                </>
              )}

              {/* Private Chat Room for Registered Events Section */}
              {/* <Text
                    style={[styles.sectionTitle, styles.privateChatRoomTitle]}
                  >
                    Private Chat Room for Events
                  </Text>
                  <View style={styles.displayUnderline}></View>
                  {chatRooms.length === 0 ? (
                    <Text style={styles.noChatRoomText}>
                      No private chat rooms available yet.
                    </Text>
                  ) : (
                    <FlatList
                      data={chatRooms}
                      keyExtractor={(room) => room.id.toString()}
                      contentContainerStyle={styles.scrollView}
                      renderItem={({ item: room }) => (
                        <ChatRoomCard
                          key={room.id}
                          group_id={room.id}
                          title={room.group_name}
                          group_photo={room.group_photo}
                          fetchChatRoom={fetchAllChatRoom}
                          onJoin={() =>
                            navigation.navigate("chatRoom", {
                              group_id: room.id,
                              group_name: room.group_name,
                            })
                          }
                        />
                      )}
                    />
                  )} */}

              {/* <Text style={styles.sectionTitle}>Public Chat Rooms</Text>
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
                        fetchChatRoom={fetchAllChatRoom}
                        // onJoin={() => alert(`Joining ${room.group_name}`)}
                        onJoin={() =>
                          navigation.navigate("chatRoom", {
                            group_id: room.id,
                            group_name: room.group_name,
                          })
                        }
                      />
                    )}
                  /> */}

              {activeTab === "registrationDue" && (
                <>
                  <Text style={styles.sectionTitle}>
                    My Registration Due Events
                  </Text>
                  <View style={styles.displayUnderline}></View>
                  <FlatList
                    data={events
                      .filter(
                        (event) => new Date(event.registration_due) < new Date()
                      )
                      .sort(
                        (a, b) =>
                          new Date(b.registration_due) -
                          new Date(a.registration_due)
                      )}
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
                            navigation.navigate("CoSocialEventsDetails", {
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
            </>
          )}
          {/* </ScrollView> */}
        </View>
      </View>
      <CoNavigationBar navigation={navigation} activePage="" />
    </ImageBackground>
  );
};

export default CoSocialEventsManagement;
