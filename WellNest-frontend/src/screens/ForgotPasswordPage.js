// ForgotPasswordPage.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import styles from "../components/styles"; // Import shared styles
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import API_BASE_URL from "../../config/config";

const ForgotPasswordPage = () => {
  const [phoneNo, setPhoneNo] = useState("");
  const [identityCard, setIdentityCard] = useState("");
  const navigation = useNavigation();

  const handleResendLink = () => {
    // Logic for resending the reset password link
  };

  const handleSubmit = () => {
    // Handle forgot password logic here
  };

  return (
    // Dismiss keyboard when touching outside the inputs
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ImageBackground
        source={require("../../assets/LoadingBackground.png")}
        style={styles.background}
      >
        {/* Title Section with Back chevron-back */}
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.title}>Forgot Password</Text>
        </View>
        <View style={styles.container}>
          {/* Instructions */}
          <Text style={styles.subtitle}>RESET YOUR PASSWORD</Text>
          <Text style={styles.instructions}>
            Reset password link will be sent to your mobile phone. Click the
            link to reset your password.
          </Text>
          {/* <Text style={styles.subtitle}>
        RESET YOUR PASSWORD
        Reset password link will be sent to your mobile phone. Click the link to reset your password.
      </Text> */}

          {/* Input for Phone Number */}
          <View style={styles.inputContainer}>
            <Ionicons name="call" size={24} color="#888" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Phone Number (Eg. 0123456789)"
              value={phoneNo}
              onChangeText={setPhoneNo}
              keyboardType="phone-pad"
            />
          </View>

          {/* Input for Identity Card */}
          <View style={styles.inputContainer}>
            <Ionicons name="card" size={24} color="#888" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Identity Card Number"
              value={identityCard}
              onChangeText={setIdentityCard}
              keyboardType="number-pad"
            />
          </View>

          {/* Resend Link */}
          <View style={{ alignItems: "flex-start", width: "90%" }}>
            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>Don’t receive message? </Text>
              <TouchableOpacity onPress={handleResendLink}>
                <Text style={styles.forgotPassword}>
                  Resend verification link
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
};

export default ForgotPasswordPage;

// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ImageBackground,
//   Keyboard,
//   TouchableWithoutFeedback,
//   Alert,
// } from "react-native";
// import styles from "../components/styles"; // Import shared styles
// import Ionicons from "react-native-vector-icons/Ionicons";
// import { useNavigation } from "@react-navigation/native";
// import axios from "axios";

// const ForgotPasswordPage = () => {
//   const [phoneNo, setPhoneNo] = useState("");
//   const [identityCard, setIdentityCard] = useState("");
//   const [otp, setOtp] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [step, setStep] = useState(1); // To manage steps: 1 for sending OTP, 2 for entering OTP and new password
//   const navigation = useNavigation();

//   const handleSendOtp = async () => {
//     try {
//       const response = await axios.post(
//         "`${API_BASE_URL}/forgot-password/send-otp",
//         { phoneNo }
//       );
//       Alert.alert("Success", response.data.message);
//       setStep(2); // Move to the next step to enter OTP and new password
//     } catch (error) {
//       console.error(
//         "Error sending OTP:",
//         error.response ? error.response.data : error.message
//       );
//       // Alert.alert("Error", "Failed to send OTP. Please try again.");
//       Alert.alert(
//         "Error",
//         error.response.data.error || "Failed to send OTP. Please try again."
//       );
//     }
//   };

//   const handleSubmit = async () => {
//     try {
//       const response = await axios.post(
//         "`${API_BASE_URL}/forgot-password/verify-otp",
//         {
//           phoneNo,
//           otp,
//           newPassword,
//         }
//       );
//       Alert.alert("Success", response.data.message);
//       navigation.navigate("LoginPage"); // Navigate back to login page after successful reset
//     } catch (error) {
//       console.error(
//         "Error resetting password:",
//         error.response ? error.response.data : error.message
//       );
//       Alert.alert(
//         "Error",
//         "Failed to reset password. Please check your OTP and try again."
//       );
//     }
//   };

//   return (
//     <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//       <ImageBackground
//         source={require("../../assets/LoadingBackground.png")}
//         style={styles.background}
//       >
//         <View style={styles.headerContainer}>
//           <TouchableOpacity
//             onPress={() => navigation.goBack()}
//             style={styles.backButton}
//           >
//             <Ionicons name="chevron-back" size={24} color="#000" />
//           </TouchableOpacity>
//           <Text style={styles.title}>Forgot Password</Text>
//         </View>
//         <View style={styles.container}>
//           {step === 1 ? (
//             <>
//               <Text style={styles.subtitle}>RESET YOUR PASSWORD</Text>
//               <Text style={styles.instructions}>
//                 A reset password link will be sent to your mobile phone. Click
//                 the link to reset your password.
//               </Text>
//               <View style={styles.inputContainer}>
//                 <Ionicons
//                   name="call"
//                   size={24}
//                   color="#888"
//                   style={styles.icon}
//                 />
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Phone Number (Eg. 0123456789)"
//                   value={phoneNo}
//                   onChangeText={setPhoneNo}
//                   keyboardType="phone-pad"
//                 />
//               </View>
//               <TouchableOpacity style={styles.button} onPress={handleSendOtp}>
//                 <Text style={styles.buttonText}>Send OTP</Text>
//               </TouchableOpacity>
//             </>
//           ) : (
//             <>
//               <Text style={styles.subtitle}>VERIFY OTP</Text>
//               <View style={styles.inputContainer}>
//                 <Ionicons
//                   name="key"
//                   size={24}
//                   color="#888"
//                   style={styles.icon}
//                 />
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Enter OTP"
//                   value={otp}
//                   onChangeText={setOtp}
//                   keyboardType="number-pad"
//                 />
//               </View>
//               <View style={styles.inputContainer}>
//                 <Ionicons
//                   name="lock-closed"
//                   size={24}
//                   color="#888"
//                   style={styles.icon}
//                 />
//                 <TextInput
//                   style={styles.input}
//                   placeholder="New Password"
//                   value={newPassword}
//                   onChangeText={setNewPassword}
//                   secureTextEntry
//                 />
//               </View>
//               <TouchableOpacity style={styles.button} onPress={handleSubmit}>
//                 <Text style={styles.buttonText}>Reset Password</Text>
//               </TouchableOpacity>
//             </>
//           )}
//         </View>
//       </ImageBackground>
//     </TouchableWithoutFeedback>
//   );
// };

// export default ForgotPasswordPage;
