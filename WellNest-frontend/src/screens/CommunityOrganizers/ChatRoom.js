//ChatRoom.js
import React, { useEffect, useState } from "react";
import {
  ImageBackground,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  Alert,
} from "react-native";
import styles from "../../components/styles";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import API_BASE_URL from "../../../config/config";
import { getUserIdFromToken } from "../../../services/authService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AntDesign from "@expo/vector-icons/AntDesign";

const ChatRoom = ({ route }) => {
  const { group_id, group_name } = route.params;
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState("");
  const [newMessage, setNewMessage] = useState("");

  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserId = async () => {
      const user_Id = await getUserIdFromToken();
      if (user_Id) {
        setUserId(user_Id);
      }
    };
    fetchAllGroupMessage();
    fetchUserId();
  }, []);

  const handleSendMessage = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const now = new Date();

      const url = `${API_BASE_URL}/support_group_message/`;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const data = {
        group_id: group_id,
        user_id: userId,
        message: newMessage,
        message_date: now.toLocaleDateString("en-CA"),
        message_time: now.toLocaleTimeString("en-GB", { hour12: false }),
      };

      const response = await axios.post(url, data, config);

      setNewMessage("");
      fetchAllGroupMessage();

      // Alert.alert("Success", response.data.message);
    } catch (error) {
      console.error("Error send message:", error.message);
      Alert.alert("Error", "Failed to send message. Try again later");
    }
  };

  const fetchAllGroupMessage = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const url = `${API_BASE_URL}/support_group_message/${group_id}`;

      const response = await axios.get(url, config);
      setMessages(response.data);
    } catch (error) {
      console.log("Error fetching chat room message", error);
    }
  };

  //   const renderItem = ({ item }) => (
  //     <View
  //       style={[
  //         localstyles.messageContainer,
  //         item.user_id === userId
  //           ? localstyles.messageContainerRight
  //           : localstyles.messageContainerLeft,
  //         // && localstyles.messageContainerRight,
  //       ]}
  //     >
  //       <Text style={localstyles.messageText}>{item.message}</Text>
  //       <Text style={localstyles.messageDate}>
  //         {new Date(item.message_date).toLocaleDateString()}
  //       </Text>
  //       <Text style={localstyles.messageTime}>{item.message_time}</Text>
  //     </View>
  //     // <View
  //     //   style={[
  //     //     localstyles.messageContainer,
  //     //     item.user_id === userId
  //     //       ? localstyles.messageContainerRight
  //     //       : localstyles.messageContainerLeft,
  //     //   ]}
  //     // >
  //     //   <Text style={localstyles.messageText}>{item.message}</Text>
  //     //   <Text
  //     //     style={localstyles.messageTime}
  //     //   >{`${item.message_date} ${item.message_time}`}</Text>
  //     // </View>
  //   );

  //   const renderItem = ({ item, index }) => {
  //     const showDate =
  //       index === 0 ||
  //       new Date(messages[index - 1].message_date).toLocaleDateString() !==
  //         new Date(item.message_date).toLocaleDateString();

  //     return (
  //       <View>
  //         {showDate && (
  //           <Text style={localstyles.messageDate}>
  //             {new Date(item.message_date).toLocaleDateString()}
  //           </Text>
  //         )}
  //         <View
  //           style={[
  //             localstyles.messageContainer,
  //             item.user_id === userId
  //               ? localstyles.messageContainerRight
  //               : localstyles.messageContainerLeft,
  //           ]}
  //         >
  //           <Text style={localstyles.messageText}>{item.message}</Text>
  //           <Text style={localstyles.messageTime}>{item.message_time}</Text>
  //         </View>
  //       </View>
  //     );
  //   };

  const renderItem = ({ item, index }) => {
    const showDate =
      index === 0 ||
      new Date(messages[index - 1].message_date).toLocaleDateString() !==
        new Date(item.message_date).toLocaleDateString();
    const isUserMessage = item.user_id === userId;

    return (
      <View>
        {showDate && (
          <Text style={localstyles.messageDate}>
            {new Date(item.message_date).toLocaleDateString()}
          </Text>
        )}
        <Text
          style={[
            localstyles.fullNameText,
            isUserMessage
              ? localstyles.fullNameRight
              : localstyles.fullNameLeft,
          ]}
        >
          {item.full_name} {/* Assuming full_name is part of the item */}
        </Text>
        <View
          style={[
            localstyles.messageContainer,
            isUserMessage
              ? localstyles.messageContainerRight
              : localstyles.messageContainerLeft,
          ]}
        >
          {/* <Text style={localstyles.messageText}>{item.message}</Text> */}
          <Text
            style={[
              localstyles.messageText,
              { color: isUserMessage ? "#fff" : "#000" },
            ]}
          >
            {item.message}
          </Text>
          <Text
            style={[
              localstyles.messageTime,
              { color: isUserMessage ? "#fff" : "#000" },
            ]}
          >
            {item.message_time}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <ImageBackground
      source={require("../../../assets/PlainGrey.png")}
      style={styles.background}
    >
      <View style={styles.smallHeaderContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        {/* <Text style={styles.hpTitle}>{group_name}</Text> */}
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={styles.hpTitle}>{group_name}</Text>
        </View>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("CoManageChatRoom", {
              group_id: group_id,
              group_name: group_name,
            })
          }
          style={{ marginLeft: "auto" }} // Align to right
          //   style={styles.plusButton}
        >
          <AntDesign name="plus" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      <View style={[{ marginBottom: 25 }]}></View>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
      <View style={localstyles.inputContainer}>
        <TextInput
          style={localstyles.input}
          placeholder="Type your message..."
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <TouchableOpacity
          onPress={handleSendMessage}
          style={localstyles.sendButton}
        >
          <Text style={localstyles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const localstyles = StyleSheet.create({
  // background: {
  //     flex: 1,
  // },
  // smallHeaderContainer: {
  //     flexDirection: 'row',
  //     alignItems: 'center',
  //     padding: 16,
  // },
  // backButton: {
  //     marginRight: 8,
  // },
  // hpTitle: {
  //     fontSize: 18,
  //     fontWeight: 'bold',
  // },
  // messageContainer: {
  //     padding: 16,
  //     borderBottomWidth: 1,
  //     borderBottomColor: '#ccc',
  //     alignSelf: 'flex-start', // Align to left by default
  // },
  // messageContainerRight: {
  //     alignSelf: 'flex-end', // Align to right if user_id matches
  //     backgroundColor: '#e0f7fa', // Optional: Different background color for user's messages
  // },
  // messageText: {
  //     fontSize: 16,
  // },
  // messageDate: {
  //     fontSize: 14,
  //     color: '#888',
  // },
  // messageTime: {
  //     fontSize: 14,
  //     color: '#888',
  // },
  // inputContainer: {
  //     flexDirection: 'row',
  //     alignItems: 'center',
  //     padding: 16,
  //     borderTopWidth: 1,
  //     borderTopColor: '#ccc',
  //     backgroundColor: '#fff',
  // },
  // input: {
  //     flex: 1,
  //     padding: 10,
  //     borderWidth: 1,
  //     borderColor: '#ccc',
  //     borderRadius: 5,
  // },
  // sendButton: {
  //     marginLeft: 10,
  //     padding: 10,
  //     backgroundColor: '#007bff',
  //     borderRadius: 5,
  // },
  // sendButtonText: {
  //     color: '#fff',
  //     fontWeight: 'bold',
  // },

  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#001f3f",
  },
  backButton: {
    marginRight: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
  },
  messageContainer: {
    marginVertical: 8,
    padding: 12,
    borderRadius: 12,
    maxWidth: "75%",
  },
  messageContainerLeft: {
    alignSelf: "flex-start",
    backgroundColor: "#f1f0f0",
  },
  messageContainerRight: {
    alignSelf: "flex-end",
    backgroundColor: "#007bff",
  },
  messageText: {
    fontSize: 16,
    color: "#333",
  },
  messageTime: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
    textAlign: "right",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    backgroundColor: "#001f3f",
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 0,
    backgroundColor: "#FFF",
    borderRadius: 25,
    paddingHorizontal: 16,
    color: "#000",
  },
  sendButton: {
    marginLeft: 10,
    padding: 10,
    backgroundColor: "#007bff",
    borderRadius: 50,
  },
  messageDate: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginVertical: 8, // Optional for spacing
  },
  fullNameText: {
    fontSize: 14,
    fontWeight: "bold",
    marginVertical: 4,
  },
  // Align full name to the left for non-user messages
  fullNameLeft: {
    alignSelf: "flex-start",
    marginLeft: 12, // Add spacing if needed
  },
  // Align full name to the right for user messages
  fullNameRight: {
    alignSelf: "flex-end",
    marginRight: 12, // Add spacing if needed
  },
});

export default ChatRoom;
