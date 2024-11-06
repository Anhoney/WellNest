import React, { useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  Image,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import styles from "../components/styles"; // Import shared styles
import { Ionicons } from "@expo/vector-icons"; // Import icons from Expo
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const LoginPage = () => {
  const [phoneNo, setphoneNo] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setPasswordVisible] = useState(false); // For toggling password visibility
  const navigation = useNavigation();

  const handleLogin = async () => {
    // Handle login logic here, e.g., send to backend for validation
    //console.log('Logging in with IC:', phoneNo, 'Password:', password);
    // You can add your login authentication logic here
    // If login is successful, call the handleLogin function
    // if (username === 'test' && password === 'password') {  // Replace with actual logic
    //   handleLogin();
    // } else {
    //   alert('Invalid credentials');
    // }
    try {
      const response = await axios.post(
        "http://localhost:5001/api/auth/login",
        { phoneNo, password }
      );
      if (response.data.token) {
        // Navigate to the main page if login is successful
        navigation.navigate("MainPage"); // Define MainPage in your navigation stack
      } else {
        alert("Login failed");
      }
    } catch (error) {
      console.error(
        "Login error:",
        error.response ? error.response.data : error.message
      );
      alert("Login failed");
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  return (
    // <TouchableWithoutFeedback onPress={Keyboard.dismiss}> {/* Dismiss keyboard on touch outside */}
    // <View style={{ flex: 1 }}> {/* Wrap in a single View */}
    <ImageBackground
      source={require("../../assets/LoadingBackground.png")}
      style={styles.background}
    >
      <View style={styles.titleContainer}>
        <Text style={styles.titleFirstLine}>Welcome to</Text>
        <Text style={styles.titleSecondLine}>WellNest</Text>
      </View>

      <View style={styles.container}>
        <Text style={styles.subtitle}>Welcome again!{"\n"}Please log in.</Text>

        {/* Identity Card Input with Icon */}
        <View style={styles.inputContainer}>
          <Ionicons name="call" size={24} color="#888" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={phoneNo}
            onChangeText={setphoneNo}
            keyboardType="numeric"
            placeholderTextColor="#888"
          />
        </View>

        {/* Password Input with Icon */}
        <View style={styles.inputContainer}>
          <Ionicons
            name="lock-closed"
            size={24}
            color="#888"
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!isPasswordVisible} // Toggle visibility
            placeholderTextColor="#888"
          />
          {/* Make sure TouchableOpacity wraps around the icon properly */}
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={{ marginLeft: 10 }}
          >
            <Ionicons
              name={isPasswordVisible ? "eye-off" : "eye"}
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        </View>

        <View style={{ alignItems: "flex-start", width: "90%" }}>
          {/* Forgot Password */}
          <TouchableOpacity
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            <Text style={styles.forgotPassword}>Forgot password?</Text>
          </TouchableOpacity>
        </View>

        {/* Login Button */}
        <TouchableOpacity
          onPress={handleLogin}
          style={styles.button}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        {/* Register Link in Orange */}
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.registerText}>
            Don't Have An Account?{" "}
            <Text style={styles.registerLink}>Register</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
    // </View>
    // </TouchableWithoutFeedback>
  );
};

export default LoginPage;
