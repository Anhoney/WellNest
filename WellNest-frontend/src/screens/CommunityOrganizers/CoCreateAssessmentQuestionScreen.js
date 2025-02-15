// CreateAssessmentQuestionScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  FlatList,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../../components/styles"; // Import your shared styles
import CoNavigationBar from "../../components/CoNavigationBar"; // Import your custom navigation bar component

const CoCreateAssessmentQuestionScreen = ({ route, navigation }) => {
  const { title, pattern, choices } = route.params; // Get title, pattern, and choices from previous screen
  const [questions, setQuestions] = useState([
    { question: "", answers: [{ text: "", mark: 0 }] },
  ]);

  const handleAddQuestion = () => {
    setQuestions([...questions, { question: "", answers: [""] }]); // Add a new question
  };

  const handleQuestionChange = (text, index) => {
    const newQuestions = [...questions];
    newQuestions[index].question = text; // Update the question text
    setQuestions(newQuestions);
  };

  const handleAnswerChange = (text, questionIndex, answerIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].answers[answerIndex] = text; // Update the answer text
    setQuestions(newQuestions);
  };

  const handleAddAnswer = (questionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].answers.push(""); // Add a new answer
    setQuestions(newQuestions);
  };

  const handleSubmit = async () => {
    if (
      !title ||
      questions.some(
        (q) => !q.question || q.answers.some((a) => !a.text || a.mark === "")
      )
    ) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    try {
      const payload = {
        co_id: userId, // Assuming userId is the logged-in community organizer's ID
        title,
        photo: photo ? await toBase64(photo) : null, // Convert image to base64 string if available
        questions,
      };

      const response = await axios.post(
        `${API_BASE_URL}/api/assessments`,
        payload
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
        <Text style={styles.hpTitle}>Create Assessment Questions</Text>
      </View>

      <View style={styles.hpContainer}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.subTitle}>Question Pattern: {pattern}</Text>

        <FlatList
          data={questions}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.questionContainer}>
              <TextInput
                style={styles.hpInput}
                placeholder="Enter your question"
                value={item.question}
                onChangeText={(text) => handleQuestionChange(text, index)}
              />
              {item.answers.map((answer, answerIndex) => (
                <TextInput
                  key={answerIndex}
                  style={styles.hpInput}
                  placeholder={`Answer ${answerIndex + 1}`}
                  value={answer}
                  onChangeText={(text) =>
                    handleAnswerChange(text, index, answerIndex)
                  }
                />
              ))}
              <TouchableOpacity
                style={styles.addAnswerButton}
                onPress={() => handleAddAnswer(index)}
              >
                <Text style={styles.addAnswerText}>Add Answer</Text>
              </TouchableOpacity>
            </View>
          )}
        />

        <TouchableOpacity
          style={styles.addQuestionButton}
          onPress={handleAddQuestion}
        >
          <Text style={styles.addQuestionText}>Add Question</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>

      <CoNavigationBar navigation={navigation} />
    </ImageBackground>
  );
};

export default CoCreateAssessmentQuestionScreen;
