//AppointmentPage.js
import React, { useState } from 'react'; // <-- Add useState here
// import React from 'react';
import { View, Text, ImageBackground, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import styles from './styles'; // Import shared styles
import { Ionicons } from '@expo/vector-icons'; // Import icons from Expo
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker'; // Use Expo compatible DateTimePicker
import Icon from 'react-native-vector-icons/FontAwesome';
import DatePicker from 'react-native-date-picker'; // Ensure this package is correctly installed
// import DateTimePickerModal from 'react-native-modal-datetime-picker'; // Ensure this is imported
import NavigationBar from './NavigationBar'; // Import your custom navigation bar component

const AppointmentPage = () => {
    const navigation = useNavigation();
    const [date, setDate] = useState(new Date());
    const [open, setOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState('');
    // const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isDatePickerOpen, setDatePickerOpen] = useState(false);

 // Functions to handle date picker
 const showDatePicker = () => {
    setDatePickerVisibility(true);
};

const hideDatePicker = () => {
    setDatePickerVisibility(false);
};

// const handleConfirm = (date) => {
//     setDate(date);
//     hideDatePicker();
// };

const handleConfirm = (selectedDate) => {
    setDate(selectedDate);
    hideDatePicker();
  };

  return (
    <ImageBackground source={require('./assets/MainPage.png')} style={styles.background}>
    {/* Title Section with Back Arrow */}
    <View style={styles.smallHeaderContainer}>
      {/* <View style={styles.container}> */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
      <Text style={styles.title}>Booking Appointment</Text>
      </View>
      
      <View style={styles.appointmentContainer}>
     <Text style={styles.smallTitle}>Find Your Doctor</Text>

       <View style={styles.searchContainer}>
       <TouchableOpacity style={styles.searchButton}>
          <Icon name="search" size={20} color="white" />
        </TouchableOpacity>
         <TextInput
          style={styles.searchInput}
          placeholder="Search Doctor..."
        />
    </View>

    <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Location"
        />
        {/* <TextInput
          style={styles.searchInput}
          placeholder="Date"
        />
        </View> */}
 {/* Date Picker
 <TouchableOpacity onPress={() => setShow(true)} style={styles.dateInput}>
            <Text style={styles.dateText}>{date.toDateString()}</Text>
          </TouchableOpacity>

          {show && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onChange}
            />
          )}
        </View> */}

         {/* Date Picker */}
         {/* <TouchableOpacity onPress={() => setOpen(true)} style={styles.dateInput}>
                        <Text style={styles.dateText}>{date.toDateString()}</Text>
                    </TouchableOpacity>
                    <DatePicker
                        modal
                        open={open}
                        date={date}
                        onConfirm={(date) => {
                            setOpen(false);
                            setDate(date);
                        }}
                        onCancel={() => {
                            setOpen(false);
                        }}
                    />
                </View> */}

                 {/* Date Picker */}
                 {/* <TouchableOpacity onPress={showDatePicker} style={styles.dateInput}>
                        <Text style={styles.dateText}>{date.toDateString()}</Text>
                    </TouchableOpacity>
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="date"
                        onConfirm={handleConfirm}
                        onCancel={hideDatePicker}
                        date={date}
                    />
                </View> */}

               {/* Date Picker Input */}
               <TouchableOpacity onPress={showDatePicker} style={styles.dateInput}>
                    <Text style={styles.dateText}>{date.toDateString()}</Text>
                </TouchableOpacity>

{/* <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
            date={date}
          />
        </View> */}
        {/* Calendar Date Picker */}
        <DatePicker
                    modal
                    open={isDatePickerOpen}
                    date={date}
                    mode="date"
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                />
</View>
{/* Search Button
<TouchableOpacity style={styles.searchButton}>
        <Icon name="search" size={20} color="white" />
        <Text style={styles.searchButtonText}>Search</Text>
      </TouchableOpacity> */}

            {/* Relevance and Favourite Buttons */}
            <View style={styles.filterButtons}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedFilter === 'relevance' ? styles.activeFilter : null,
          ]}
          onPress={() => setSelectedFilter('relevance')}
        >
          <Text style={styles.filterButtonText}>Relevance</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedFilter === 'favourite' ? styles.activeFilter : null,
          ]}
          onPress={() => setSelectedFilter('favourite')}
        >
          <Text style={styles.filterButtonText}>Favourite</Text>
        </TouchableOpacity>
      </View>

      {/* White Underline */}
      <View style={styles.underline}></View>
    </View>

      {/* <ScrollView style={styles.specialtyContainer}>
         {["Cardiology", "Dermatology", "General Medicine", "Gynecology", "Odontology", "Oncology", "Ophthalmology", "Orthopedics"].map((specialty, index) => (
          <TouchableOpacity key={index} style={styles.specialtyButton}>
            <Text style={styles.specialtyText}>{specialty}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView> */}
              
    {/* </View> */}

    </ImageBackground>
   
  );
};

export default AppointmentPage;
