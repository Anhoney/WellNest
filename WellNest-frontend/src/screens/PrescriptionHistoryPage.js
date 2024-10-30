import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, StyleSheet, ImageBackground } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import styles from '../components/styles'; // Import shared styles
import { Ionicons } from '@expo/vector-icons'; // Import icons from Expo
import Icon from 'react-native-vector-icons/FontAwesome';

const PrescriptionHistoryPage = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    // Fetch prescription data
    // axios.get('http://<YOUR_BACKEND_URL>/prescriptions/history')
    //   .then(response => setPrescriptions(response.data))
    //   .catch(error => console.error('Error fetching prescriptions:', error));
  }, []);

  const navigateToDetails = (id) => {
    navigation.navigate('PrescriptionDetails', { prescriptionId: id });
  };

// Determine if there are any prescriptions
const latestPrescription = prescriptions.length > 0 ? prescriptions[0] : null;
const historyPrescriptions = prescriptions.slice(1);

  return (
    <ImageBackground source={require('../../assets/PlainGrey.png')} style={styles.background}>
        <View style={styles.smallHeaderContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.title}>Prescription</Text>
        </View>

        <View style={styles.prescriptionContainer}>
            <View style={styles.searchContainer}>
            <TouchableOpacity style={styles.searchButton}>
                <Icon name="search" size={20} color="white" />
            </TouchableOpacity>
            <TextInput
            style={styles.searchInput}
            placeholder="Search Doctor or Date..."
            placeholderTextColor="#000"
            />
            </View>

            <Text style={styles.sectionTitle}>Latest Prescription</Text>
            {/* White Underline */}
            <View style={styles.singleUnderline}></View>
           
            
            {latestPrescription ? (
          <TouchableOpacity 
            style={styles.prescriptionCard}
            onPress={() => navigateToDetails(latestPrescription.id)}
          >
            <Image source={{ uri: latestPrescription.doctor_image_url }} style={styles.doctorImage} />
            <View style={styles.infoContainer}>
              <Text style={styles.doctorName}>{latestPrescription.doctor_name}</Text>
              <Text style={styles.doctorSpecialty}>{latestPrescription.doctor_specialty}</Text>
              <Text style={styles.date}>{latestPrescription.appointment_date} {latestPrescription.appointment_time}</Text>
              <Text style={styles.type}>{latestPrescription.appointment_type}</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.noPrescriptionContainer}>
            <Text style={styles.noPrescriptionText}>No latest prescriptions</Text>
            <Image source={require('../../assets/NothingCat.png')} style={styles.noPrescriptionImage} />
          </View>
        )}

        <Text style={styles.sectionTitle}>History Prescription</Text>
        {/* White Underline */}
        <View style={styles.singleUnderline}></View>

        {historyPrescriptions.length > 0 ? (
          <ScrollView>
            {historyPrescriptions.map(prescription => (
              <TouchableOpacity 
                key={prescription.id} 
                style={styles.prescriptionCard}
                onPress={() => navigateToDetails(prescription.id)}
              >
                <Image source={{ uri: prescription.doctor_image_url }} style={styles.doctorImage} />
                <View style={styles.infoContainer}>
                  <Text style={styles.doctorName}>{prescription.doctor_name}</Text>
                  <Text style={styles.doctorSpecialty}>{prescription.doctor_specialty}</Text>
                  <Text style={styles.date}>{prescription.appointment_date} {prescription.appointment_time}</Text>
                  <Text style={styles.type}>{prescription.appointment_type}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.noPrescriptionContainer}>
            <Text style={styles.noPrescriptionText}>No history prescriptions</Text>
            <Image source={require('../../assets/NothingCat.png')} style={styles.noPrescriptionImage} />
          </View>
        )}
      </View>
    </ImageBackground>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#F0F0F0',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: 10,
//   },
//   searchInput: {
//     flex: 1,
//     backgroundColor: '#FFF',
//     padding: 10,
//     borderRadius: 10,
//     elevation: 2,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginVertical: 10,
//   },
//   prescriptionCard: {
//     flexDirection: 'row',
//     backgroundColor: '#FFF',
//     padding: 15,
//     borderRadius: 10,
//     marginVertical: 5,
//     elevation: 3,
//   },
//   doctorImage: {
//     width: 70,
//     height: 70,
//     borderRadius: 35,
//     marginRight: 10,
//   },
//   infoContainer: {
//     flex: 1,
//   },
//   doctorName: {
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   doctorSpecialty: {
//     color: '#666',
//   },
//   date: {
//     color: '#77b300',
//     fontWeight: 'bold',
//   },
//   type: {
//     color: '#777',
//   },
// });

export default PrescriptionHistoryPage;
