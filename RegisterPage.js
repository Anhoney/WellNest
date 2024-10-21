// RegisterPage.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, ScrollView, Platform } from 'react-native';
import styles from './styles'; // Import shared styles
import { KeyboardAvoidingView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { RadioButton } from 'react-native-paper'; // For the radio button
import { SafeAreaView } from 'react-native-safe-area-context'; // Import SafeAreaView for iOS

const RegisterPage = () => {
  const [role, setRole] = useState('User');
  const [fullName, setFullName] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [email, setEmail] = useState('');
  const [identityCard, setIdentityCard] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigation = useNavigation();
  const [isPasswordVisible, setPasswordVisible] = useState(false); // For toggling password visibility

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
  };

   // Toggle password visibility
   const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  return (
    <ImageBackground
      source={require('./assets/LoadingBackground.png')}
      style={styles.background}
    >
      {/* Title Section with Back Arrow */}
      <View style={styles.smallHeaderContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Register</Text>
      </View>
      
      {/* SafeAreaView wraps the content to ensure it's inside the safe area */}
      <SafeAreaView style={styles.safeAreaContainer}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} enabled>
          <ScrollView contentContainerStyle={styles.scrollView}>
            <View style={styles.container}>
          
              {/* Full Name Input with Icon and Precautions */}
              <View style={styles.inputContainer}>
                <Ionicons name="person" size={24} color="#666" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Full name"
                  value={fullName}
                  onChangeText={setFullName}
                />
              </View>
              <Text style={styles.precautions}>Make sure it matches the name on your government ID.</Text>

              {/* Phone Number Input with Icon */}
              <View style={styles.inputContainer}>
                    <Ionicons name="call" size={24} color="#666" style={styles.icon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Phone No (Eg. 0123456789)"
                      value={phoneNo}
                      onChangeText={setPhoneNo}
                      keyboardType="phone-pad"
                    />
              </View>

              {/* Email Input with Icon */}
              <View style={styles.inputContainer}>
                <Ionicons name="mail" size={24} color="#666" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email Address"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                />
              </View>

              {/* Identity Card Input with Icon and Precautions */}
              <View style={styles.inputContainer}>
                <Ionicons name="card" size={24} color="#666" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Identity Card Number"
                  value={identityCard}
                  onChangeText={setIdentityCard}
                  keyboardType="numeric"
                />
              </View>
              <Text style={styles.precautions}>We will send a notification after authentication succeeds.</Text>

              {/* Upload Identity Card with Camera Icon */}
              <TouchableOpacity style={styles.uploadButton}>
                <Ionicons name="camera" size={24} color="#fff" style={styles.icon} />
                <Text style={styles.uploadButtonText}>Upload Identity Card Photo</Text>
              </TouchableOpacity>
              <Text style={styles.uploadPrecautions}>Please make sure there are both back and front photos of the identity card.</Text>

              {/* Password Input with Icon and Visibility Toggle */}
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed" size={24} color="#666" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!isPasswordVisible} // Toggle visibility
                />
                {/* Make sure TouchableOpacity wraps around the icon properly */}
                <TouchableOpacity onPress={togglePasswordVisibility} style={{ marginLeft: 10 }}>
                  <Ionicons 
                    name={isPasswordVisible ? "eye-off" : "eye"} 
                    size={24} 
                    color="gray" 
                  />
                </TouchableOpacity>
              </View>

              {/* Confirm Password Input with Icon and Visibility Toggle */}
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed" size={24} color="#666" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!isPasswordVisible} // Toggle visibility
                />
                {/* Make sure TouchableOpacity wraps around the icon properly */}
                <TouchableOpacity onPress={togglePasswordVisibility} style={{ marginLeft: 10 }}>
                  <Ionicons 
                    name={isPasswordVisible ? "eye-off" : "eye"} 
                    size={24} 
                    color="gray" 
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.underline} />
            <Text style={styles.question}>Role</Text>
            <View style={styles.underline} />
            <RadioButton.Group onValueChange={handleRoleChange} value={role}>
              <View style={styles.radioButtonContainer}>
                <RadioButton.Item label="User" value="User" mode="android" position="leading" color={styles.radioButtonColor.color} labelStyle={styles.radioLabel} />
              </View>
              <View style={styles.radioButtonContainer}>
                <RadioButton.Item label="Healthcare Provider" value="Healthcare Provider" mode="android" position="leading" color={styles.radioButtonColor.color} labelStyle={styles.radioLabel}/>
              </View>
              <View style={styles.radioButtonContainer}>
                <RadioButton.Item label="Community Organizer" value="Community Organizer" mode="android" position="leading" color={styles.radioButtonColor.color} labelStyle={styles.radioLabel}/>
              </View>
            </RadioButton.Group>

              {/* Dynamic Fields Based on Role */}
              {role === 'Healthcare Provider' && (
                    <View style={styles.container}>
                      <View style={styles.inputContainer}>
                        <Ionicons name="medkit" size={24} color="#666" style={styles.icon} />
                        <TextInput
                          style={styles.input}
                          placeholder="Healthcare License Number"
                          // Add relevant input and state for healthcare-specific fields
                        />
                      </View>
                      <TouchableOpacity style={styles.uploadButton}>
                        <Ionicons name="document" size={24} color="#fff" style={styles.icon} />
                        <Text style={styles.uploadButtonText}>Upload Healthcare License Document</Text>
                      </TouchableOpacity>
                      <Text style={styles.uploadPrecautions}>Please upload related documents to verify your role identity.</Text>
                   </View>
                  )}

              {role === 'Community Organizer' && (
                <View style={styles.container}>
                  <TouchableOpacity style={styles.uploadButton}>
                    <Ionicons name="document" size={24} color="#fff" style={styles.icon} />
                    <Text style={styles.uploadButtonText}>Upload Community Organizer Document</Text>
                  </TouchableOpacity>
                    <Text style={styles.uploadPrecautions}>Please upload related documents to verify your role identity.</Text>
                </View>
              )}

            <View style={styles.container}>
              {/* Sign Up Button */}
              <TouchableOpacity style={styles.button} onPress={() => { }}>
                <Text style={styles.buttonText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default RegisterPage;
