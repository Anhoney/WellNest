import React, { useEffect } from 'react';
import { ImageBackground, View, Text, Image } from 'react-native';
//import { View, Text, StyleSheet, Image } from 'react-native';
import styles from './styles'; // Import shared styles

const FirstPage = ({ navigation }) => {
  useEffect(() => {
    // Navigate to login page after 3 seconds
    setTimeout(() => {
      navigation.navigate('LoginPage');
    }, 3000);
  }, []);

  return (
    <ImageBackground
      source={require('./assets/FirstPage.png')}
      style={styles.background}
    >
      <View style={styles.firstContainer}>
        {/* <Image
          source={require('./assets/DrinkTea.png')}
          style={styles.logo}
        /> */}
          <Text style={styles.titleFirstLine}>Welcome to</Text>
          <Text style={styles.titleSecondLine}>WellNest</Text>
        {/* <Text style={styles.title}>Welcome to WellNest</Text> */}
      </View>
    </ImageBackground>
    // <View style={styles.container}>
    //   <Image
    //     source={require('./assets/splash.png')} // Use your app's logo or splash image
    //     style={styles.logo}
    //   />
    //   <Text style={styles.text}>Welcome to WellNest</Text>
    // </View>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f0f8ff',
//   },
//   logo: {
//     width: 150,
//     height: 150,
//   },
//   text: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginTop: 20,
//   },
// });

export default FirstPage;
