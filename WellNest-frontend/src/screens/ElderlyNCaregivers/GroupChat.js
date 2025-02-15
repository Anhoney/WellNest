// GroupChat.js
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  FlatList,
} from "react-native";
import ChatRoomCard from "../../components/ChatRoomCard";
import styles from "../../components/styles";
import { Ionicons } from "@expo/vector-icons";
import { getUserIdFromToken } from "../../../services/authService";
import NavigationBar from "../../components/NavigationBar"; // Import your custom navigation bar component
import API_BASE_URL from "../../../config/config";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const GroupChat = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("events"); // State to manage active tab
  const [userId, setUserId] = useState(null);
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
        fetchJoinedChatRoom();
      }
    }, [userId, activeTab])
  );

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
      </View>
      <NavigationBar navigation={navigation} activePage="" />
    </ImageBackground>
  );
};

export default GroupChat;
