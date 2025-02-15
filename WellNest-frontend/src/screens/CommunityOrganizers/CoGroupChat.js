// CoChatRoom.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
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

const CoGroupChat = () => {
  const navigation = useNavigation();
  const [co_id, setCo_id] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chatRooms, setChatRooms] = useState([]);
  const [coChatRooms, setCoChatRooms] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchUserIdAndEvents = async () => {
        setLoading(true);
        const co_id = await getUserIdFromToken();

        if (co_id) {
          setCo_id(co_id);
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
      setCoChatRooms(response.data);
    } catch (error) {
      console.log("Error fetching chat room", error);
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

      <View style={styles.assessmentContainer}>
        <View style={styles.scrollView}>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <>
              <Text style={styles.sectionTitle}>
                My Created Support Group Chat
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
                    onJoin={() =>
                      navigation.navigate("chatRoom", {
                        group_id: room.id,
                        group_name: room.group_name,
                      })
                    }
                  />
                )}
              />

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
        </View>
      </View>
      <CoNavigationBar navigation={navigation} activePage="" />
    </ImageBackground>
  );
};

export default CoGroupChat;
