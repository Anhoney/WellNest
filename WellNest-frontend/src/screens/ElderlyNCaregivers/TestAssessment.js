// TestAssessment.js
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

const TestAssessment = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [totalMarks, setTotalMarks] = useState(null);
  const [resultText, setResultText] = useState("");
  const navigation = useNavigation();
  const route = useRoute();
  const { assessmentId } = route.params;
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    getUserIdFromToken().then((userId) => {
      setUserId(userId);
    });
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await axios.get(
          `${API_BASE_URL}/assessments/${assessmentId}/questions`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data) {
          setQuestions(response.data);
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
        Alert.alert("Error", "Unable to fetch questions at this time.");
      }
    };

    fetchQuestions();
  }, [assessmentId]);

  const handleAnswerSelect = (questionId, answerId) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answerId, // Store the selected answer for the question
    }));
  };

  const handleSubmit = async () => {
    // Check if all questions have been answered
    const unansweredQuestions = questions.filter(
      (question) => !selectedAnswers[question.question_id]
    );

    if (unansweredQuestions.length > 0) {
      Alert.alert("Error", "Please answer all questions before submitting.");
      return;
    }

    // Here you can handle the submission of selected answers
    // For example, you can send the selected answers to the backend
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/assessments/${assessmentId}/submit`, // Adjust the endpoint as needed
        { answers: selectedAnswers },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      //   if (response.data) {
      //     setTotalMarks(response.data.totalMarks);
      //     setResultText(response.data.resultText);
      //     Alert.alert("Success", "Your answers have been submitted!");
      //   }

      if (response.data) {
        const { totalMarks, resultText } = response.data;

        // Save the assessment results
        await axios.post(
          `${API_BASE_URL}/assessments/${assessmentId}/results/save`, // Adjust the endpoint as needed
          { userId, totalMarks, overallResult: resultText },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setTotalMarks(totalMarks);
        setResultText(response.data.resultText);
        Alert.alert("Success", "Your answers have been submitted!");
        // navigation.goBack();
      }

      //   Alert.alert("Success", "Your answers have been submitted!");
      //   navigation.goBack(); // Navigate back after submission
    } catch (error) {
      console.error("Error submitting answers:", error);
      Alert.alert("Error", "Unable to submit your answers at this time.");
    }
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
        <Text style={styles.hpTitle}>Test Assessment</Text>
      </View>
      <ScrollView contentContainerStyle={styles.hpContainer}>
        <Text style={styles.sectionTitle}>Assessment Details{"\n"}</Text>
        <View style={styles.singleUnderline}></View>
        {questions.map((question, index) => (
          <View key={question.question_id} style={styles.eQuestionContainer}>
            {/* <Text style={styles.eQuestionText}>{question.question_text}</Text> */}
            <Text style={styles.eQuestionText}>
              {index + 1}. {question.question_text}{" "}
              {/* Display question number */}
            </Text>
            {question.answers.map((answer) => (
              <TouchableOpacity
                key={answer.answer_id}
                style={[
                  styles.eAnswerButton,
                  selectedAnswers[question.question_id] === answer.answer_id &&
                    styles.eSelectedAnswer,
                ]}
                onPress={() =>
                  handleAnswerSelect(question.question_id, answer.answer_id)
                }
              >
                <Text style={styles.eAnswerText}>{answer.answer_text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
        <TouchableOpacity style={styles.signOutButton} onPress={handleSubmit}>
          <Text style={styles.signOutButtonText}>Submit Answers</Text>
        </TouchableOpacity>

        {totalMarks !== null && (
          <View>
            <View style={styles.eResultContainer}>
              <Text style={styles.eResultText}>Total Marks: {totalMarks}</Text>
              <Text style={styles.eResultText}>Result: {resultText}</Text>
            </View>
            <TouchableOpacity
              style={styles.eSubmitButton}
              onPress={navigation.goBack}
            >
              <Text style={styles.eSubmitButtonText}>Back</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
      <CoNavigationBar navigation={navigation} />
    </ImageBackground>
  );
};

export default TestAssessment;
