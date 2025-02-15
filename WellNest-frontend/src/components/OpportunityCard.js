// OpportunityCard.js
import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

// Import a default photo from your assets or provide a URL
const defaultPhoto = require("../../assets/elderlyOpportunityPhoto.webp"); // Update the path as needed

const OpportunityCard = ({ image, title, location, date, price }) => {
  const imageSource =
    typeof image === "string" && image && image.trim() !== ""
      ? { uri: image }
      : defaultPhoto;

  return (
    <View style={styles.card}>
      <Image source={imageSource} style={styles.image} resizeMode="cover" />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.details}>Location: {location}</Text>
      <Text style={styles.details}>Date: {date}</Text>
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
    width: "100%",
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

export default OpportunityCard;
