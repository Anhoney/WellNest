import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Image } from "react-native";
import axios from "axios";
import styles from "../../components/styles";
import { useRoute } from "@react-navigation/native";
import API_BASE_URL from "../../../config/config";

const DoctorProfileScreen = () => {
  const route = useRoute();
  const { doctorId } = route.params;
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/doctorProfile`, {
          params: { id: doctorId },
        });
        setDoctor(response.data);
      } catch (error) {
        console.error("Error fetching doctor profile:", error);
      }
    };

    fetchDoctorProfile();
  }, [doctorId]);

  if (!doctor) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: doctor.profile_image }}
        style={styles.doctorImage}
      />
      <Text style={styles.doctorName}>{doctor.username}</Text>
      <Text>{doctor.summary}</Text>
      <Text>Education: {doctor.education}</Text>
      <Text>Credentials: {doctor.credentials}</Text>
      <Text>Languages: {doctor.languages.join(", ")}</Text>
      <Text>Services: {doctor.services.join(", ")}</Text>
      <Text>Business Hours: {doctor.business_hours}</Text>
      <Image source={{ uri: doctor.photo }} style={styles.hospitalImage} />
    </ScrollView>
  );
};

export default DoctorProfileScreen;
