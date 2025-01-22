//GroupChat.js
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

const GroupChat = () => {
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

  useFocusEffect(
    React.useCallback(() => {
      if (userId) {
        // fetchChatRoom();
        fetchJoinedChatRoom();
      }
    }, [userId, activeTab])
  );

  //   const fetchChatRoom = async () => {
  //     const userId = await getUserIdFromToken();
  //     const token = await AsyncStorage.getItem("token");
  //     if (!token) {
  //       alert("No token found. Please log in.");
  //       return;
  //     }
  //     console.log("userId", userId);
  //     try {
  //       const response = await axios.get(
  //         `${API_BASE_URL}/getUnjoin/support_group/${userId}/`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`, // Use your actual token
  //           },
  //         }
  //       );
  //       console.log("response.data", response.data);
  //       if (response.status === 200) {
  //         // Handle the response data
  //         setChatRooms(response.data);
  //         console.log("Available support groups:", response.data);
  //       }
  //     } catch (error) {
  //       console.log("Error fetching chat room", error);
  //     }
  //   };

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
      console.log("response.data", response.data);

      setJoinedChatRooms(response.data);
    } catch (error) {
      console.log("Error fetching joined chat room", error);
    }
  };

  //   const handleJoinChatRoom = async (room) => {
  //     const token = await AsyncStorage.getItem("token");
  //     if (!token) {
  //       alert("No token found. Please log in.");
  //       return;
  //     }

  //     try {
  //       const response = await axios.post(
  //         `${API_BASE_URL}/support_group_user/`,
  //         {
  //           group_id: room.id,
  //           user_id: userId,
  //           date: new Date().toISOString(),
  //         },
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );

  //       if (response.status === 200) {
  //         alert("Successfully joined the chat room!");
  //         fetchChatRoom(); // Refresh chat rooms after joining
  //         fetchJoinedChatRoom();
  //         // Navigate to the chat room after joining
  //         navigation.navigate("ChatRoomElderly", {
  //           group_id: room.id,
  //           group_name: room.group_name,
  //         });
  //       }
  //     } catch (error) {
  //       if (error.response && error.response.status === 400) {
  //         alert(error.response.data.error); // Show the error message from the backend
  //       } else {
  //         console.error("Error joining chat room:", error);
  //         alert("An error occurred while trying to join the chat room.");
  //       }
  //     }
  //   };

  const renderEmptyComponent = () => (
    <View style={styles.coEmptyContainer}>
      <Image
        source={require("../../../assets/NothingDog.png")}
        style={styles.emptyImage}
      />
      <Text style={styles.emptyText}>No Social Events or Chat Rooms.</Text>
    </View>
  );

  return (
    <ImageBackground
      source={require("../../../assets/PlainGrey.png")}
      style={styles.background}
    >
      {/* Title Section with Back chevron-back */}
      <View style={styles.smallHeaderContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Group Chat</Text>
      </View>

      <View style={styles.groupChatContainer}>
        {/* <Text style={styles.sectionTitle}>Joined Chat</Text> */}
        {/* <View style={styles.displayUnderline}></View> */}
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
              // onJoin={() => alert(`Joining ${room.group_name}`)}
              //     onJoin={() =>
              //       navigation.navigate("chatRoom", {
              //         group_id: room.id,
              //         group_name: room.group_name,
              //       })
              //     }
              //   />
              // )}
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
      </View>
      <NavigationBar navigation={navigation} activePage="" />
    </ImageBackground>
  );
};

export default GroupChat;
