// CoAddAssessmentScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  ImageBackground,
  Image,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import styles from "../../components/styles";
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";
import axios from "axios";
import { RadioButton } from "react-native-paper"; // For the radio button
import CoNavigationBar from "../../components/CoNavigationBar"; // Import your custom navigation bar component
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePickerModal from "react-native-modal-datetime-picker"; // Ensure this is imported
import {
  validateFields,
  getInputStyle,
} from "../../components/validationUtils"; // Import validation functions
import API_BASE_URL from "../../../config/config";
import { getUserIdFromToken } from "../../../services/authService";
import { Buffer } from "buffer";

const CoAddAssessmentScreen = () => {
  const [title, setTitle] = useState("");
  const [photo, setPhoto] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  const [userId, setUserId] = useState(null);
  const [questions, setQuestions] = useState([
    { question: "", answers: [{ text: "", mark: "" }] },
  ]); // State for the questions

  useEffect(() => {
    getUserIdFromToken().then((userId) => {
      setUserId(userId);
    });
  }, []);

  useEffect(() => {
    if (route.params && route.params.assessmentId) {
      fetchAssessment(route.params.assessmentId);
    }
  }, [route.params]);

  const fetchAssessment = async (assessmentId) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        alert("No token found. Please log in.");
        return;
      }

      const response = await axios.get(
        `${API_BASE_URL}/single/assessment/${assessmentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data) {
        setTitle(response.data.title);
        setPhoto(
          response.data.photo
            ? `data:image/png;base64,${response.data.photo}`
            : null
        );
        setQuestions(response.data.questions);
        // setSelectedFile(response.data.photo.uri.split("/").pop());
      }
    } catch (error) {
      console.error("Error fetching assessment data:", error);
      Alert.alert("Error", "Unable to fetch assessment data at this time.");
    }
  };

  const handlePhotoUpload = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert("Permission to access camera roll is required!");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      console.log("ImagePicker result:", result);
      if (!result.canceled) {
        setPhoto(result.assets[0].uri);
        // setSelectedFile(result.assets[0].fileName);
        // setSelectedFile(result.assets[0].uri.split("/").pop());
        setSelectedFile(result);
      } else {
        console.log("Image selection was cancelled.");
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", answers: [{ text: "", mark: "" }] },
    ]); // Add a new question
  };

  const handleRemoveQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index); // Remove the question at the specified index
    setQuestions(newQuestions);
  };

  const handleQuestionChange = (text, index) => {
    const newQuestions = [...questions];
    newQuestions[index].question = text; // Update the question text
    setQuestions(newQuestions);
  };

  const handleAnswerChange = (text, questionIndex, answerIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].answers[answerIndex].text = text; // Update the answer text
    setQuestions(newQuestions);
  };

  const handleMarkChange = (text, questionIndex, answerIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].answers[answerIndex].mark = text; // Update the mark for the answer
    setQuestions(newQuestions);
  };

  const handleAddAnswer = (questionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].answers.push({ text: "", mark: "" }); // Add a new answer
    setQuestions(newQuestions);
  };

  //   const handleSubmit = () => {
  //     // Validate and submit the questions
  //     if (
  //       questions.some(
  //         (q) => !q.question || q.answers.some((a) => !a.text || a.mark === "")
  //       )
  //     ) {
  //       Alert.alert(
  //         "Error",
  //         "Please fill in all questions and answers with marks."
  //       );
  //       return;
  //     }

  //     // Here you can handle the submission of questions to the backend
  //     console.log("Questions submitted:", questions);
  //     Alert.alert("Success", "Assessment questions created successfully!");
  //     navigation.goBack(); // Navigate back after submission
  //   };
  const handleSubmit = async () => {
    // if (
    //   !title ||
    //   questions.some(
    //     (q) => q.question && q.answers.some((a) => !a.text || a.mark === "")
    //   )
    // ) {
    //   Alert.alert("Error", "Please fill in all required fields.");
    //   return;
    // }
    // Check if title and photo are provided
    if (!title) {
      Alert.alert("Error", "Please provide a title.");
      return;
    }

    // Check if there is at least one question with at least two answers
    const validQuestions = questions.filter(
      (q) =>
        q.question &&
        q.answers.length >= 2 &&
        q.answers.some((a) => a.text && a.mark)
    );

    if (validQuestions.length === 0) {
      Alert.alert(
        "Error",
        "Please add at least one question with at least two answers with marks."
      );
      return;
    }

    try {
      console.log("UserId opp:", userId);
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        alert("No token found. Please log in.");
        return;
      }
      const payload = {
        co_id: userId, // Assuming userId is the logged-in community organizer's ID
        title,
        photo: photo ? await toBase64(photo) : null, // Convert image to base64 string if available
        questions,
      };

      const response = await axios.post(
        `${API_BASE_URL}/assessments/${userId}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      Alert.alert("Success", response.data.message);
      navigation.goBack();
    } catch (error) {
      console.error("Error submitting assessment:", error);
      Alert.alert(
        "Error",
        "An error occurred while submitting the assessment."
      );
    }
  };

  // Utility function to convert image to base64
  const toBase64 = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onloadend = () => resolve(reader.result.split(",")[1]); // Base64 without metadata
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  return (
    <ImageBackground
      source={require("../../../assets/PlainGrey.png")}
      style={styles.background}
    >
      <View style={styles.smallHeaderContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.hpTitle}>
          {" "}
          {route.params && route.params.assessmentId
            ? "Edit Assessment"
            : "Create Assessment"}
        </Text>
      </View>
      <ScrollView contentContainerStyle={styles.hpContainer}>
        <Text style={styles.sectionTitle}>Assessment Details{"\n"}</Text>
        <View style={styles.singleUnderline}></View>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Assessment Title</Text>
          <TextInput
            style={styles.hpInput}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter assessment title"
          />

          <Text style={styles.label}>Photo or Icon</Text>
          <TouchableOpacity style={styles.mrinput} onPress={handlePhotoUpload}>
            {/* <Text>📤 Upload Photo</Text> */}
            {/* {photo ? (
              //   <Image
              //     source={{ uri: photo }}
              //     style={styles.uploadedPhotoPreview}
              //   />
              <Text>{selectedFile}</Text>
            ) : (
              <Text>📤 Upload Photo</Text>
            )} */}
            {photo ? (
              <Text>Change Photo</Text>
            ) : selectedFile &&
              selectedFile.assets &&
              selectedFile.assets[0] ? (
              selectedFile.assets[0].fileName
            ) : (
              <Text>📤 Upload Photo</Text>
            )}

            {/* {selectedFile ? (
              <Text>{selectedFile}</Text> // Display the filename if uploaded
            ) : (
              <Text>📤 Upload Photo</Text> // Default text if no file is selected
            )} */}
          </TouchableOpacity>

          <Text style={styles.label}>Create Questions</Text>
          <View style={[styles.displayUnderline, { marginTop: 5 }]} />
          <View style={[{ marginTop: -11 }]} />
          {questions.map((item, questionIndex) => (
            <View
              key={questionIndex}
              style={styles.assessmentQuestionContainer}
            >
              <Text style={styles.label}>Question {questionIndex + 1}</Text>
              <TextInput
                style={styles.hpInput}
                placeholder="Enter your question"
                value={item.question}
                onChangeText={(text) =>
                  handleQuestionChange(text, questionIndex)
                }
              />
              {item.answers.map((answer, answerIndex) => (
                <View
                  key={answerIndex}
                  style={styles.assessmentAnswerContainer}
                >
                  <TextInput
                    style={styles.assessmentInput}
                    placeholder={`Answer ${answerIndex + 1}`}
                    value={answer.text}
                    onChangeText={(text) =>
                      handleAnswerChange(text, questionIndex, answerIndex)
                    }
                  />
                  <TextInput
                    style={styles.hpInput}
                    placeholder="Marks"
                    keyboardType="numeric"
                    value={answer.mark ? answer.mark.toString() : ""}
                    // value={answer.mark}
                    onChangeText={(text) =>
                      handleMarkChange(text, questionIndex, answerIndex)
                    }
                  />
                </View>
              ))}
              <TouchableOpacity
                style={styles.assessmentAddAnswerButton}
                onPress={() => handleAddAnswer(questionIndex)}
              >
                <Text style={styles.assessmentAddAnswerText}>Add Answer</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.assessmentRemoveQuestionButton}
                onPress={() => handleRemoveQuestion(questionIndex)}
              >
                <Text style={styles.assessmentRemoveQuestionText}>
                  Remove Question
                </Text>
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity
            style={styles.assessmentAddQuestionButton}
            onPress={handleAddQuestion}
          >
            <Text style={styles.assessmentAddQuestionText}>Add Question</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.assessmentSubmitButton}
            onPress={handleSubmit}
          >
            <Text style={styles.assessmentSubmitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <CoNavigationBar navigation={navigation} />
    </ImageBackground>
  );
};

export default CoAddAssessmentScreen;
