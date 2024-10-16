// RegisterPage.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import styles from './styles'; // Import shared styles

const RegisterPage = () => {
  const [role, setRole] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [email, setEmail] = useState('');
  const [identityCard, setIdentityCard] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      
      {/* Common Fields */}
      <TextInput
        style={styles.input}
        placeholder="Full name"
        value={fullName}
        onChangeText={setFullName}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Phone No (Eg. 0123456789)"
        value={phoneNo}
        onChangeText={setPhoneNo}
        keyboardType="numeric"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Identity Card Number"
        value={identityCard}
        onChangeText={setIdentityCard}
        keyboardType="numeric"
      />
      
      {/* Upload Identity Card */}
      <TouchableOpacity style={styles.uploadButton}>
        <Text>Upload Identity Card Photo</Text>
      </TouchableOpacity>

      {/* Role Selection */}
      <Text style={styles.subtitle}>Role</Text>
      <TouchableOpacity onPress={() => handleRoleChange('User')}>
        <Text style={role === 'User' ? styles.selectedRole : styles.role}>User</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleRoleChange('Healthcare Provider')}>
        <Text style={role === 'Healthcare Provider' ? styles.selectedRole : styles.role}>Healthcare Provider</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleRoleChange('Community Organizer')}>
        <Text style={role === 'Community Organizer' ? styles.selectedRole : styles.role}>Community Organizer</Text>
      </TouchableOpacity>

      {/* Dynamic Fields Based on Role */}
      {role === 'Healthcare Provider' && (
        <View>
          <TextInput
            style={styles.input}
            placeholder="Healthcare License Number"
            // Add relevant input and state for healthcare-specific fields
          />
          <TouchableOpacity style={styles.uploadButton}>
            <Text>Upload Healthcare License Document</Text>
          </TouchableOpacity>
        </View>
      )}

      {role === 'Community Organizer' && (
        <View>
          <TouchableOpacity style={styles.uploadButton}>
            <Text>Upload Community Organizer Document</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Common Password Fields */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <Button title="Sign Up" onPress={() => {}} />
    </View>
  );
};

export default RegisterPage;
