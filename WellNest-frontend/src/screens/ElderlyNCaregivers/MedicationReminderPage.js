// RegisterPage.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  Platform,
  Alert,
  Image,
} from "react-native";
import { KeyboardAvoidingView } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context"; // Import SafeAreaView for iOS
import axios from "axios";
import * as DocumentPicker from "expo-document-picker"; // Import DocumentPicker
import * as ImagePicker from "react-native-image-picker";
import API_BASE_URL from "../../../config/config";

const MedicationReminderPage = () => {
  const navigation = useNavigation();
  //   const [selectedFile, setSelectedFile] = useState(null);
  const [imageUri, setImageUri] = useState(null);

  // Function to handle document picking
  const handleFileSelection = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: false,
      });
      if (result.type === "success") {
        setFileState(result);
        setFileName(result.name); // Set the file name for feedback
      } else {
        Alert.alert("File selection was canceled");
      }
    } catch (error) {
      console.error("Document selection error:", error);
      Alert.alert("Error selecting document" + error.message);
    }
  };

  // Function to handle the upload
  const handleUpload = async () => {
    if (!selectedFile) {
      Alert.alert("Error", "Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("identityCardImage", {
      uri: selectedFile.uri,
      name: selectedFile.name,
      type: selectedFile.mimeType || "application/octet-stream",
    });

    try {
      const response = await axios.put(
        `${API_BASE_URL}/update-identity-card/2`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      Alert.alert("Success", response.data.message);
    } catch (error) {
      console.error("Upload error:", error);
      Alert.alert("Error", "Failed to upload the file. Please try again.");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <TouchableOpacity
        style={{
          backgroundColor: "#4CAF50",
          padding: 15,
          borderRadius: 5,
          marginBottom: 20,
        }}
        onPress={handleFileSelection}
      >
        <Text style={{ color: "#fff" }}>Select Identity Card Image</Text>
      </TouchableOpacity>

      {selectedFile && (
        <Text style={{ marginBottom: 20 }}>{selectedFile.name}</Text>
      )}

      <TouchableOpacity
        style={{
          backgroundColor: "#2196F3",
          padding: 15,
          borderRadius: 5,
        }}
        onPress={handleUpload}
      >
        <Text style={{ color: "#fff" }}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MedicationReminderPage;
