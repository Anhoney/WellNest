import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import Modal from "react-native-modal";

const SuccessModal = ({ isVisible, onClose, selectedDate, selectedTime }) => {
  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose}>
      <View style={styles.modalContent}>
        <Image
          source={require("../../../assets/SuccessBooking.png")}
          style={styles.successImage}
        />
        <Text style={styles.successMessage}>
          Appointment scheduled successfully for:
        </Text>
        <Text style={styles.successDetails}>
          {selectedDate}, {selectedTime}
        </Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  successImage: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  successMessage: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  successDetails: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 10,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#007BFF",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default SuccessModal;
