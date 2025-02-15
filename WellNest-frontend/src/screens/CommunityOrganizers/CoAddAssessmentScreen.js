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
  const [scores, setScores] = useState([{ range: "", result: "" }]);

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

        // Fetch results
        const resultsResponse = await axios.get(
          `${API_BASE_URL}/assessments/${assessmentId}/results`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (resultsResponse.data) {
          setScores(resultsResponse.data); // Set the scores state with fetched results
        }
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

  const handleAddScore = () => {
    setScores([...scores, { range: "", result: "" }]); // Add a new score entry
  };

  const handleScoreChange = (text, index, field) => {
    const newScores = [...scores];
    newScores[index][field] = text; // Update the score or result text
    setScores(newScores);
  };

  const handleRemoveScore = (index) => {
    const newScores = scores.filter((_, i) => i !== index); // Remove the score entry
    setScores(newScores);
  };

  const handleSubmit = async () => {
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

    // Filter out blank scores
    const validScores = scores.filter(
      (score) => score.range.trim() !== "" && score.result.trim() !== ""
    );

    // Check if there are at least two valid scores
    if (validScores.length < 2) {
      Alert.alert("Error", "Please provide at least two valid score entries.");
      return;
    }

    try {
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
        scores,
      };

      if (route.params && route.params.assessmentId) {
        await axios.put(
          `${API_BASE_URL}/edit/assessments/${route.params.assessmentId}`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Update scores
        await axios.put(
          `${API_BASE_URL}/assessments/${route.params.assessmentId}/results`,
          { scores },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        Alert.alert("Success", "Assessment results updated successfully!");
      } else {
        payload.co_id = userId;
        const response = await axios.post(
          `${API_BASE_URL}/assessments/${userId}`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        Alert.alert("Success", response.data.message);
      }
      navigation.goBack();
    } catch (error) {
      console.error("Error submitting assessment:", error);
      Alert.alert(
        "Error",
        "An error occurred while submitting the assessment."
      );
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this assessment? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("token");
              if (!token) {
                alert("No token found. Please log in.");
                return;
              }
              await axios.delete(
                `${API_BASE_URL}/delete/assessment/${route.params.assessmentId}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              Alert.alert("Success", "Assessment deleted successfully!");
              navigation.goBack();
            } catch (error) {
              console.error("Error deleting assessment:", error);
              Alert.alert(
                "Error",
                "An error occurred while deleting the assessment."
              );
            }
          },
        },
      ]
    );
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
            {photo ? (
              <Text>Change Photo</Text>
            ) : selectedFile &&
              selectedFile.assets &&
              selectedFile.assets[0] ? (
              selectedFile.assets[0].fileName
            ) : (
              <Text>📤 Upload Photo</Text>
            )}
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
                    value={
                      answer.mark !== null && answer.mark !== undefined
                        ? answer.mark.toString()
                        : ""
                    }
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

          <Text style={styles.label}>Overall Scores and Results</Text>
          <View style={styles.assessmentScoreContainer}>
            <Text style={[styles.label]}> Scores Range</Text>
            <Text style={[styles.label, { marginLeft: 110 }]}>Results</Text>
          </View>
          <View style={styles.assessmentScoreContainer}>
            <Text style={[styles.label, { marginTop: -10 }]}>
              {"  "}
              (e.g., 0-24)
            </Text>
            <Text style={[styles.label, { marginLeft: 40, marginTop: -10 }]}>
              (e.g., Severely Dependent)
            </Text>
          </View>
          {scores.map((score, index) => (
            <View key={index} style={styles.assessmentScoreQuestionContainer}>
              <View style={styles.assessmentAnswerContainer}>
                <TextInput
                  style={styles.scoreInput}
                  placeholder="Score Range (e.g., 0-24)"
                  value={score.range}
                  onChangeText={(text) =>
                    handleScoreChange(text, index, "range")
                  }
                />
                <TextInput
                  style={styles.hpInput}
                  placeholder="Result (e.g., Severely Dependent)"
                  value={score.result}
                  onChangeText={(text) =>
                    handleScoreChange(text, index, "result")
                  }
                />
              </View>
              <TouchableOpacity
                style={styles.assessmentRemoveQuestionButton}
                onPress={() => handleRemoveScore(index)}
              >
                <Text style={styles.assessmentRemoveQuestionText}>
                  Remove Score
                </Text>
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity
            style={styles.assessmentAddQuestionButton}
            onPress={handleAddScore}
          >
            <Text style={styles.assessmentAddQuestionText}>Add Score</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.assessmentSubmitButton}
            onPress={handleSubmit}
          >
            <Text style={styles.assessmentSubmitButtonText}>Submit</Text>
          </TouchableOpacity>
          <View style={[{ marginTop: -20 }]}></View>
          {/* Render form content */}
          {route.params && route.params.assessmentId && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDelete}
            >
              <Text style={styles.deleteButtonText}>Delete Assessment</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
      <CoNavigationBar navigation={navigation} />
    </ImageBackground>
  );
};

export default CoAddAssessmentScreen;
