// LoginPage.js
import React, { useContext, useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  TextInput,
  TouchableOpacity,
} from "react-native";
import styles from "../components/styles"; // Import shared styles
import { Ionicons } from "@expo/vector-icons"; // Import icons from Expo
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { AuthContext } from "../../context/AuthProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../../config/config";
import { useNotification } from "../../context/NotificationProvider";

const LoginPage = () => {
  const [phoneNo, setphoneNo] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setPasswordVisible] = useState(false); // For toggling password visibility
  const navigation = useNavigation();
  const { login } = useContext(AuthContext);
  const { initializeInterval } = useNotification();
  const handleLogin = async () => {
    setphoneNo("");
    setPassword("");
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        phoneNo,
        password,
      });

      const { token, role, full_name, userId } = response.data;

      if (token && userId) {
        await login(token); // Use login function from AuthProvider to set token
        // Save the token and userId using AsyncStorage
        await AsyncStorage.setItem("token", token);

        // Save `userId` and `full_name` in AsyncStorage
        if (userId) {
          await AsyncStorage.setItem("userId", userId.toString());
        } else {
          console.warn("UserId not found in response.");
        }

        // Optional: Save user details
        if (full_name) {
          await AsyncStorage.setItem("full_name", full_name);
        }
        initializeInterval();

        // Navigate based on role
        if (role === "1" || role === "4") {
          navigation.navigate("MainPage");
        } else if (role === "2") {
          navigation.navigate("CommunityOrganizerMainPage");
        } else if (role === "3") {
          navigation.navigate("HealthcareProviderMainPage");
        } else {
          alert("Invalid role");
        }
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

        <View style={[{ marginBottom: 50 }]}></View>
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
  );
};

export default LoginPage;
