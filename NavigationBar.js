//NavigationBar.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './styles'; // Assuming you have your styles.js setup

const NavigationBar = ({ navigation, activePage }) => {
  const tabs = [
    { name: 'MainPage',label: 'Home', icon: 'home' },
    { name: 'Schedule', label: 'Schedule', icon: 'calendar' },
    { name: 'Chat', label: 'Chat', icon: 'chatbubbles' },
    { name: 'Notification', label: 'Notification', icon: 'notifications' },
    { name: 'Account', label: 'Account', icon: 'person' },
  ];

  return (
    <View style={styles.navigationBar}>
      {tabs.map((tab, index) => (
        <TouchableOpacity key={index} onPress={() => navigation.navigate(tab.name)} style={styles.tabButton}>
          <Ionicons
            name={tab.icon}
            size={28}
            color={activePage === tab.name ? 'orange' : 'gray'}
          />
          <Text style={[styles.navText, { color: activePage === tab.name ? 'orange' : 'gray' }]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// const styles = {
//   navigationBar: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     paddingVertical: 10,
//     backgroundColor: 'white',
//     borderTopWidth: 1,
//     borderTopColor: '#ddd',
//   },
//   tabButton: {
//     alignItems: 'center',
//   },
//   navText: {
//     fontSize: 12,
//     marginTop: 4,
//   },
// };

export default NavigationBar;