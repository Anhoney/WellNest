import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

const ChatRoomCard = ({ title, onJoin }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Button title="Join" onPress={onJoin} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#d6e4ff",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
});

export default ChatRoomCard;
