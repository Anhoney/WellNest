import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList } from "react-native";
import { sendMessage, getChatHistory } from "../services/chatService";

const ChatScreen = ({ route }) => {
  const { userId } = route.params;
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    const chatHistory = await getChatHistory(userId);
    setMessages(chatHistory);
  };

  const handleSendMessage = async () => {
    await sendMessage({
      receiver: userId,
      content: message,
      chatType: "private",
    });
    setMessage("");
    loadChatHistory();
  };

  return (
    <View>
      <FlatList
        data={messages}
        renderItem={({ item }) => <Text>{item.content}</Text>}
        keyExtractor={(item) => item._id}
      />
      <TextInput
        value={message}
        onChangeText={setMessage}
        placeholder="Type a message"
      />
      <Button title="Send" onPress={handleSendMessage} />
    </View>
  );
};

export default ChatScreen;
