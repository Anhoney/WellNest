// ChatRoomCard.js
import React from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";

const ChatRoomCard = ({ title, onJoin, onEnter, group_photo, isJoined }) => {
  return (
    <View style={styles.card}>
      <Image
        source={
          group_photo
            ? { uri: group_photo }
            : require("../../assets/GroupChatDefault.png")
        }
        style={styles.groupPhoto}
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        {!isJoined ? (
          <TouchableOpacity style={styles.joinButton} onPress={onJoin}>
            <Text style={styles.joinButtonText}>Join</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.joinedButton} onPress={onJoin}>
            <Text style={styles.joinedButtonText}>Enter</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row", // Horizontal layout
    backgroundColor: "#d6e4ff",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  groupPhoto: {
    width: 80,
    height: 80,
    borderRadius: 40, // Circular image
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  joinButton: {
    backgroundColor: "#4caf50", // Green color
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    alignItems: "center",
  },
  joinButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  joinedText: {
    color: "#888",
    fontSize: 14,
  },
  joinedButton: {
    backgroundColor: "#2196f3",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    alignItems: "center",
  },
  joinedButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default ChatRoomCard;
