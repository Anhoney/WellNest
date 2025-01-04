import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const EventCard = ({ image, title, location, date, price }) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: image }} style={styles.image} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.details}>{location}</Text>
      <Text style={styles.details}>{date}</Text>
      <Text style={styles.price}>{price}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    height: 150,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  details: {
    fontSize: 14,
    marginVertical: 2,
  },
  price: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#28a745",
  },
});

export default EventCard;
