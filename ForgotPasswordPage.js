// ForgotPasswordPage.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, Image, Keyboard, TouchableWithoutFeedback } from 'react-native';
import styles from './styles'; // Import shared styles
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
    

const ForgotPasswordPage = () => {
  const [phoneNo, setPhoneNo] = useState('');
  const [identityCard, setIdentityCard] = useState('');
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
      source={require('./assets/LoadingBackground.png')}
      style={styles.background}
    >
    
    
    {/* Title Section with Back Arrow */}
    <View style={styles.headerContainer}>
    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
      <Text style={styles.title}>Forgot Password</Text>
      </View>
<View style={styles.container}>
    {/* Instructions */}
    <Text style={styles.subtitle}>RESET YOUR PASSWORD</Text>
      <Text style={styles.instructions}>
        Reset password link will be sent to your mobile phone. Click the link to reset your password.
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
      <View style={styles.resendContainer}>
      <Text style={styles.resendText}>Don’t receive message? </Text>
      <TouchableOpacity onPress={handleResendLink}>
          <Text style={styles.forgotPassword}>Resend verification link</Text>
        </TouchableOpacity> 
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
