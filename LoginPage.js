import React, { useState } from 'react';
import { View, Text, ImageBackground, Image, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import styles from './styles'; // Import shared styles

const LoginPage = () => {
  const [icNumber, setICNumber] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Handle login logic here, e.g., send to backend for validation
    console.log('Logging in with IC:', icNumber, 'Password:', password);
  };

  return (
    <ImageBackground
      source={require('./assets/LoadingBackground.png')}
      style={styles.background}
    >
        <View style={styles.titleContainer}>
         <Text style={styles.titleFirstLine}>Welcome to</Text>
         <Text style={styles.titleSecondLine}>WellNest</Text>
         </View>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome again! Please log in.</Text>

        <TextInput
          style={styles.input}
          placeholder="Identity Card Number"
          value={icNumber}
          onChangeText={setICNumber}
          keyboardType="numeric"
          placeholderTextColor="#888"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#888"
        />

        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.registerText}>Don't Have An Account? Register</Text>
        </TouchableOpacity>
      </View>

      {/* <Image
        source={require('./assets/Orange.png')}
        style={styles.footerImage}
      /> */}
    </ImageBackground>
  );
};
//     <View style={styles.container}>
//       <Text style={styles.title}>Welcome again! Please log in.</Text>

//       <TextInput
//         style={styles.input}
//         placeholder="Identity Card Number"
//         value={icNumber}
//         onChangeText={setICNumber}
//         keyboardType="numeric"
//       />

//       <TextInput
//         style={styles.input}
//         placeholder="Password"
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//       />

//       <TouchableOpacity onPress={handleLogin} style={styles.button}>
//         <Text style={styles.buttonText}>Login</Text>
//       </TouchableOpacity>

//       <TouchableOpacity>
//         <Text style={styles.registerText}>Don't Have An Account? Register</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     padding: 16,
//     backgroundColor: '#f0f8ff',
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 5,
//     padding: 10,
//     marginBottom: 20,
//   },
//   button: {
//     backgroundColor: '#f9a825',
//     padding: 10,
//     borderRadius: 5,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//   },
//   registerText: {
//     textAlign: 'center',
//     color: '#007BFF',
//     marginTop: 20,
//   },
// });

export default LoginPage;
