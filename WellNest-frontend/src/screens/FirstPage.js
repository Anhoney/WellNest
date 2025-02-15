// FirstPage.js
import React, { useEffect } from "react";
import { ImageBackground, View, Text } from "react-native";
import styles from "../components/styles"; // Import shared styles

const FirstPage = ({ navigation }) => {
  useEffect(() => {
    // Navigate to login page after 3 seconds
    setTimeout(() => {
      navigation.navigate("LoginPage");
    }, 3000);
  }, []);

  return (
    <ImageBackground
      source={require("../../assets/FirstPage.png")}
      style={styles.background}
    >
      <View style={styles.firstContainer}>
        <Text style={styles.titleFirstLine}>Welcome to</Text>
        <Text style={styles.titleSecondLine}>WellNest</Text>
      </View>
    </ImageBackground>
  );
};

export default FirstPage;
