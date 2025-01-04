// AlarmComponent.js
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Sound from "react-native-sound";
import API_BASE_URL from "../../config/config";

const AlarmComponent = ({ navigation, route }) => {
  const [isAlarmPlaying, setIsAlarmPlaying] = useState(false);
  const [medicationReminder, setMedicationReminder] = useState(null);

  useEffect(() => {
    const fetchMedicationReminder = async () => {
      const medicationId = route.params.medicationId;
      const response = await fetch(
        `${API_BASE_URL}/medications/${medicationId}`
      );
      const data = await response.json();
      setMedicationReminder(data);
    };
    fetchMedicationReminder();
  }, []);

  const handleStopAlarm = async () => {
    setIsAlarmPlaying(false);
    const medicationId = route.params.medicationId;
    await fetch(`${API_BASE_URL}/medications/${medicationId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "Completed" }),
    });
  };

  useEffect(() => {
    if (medicationReminder && !isAlarmPlaying) {
      const sound = new Sound("alarm_sound.mp3", Sound.MAIN_BUNDLE, (error) => {
        if (error) {
          console.log("Error playing sound:", error);
        } else {
          sound.play();
          setIsAlarmPlaying(true);
        }
      });
    }
  }, [medicationReminder, isAlarmPlaying]);

  return (
    <View>
      <Text>Medication Reminder: {medicationReminder?.pill_name}</Text>
      <TouchableOpacity onPress={handleStopAlarm}>
        <Text>Stop Alarm</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AlarmComponent;
