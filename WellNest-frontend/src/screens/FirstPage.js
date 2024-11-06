import React, { useEffect } from "react";
import {
  ImageBackground,
  View,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
//import { View, Text, StyleSheet, Image } from 'react-native';
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
        {/* <Text style={styles.title}>Welcome to WellNest</Text> */}
      </View>
    </ImageBackground>
    // <View style={styles.container}>
    //   <Image
    //     source={require('./assets/splash.png')} // Use your app's logo or splash image
    //     style={styles.logo}
    //   />
    //   <Text style={styles.text}>Welcome to WellNest</Text>
    // </View>
  );
};

export default FirstPage;
