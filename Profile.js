// //Profile.js
// import React, { useState } from 'react'; // <-- Add useState here
// // import React from 'react';
// import { View, Text, ImageBackground, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
// import styles from './styles'; // Import shared styles
// import DateTimePickerModal from 'react-native-modal-datetime-picker'; // Ensure this is imported
// import { Ionicons } from '@expo/vector-icons'; // Import icons from Expo
// import { useNavigation } from '@react-navigation/native';
// import DateTimePicker from '@react-native-community/datetimepicker'; // Use Expo compatible DateTimePicker

// const Profile = () => {
//     const navigation = useNavigation();
//     const [date, setDate] = useState(new Date());
//     const [open, setOpen] = useState(false);
//     const [selectedFilter, setSelectedFilter] = useState('');
//     const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

//     // Functions to handle date picker
//  const showDatePicker = () => {
//     setDatePickerVisibility(true);
// };

// const hideDatePicker = () => {
//     setDatePickerVisibility(false);
// };

// const handleConfirm = (selectedDate) => {
//     setDate(selectedDate);
//     hideDatePicker();
//   };
//   return (
//  {/* Date Picker Input */}
//  <TouchableOpacity onPress={showDatePicker} style={styles.dateInput}>
//  <Text style={styles.dateText}>{date.toDateString()}</Text>
// </TouchableOpacity>

// <DateTimePickerModal
// isVisible={isDatePickerVisible}
// mode="date"
// onConfirm={handleConfirm}
// onCancel={hideDatePicker}
// date={date}
// />

// );
// };

// export default Profile;
