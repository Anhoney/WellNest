// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Image,
//   StyleSheet,
//   Alert,
//   ImageBackground,
//   ScrollView,
//   Modal,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import API_BASE_URL from "../../../config/config";
// import styles from "../../components/styles";
// import NavigationBar from "../../components/NavigationBar";

// const VirtualConfirmationScreen = ({ route, navigation }) => {
//   const {
//     doctorId,
//     doctor,
//     selectedDate,
//     selectedTime,
//     services,
//     selectedService,
//     medicalCoverage,
//     whoWillSee,
//     patientSeenBefore,
//     symptoms,
//     note,
//     userDetails, // Retrieved from the user profile
//   } = route.params;
//   console.log("doctorId:", doctorId);
//   const imageUri = doctor.profile_image
//     ? `data:image/png;base64,${doctor.profile_image}`
//     : "https://via.placeholder.com/150";
//   const [modalVisible, setModalVisible] = useState(false);
//   const [successMessage, setSuccessMessage] = useState("");
//   const [appointmentId, setAppointmentId] = useState(null);

//   const handleConfirmAppointment = async () => {
//     const token = await AsyncStorage.getItem("token");
//     if (!token) {
//       alert("No token found. Please log in.");
//       return;
//     }

//     const bookingDetails = {
//       doctorId: doctorId,
//       u_id: userDetails.id, // Logged-in user ID from profile
//       date: selectedDate,
//       time: selectedTime,
//       services: selectedService,
//       app_status: "Pending",
//       medicalCoverage: medicalCoverage,
//       whoWillSee: whoWillSee,
//       patientSeenBefore: patientSeenBefore,
//       app_sickness: symptoms,
//       //   app_description
//       //   app_address: doctor.location,
//       note: note,
//     };

//     try {
//       console.log("bookingDetails:", bookingDetails);
//       const response = await fetch(`${API_BASE_URL}/bookAppointment`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         method: "POST",
//         body: JSON.stringify(bookingDetails),
//       });

//       const result = await response.json();

//       if (response.ok) {
//         // Set the date and time for the modal
//         setSuccessMessage(
//           `Appointment scheduled successfully for:\n${selectedDate}, ${selectedTime}`
//         );
//         setAppointmentId(result.appointmentId);
//         // Show success modal
//         setModalVisible(true);
//         // Alert.alert(
//         //   "Success",
//         //   `Appointment scheduled successfully for:\n${selectedDate}, ${selectedTime}`,
//         //   [
//         //     {
//         //       text: "Close",
//         //       onPress: () => navigation.navigate("AppointmentHistory"),
//         //     },
//         //   ]
//         // );
//         // Store the appointment ID for navigation
//         // const appointmentId = result.appointmentId; // Get the appointment ID from the response
//         // console.log("Appointment ID:", appointmentId);
//       } else {
//         alert(result.error || "Failed to book appointment");
//       }
//     } catch (error) {
//       console.error("Error booking appointment:", error);
//       alert("An error occurred while booking the appointment.");
//     }
//   };

//   // Function to format service names
//   const formatServiceName = (serviceName) => {
//     return serviceName.replace(/([A-Z])/g, " $1").trim();
//   };

//   const handleCloseModal = () => {
//     setModalVisible(false);
//     console.log("appointmentId:", appointmentId);
//     if (appointmentId) {
//       navigation.navigate("HistoryAppDetails", {
//         appointmentId: appointmentId,
//       });
//     }
//   };

//   return (
//     <ImageBackground
//       source={require("../../../assets/DoctorDetails.png")}
//       style={[styles.background, { flex: 1 }]}
//     >
//       {/* Title Section with Back chevron-back */}
//       <View style={styles.smallHeaderContainer}>
//         <TouchableOpacity
//           onPress={() => navigation.goBack()}
//           style={styles.backButton}
//         >
//           <Ionicons name="chevron-back" size={24} color="#000" />
//         </TouchableOpacity>
//         <Text style={styles.title}> Confirm Booking </Text>
//       </View>

//       <View style={styles.uAContainer}>
//         {/* Static Doctor Info */}
//         <View style={styles.transDoctorCard}>
//           <Image source={{ uri: imageUri }} style={styles.doctorImage} />
//           <View style={styles.doctorInfo}>
//             <Text style={styles.doctorName}>{doctor.username}</Text>
//             <Text style={styles.doctorCategory}>{doctor.category}</Text>
//             <Text style={styles.serviceText}>Services Provided :</Text>
//             {/* Render the services and their prices */}
//             {(services || []).length > 0 ? (
//               services.map((service, index) => (
//                 <Text key={index} style={styles.sText}>
//                   {formatServiceName(service.service)}: RM {service.price}
//                 </Text>
//               ))
//             ) : (
//               <Text style={styles.doctorCategory}>No services available</Text>
//             )}

//             <Text style={styles.doctorRating}>⭐ {doctor.rating || "N/A"}</Text>
//           </View>
//         </View>
//       </View>
//       <View style={styles.uAContainer}>
//         <Text style={styles.label}>When:</Text>
//         <View style={styles.infoContainer}>
//           <Text style={styles.infoText}>{selectedDate}</Text>
//           <Text style={styles.infoText}>{selectedTime}</Text>
//         </View>
//       </View>

//       <View style={styles.uAcontainer}>
//         <View style={styles.whiteUAcontainer}>
//           <ScrollView contentContainerStyle={styles.scrollViewContent}>
//             <Text style={styles.aLabel}>Details</Text>
//             <View style={styles.displayUnderline} />
//             <View style={styles.tableContainer}>
//               <View style={styles.tableRow}>
//                 <Text style={styles.tableCell}>
//                   Virtual Consultation Method:
//                 </Text>
//                 <Text style={styles.tableCell}>
//                   {formatServiceName(selectedService.service)}
//                 </Text>
//               </View>
//               <View style={styles.tableRow}>
//                 <Text style={styles.tableCell}>Reason:</Text>
//                 <Text style={styles.tableCell}>{symptoms || "N/A"}</Text>
//               </View>
//               <View style={styles.tableRow}>
//                 <Text style={styles.tableCell}>Customer Name:</Text>
//                 <Text style={styles.tableCell}>{userDetails.full_name}</Text>
//               </View>
//               <View style={styles.tableRow}>
//                 <Text style={styles.tableCell}>Gender:</Text>
//                 <Text style={styles.tableCell}>{userDetails.gender}</Text>
//               </View>
//               <View style={styles.tableRow}>
//                 <Text style={styles.tableCell}>Notes:</Text>
//                 <Text style={styles.tableCell}>{note || "N/A"}</Text>
//               </View>
//               <View style={styles.tableRow}>
//                 <Text style={styles.tableCell}>Payment:</Text>
//                 <Text style={styles.tableCell}>
//                   RM {formatServiceName(selectedService.price)}
//                 </Text>
//               </View>
//             </View>

//             <TouchableOpacity
//               style={styles.signOutButton}
//               onPress={handleConfirmAppointment}
//             >
//               <Text style={styles.buttonText}>Confirm Appointment</Text>
//             </TouchableOpacity>
//           </ScrollView>
//         </View>
//       </View>

//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={handleCloseModal}
//       >
//         <View style={styles.modalContainer}>
//           <View style={styles.modalView}>
//             <Image
//               source={require("../../../assets/SuccessBooking.png")}
//               style={styles.successImage}
//             />
//             <Text style={styles.modalText}>{successMessage}</Text>
//             <TouchableOpacity
//               style={styles.closeButton}
//               onPress={handleCloseModal}
//             >
//               <Text style={styles.buttonText}>Close</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>

//       {/* </View> */}
//       <NavigationBar navigation={navigation} activePage="" />
//     </ImageBackground>
//   );
// };

// export default VirtualConfirmationScreen;

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ImageBackground,
  ScrollView,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from "expo-document-picker";
import API_BASE_URL from "../../../config/config";
import styles from "../../components/styles";
import NavigationBar from "../../components/NavigationBar";

const VirtualConfirmationScreen = ({ route, navigation }) => {
  const {
    doctorId,
    doctor,
    selectedDate,
    selectedTime,
    services,
    selectedService,
    allergies,
    whoWillSee,
    patientSeenBefore,
    symptoms,
    note,
    userDetails, // Retrieved from the user profile
  } = route.params;

  const imageUri = doctor.profile_image
    ? `data:image/png;base64,${doctor.profile_image}`
    : "https://via.placeholder.com/150";

  // Function to format service names
  const formatServiceName = (serviceName) => {
    return serviceName.replace(/([A-Z])/g, " $1").trim();
  };

  const handleProceedToPayment = () => {
    navigation.navigate("PaymentScreen", {
      doctorId,
      doctor,
      selectedDate,
      selectedTime,
      selectedService,
      whoWillSee,
      patientSeenBefore,
      allergies,
      symptoms,
      note,
      userDetails,
    });
  };

  return (
    <ImageBackground
      source={require("../../../assets/DoctorDetails.png")}
      style={[styles.background, { flex: 1 }]}
    >
      {/* Title Section with Back chevron-back */}
      <View style={styles.smallHeaderContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}> Confirm Booking </Text>
      </View>

      <View style={styles.uAContainer}>
        {/* Static Doctor Info */}
        <View style={styles.transDoctorCard}>
          <Image source={{ uri: imageUri }} style={styles.doctorImage} />
          <View style={styles.doctorInfo}>
            <Text style={styles.doctorName}>{doctor.username}</Text>
            <Text style={styles.doctorCategory}>{doctor.category}</Text>
            <Text style={styles.serviceText}>Services Provided :</Text>
            {/* Render the services and their prices */}
            {(services || []).length > 0 ? (
              services.map((service, index) => (
                <Text key={index} style={styles.sText}>
                  {formatServiceName(service.service)}: RM {service.price}
                </Text>
              ))
            ) : (
              <Text style={styles.doctorCategory}>No services available</Text>
            )}

            <Text style={styles.doctorRating}>⭐ {doctor.rating || "N/A"}</Text>
          </View>
        </View>
      </View>
      <View style={styles.uAContainer}>
        <Text style={styles.label}>Selected Date and Time:</Text>
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>{selectedDate}</Text>
          <Text style={styles.infoText}>{selectedTime}</Text>
        </View>
      </View>

      <View style={styles.uAcontainer}>
        <View style={styles.whiteUAcontainer}>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <Text style={styles.aLabel}>Details</Text>
            <View style={styles.displayUnderline} />
            <View style={styles.tableContainer}>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>
                  Virtual Consultation Method:
                </Text>
                <Text style={styles.tableCell}>
                  {formatServiceName(selectedService.service)}
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Reason:</Text>
                <Text style={styles.tableCell}>{symptoms || "N/A"}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Customer Name:</Text>
                <Text style={styles.tableCell}>{userDetails.full_name}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Gender:</Text>
                <Text style={styles.tableCell}>{userDetails.gender}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Special Requests:</Text>
                <Text style={styles.tableCell}>{note || "N/A"}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Payment:</Text>
                <Text style={styles.tableCell}>
                  RM {formatServiceName(selectedService.price)}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.signOutButton}
              onPress={handleProceedToPayment}
            >
              <Text style={styles.buttonText}>Proceed to Payment</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>

      <NavigationBar navigation={navigation} activePage="" />
    </ImageBackground>
  );
};

const PaymentScreen = ({ route, navigation }) => {
  const {
    doctorId,
    doctor,
    selectedDate,
    selectedTime,
    selectedService,
    whoWillSee,
    patientSeenBefore,
    allergies,
    symptoms,
    note,
    userDetails,
  } = route.params;
  //   console.log("Doctor:", doctor);
  const [receiptFile, setReceiptFile] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [appointmentId, setAppointmentId] = useState(null);

  const handleUploadReceipt = async () => {
    try {
      // Launch Document Picker
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"], // Allow images and PDFs
        copyToCacheDirectory: true,
      });

      console.log("Result assets:", result.assets);
      console.log("Result", result); // Log the file details

      // Check if the user canceled the selection
      if (result.canceled || !result.assets || result.assets.length === 0) {
        console.log("User canceled the document picker.");
        return;
      }

      // Access the selected file details
      const file = result.assets[0];
      const { uri, name, mimeType } = file;

      // Ensure all required properties are defined
      if (!uri || !name || !mimeType) {
        alert("Invalid file selected. Please try again.");
        return;
      }

      // Create FormData object
      const formData = new FormData();
      formData.append("file", {
        uri: uri,
        name: name,
        type: mimeType,
      });

      // Retrieve token for authentication
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        alert("No token found. Please log in.");
        return;
      }

      // Upload the file to the backend
      const response = await fetch(`${API_BASE_URL}/uploadReceipt`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data", // Important for file uploads
          Authorization: `Bearer ${token}`, // Include the token
        },
      });

      // Handle the response
      const uploadResult = await response.json();
      if (response.ok) {
        console.log("File uploaded successfully:", uploadResult.fileUrl);
        setReceiptFile(uploadResult.fileUrl); // Store the file URL in the state
        alert("Receipt uploaded successfully!");
      } else {
        console.error("Upload failed:", uploadResult.error);
        alert(uploadResult.error || "Failed to upload receipt");
      }
    } catch (error) {
      console.error("Error uploading receipt:", error);
      alert("An error occurred while uploading the receipt.");
    }
  };

  const handleConfirmPayment = async () => {
    if (!receiptFile) {
      alert("Please upload a receipt before confirming.");
      return;
    }

    const token = await AsyncStorage.getItem("token");
    if (!token) {
      alert("No token found. Please log in.");
      return;
    }

    const bookingDetails = {
      doctorId: doctorId,
      hp_id: doctor.hp_id,
      u_id: userDetails.id, // Logged-in user ID from profile
      date: selectedDate,
      time: selectedTime,
      services: selectedService.service,
      app_status: "Pending",
      whoWillSee: whoWillSee,
      patientSeenBefore: patientSeenBefore,
      symptoms: symptoms,
      note: note,
      fee: selectedService.price, // Add the fee here
      receiptUrl: receiptFile, // Include the receipt URL
    };

    try {
      //   console.log("bookingDetails:", bookingDetails);
      const response = await fetch(`${API_BASE_URL}/virtual/bookAppointment`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(bookingDetails),
      });

      const result = await response.json();

      if (response.ok) {
        // Set the date and time for the modal
        setSuccessMessage(
          `Appointment scheduled successfully for:\n${selectedDate}, ${selectedTime}`
        );
        setAppointmentId(result.appointmentId);
        // Show success modal
        setModalVisible(true);
        // alert("Payment successful, appointment booked!");
        // navigation.navigate("HistoryAppDetails", {
        //   appointmentId: result.appointmentId,
        // });
      } else {
        alert(result.error || "Failed to book appointment");
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("An error occurred while booking the appointment.");
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    console.log("appointmentId:", appointmentId);
    if (appointmentId) {
      navigation.navigate("HistoryAppDetails", {
        appointmentId: appointmentId,
      });
    }
  };

  return (
    <ImageBackground
      source={require("../../../assets/PlainGrey.png")}
      style={[styles.background, { flex: 1 }]}
    >
      {/* Title Section with Back chevron-back */}
      <View style={styles.smallHeaderContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}> Payment </Text>
      </View>

      {/* <View style={styles.uAcontainer}>
        <View style={styles.whiteUAcontainer}>
          <ScrollView contentContainerStyle={styles.scrollViewContent}> */}
      <ScrollView contentContainerStyle={styles.hpContainer}>
        <Text style={styles.sectionTitle}></Text>
        <View style={styles.singleUnderline}></View>
        <View style={styles.formContainer}>
          <Text style={styles.aLabel}>Summary</Text>
          <View style={styles.displayUnderline} />
          <Text style={styles.boldSectionContent}>Consultation </Text>
          <Text style={styles.sectionContent}>
            The fee covers a 10-minute video consultation or 1-hour text
            consultation and the cost of medication is not included.{"\n"}
          </Text>
          <Text style={styles.aLabel}>Payment Details</Text>
          <View style={styles.displayUnderline} />
          <Text style={styles.boldSectionContent}>Total Amount</Text>
          <Text style={styles.sectionContent}> RM {selectedService.price}</Text>
          <Text style={styles.boldSectionContent}>Payment Option</Text>
          <View style={styles.grayBackgroundContainer}>
            <Text style={styles.boldSectionContent}>Online Banking</Text>
            <Text style={styles.sectionContent}>Bank Transfer Details</Text>
            <Text style={styles.sectionContent}>
              Name: {doctor.bank_receiver_name}
            </Text>
            <Text style={styles.sectionContent}>Bank: {doctor.bank_name}</Text>
            <Text style={styles.sectionContent}>
              Account Number: {doctor.account_number}
            </Text>
          </View>

          <Text style={styles.aLabel}>Please Upload Receipt After Payment</Text>
          <View style={styles.displayUnderline} />
          <TouchableOpacity
            onPress={handleUploadReceipt}
            style={styles.uploadButton}
          >
            <Ionicons
              name="cloud-upload"
              size={24}
              color="#fff"
              style={styles.icon}
            />
            <Text style={styles.buttonText}>
              {receiptFile ? "Receipt Uploaded" : "Upload Receipt"}
            </Text>
          </TouchableOpacity>
          <Text style={[styles.uploadPrecautions, { textAlign: "center" }]}>
            Please upload the receipt after bank in.
          </Text>
        </View>
      </ScrollView>
      {/* </View> */}

      <TouchableOpacity
        onPress={handleConfirmPayment}
        style={styles.signOutButton}
      >
        <Text style={styles.buttonText}>Confirm Payment</Text>
      </TouchableOpacity>
      {/* </View> */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Image
              source={require("../../../assets/SuccessBooking.png")}
              style={styles.successImage}
            />
            <Text style={styles.modalText}>{successMessage}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCloseModal}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <NavigationBar navigation={navigation} activePage="" />
    </ImageBackground>
  );
};

export { VirtualConfirmationScreen, PaymentScreen };
