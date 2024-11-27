// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   FlatList,
//   Alert,
//   ScrollView,
//   Image,
//   ImageBackground,
// } from "react-native";
// // import DatePicker from "react-native-datepicker";
// import DateTimePickerModal from "react-native-modal-datetime-picker"; // Ensure this is imported
// import styles from "../../components/styles"; // Assuming you have a styles file
// import axios from "axios";
// import { Ionicons } from "@expo/vector-icons"; // Import icons from Expo
// import { FontAwesome } from "@expo/vector-icons"; // Import FontAwesome for the heart icon
// import API_BASE_URL from "../../../config/config";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const AppointmentDoctorDetails = ({ route, navigation }) => {
//   const { doctorId } = route.params;
//   const [doctor, setDoctor] = useState({});
//   const [selectedDate, setSelectedDate] = useState("");
//   const [availableTimes, setAvailableTimes] = useState([]);
//   const [selectedTime, setSelectedTime] = useState("");
//   const [isDatePickerVisible, setDatePickerVisibility] = useState(false); // Date picker visibility state
//   const [favoriteDoctors, setFavoriteDoctors] = useState([]);
//   const [favorites, setFavorites] = useState([]);
//   const isFavorite = favorites.includes(doctorId);

//   console.log("doctorId:", doctorId);
//   //   console.log("isFavorite:", isFavorite);

//   const imageUri = doctor.profile_image
//     ? `data:image/png;base64,${doctor.profile_image}`
//     : "https://via.placeholder.com/150";

//   useEffect(() => {
//     const fetchDoctorDetails = async () => {
//       try {
//         const response = await axios.get(`${API_BASE_URL}/doctor/${doctorId}`);
//         setDoctor(response.data);
//       } catch (error) {
//         Alert.alert("Error", "Failed to fetch doctor details.");
//         console.error(error);
//       }
//     };

//     const fetchFavorites = async () => {
//       try {
//         const token = await AsyncStorage.getItem("token");
//         if (!token) {
//           console.error("No token found");
//           return;
//         }

//         const response = await axios.get(`${API_BASE_URL}/getFavorites`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const favoriteIds = response.data.map(
//           (doctor) => doctor.availability_id
//         ); // Adjust based on your API response
//         // Store the favorites in AsyncStorage
//         await AsyncStorage.setItem("favorites", JSON.stringify(favoriteIds));
//         setFavorites(favoriteIds);
//       } catch (error) {
//         console.error("Error fetching favorites:", error);
//       }
//     };

//     fetchDoctorDetails();
//     fetchFavorites();
//   }, [doctorId]);

//   const toggleFavorite = async () => {
//     try {
//       const token = await AsyncStorage.getItem("token");

//       console.log("Token:", token); // Log the token to ensure it's being retrieved correctly
//       console.log("Doctor ID:", doctorId); // Log the doctor ID being passed

//       if (!token) {
//         console.error("No token found");
//         return;
//       }

//       const response = await axios.post(
//         `${API_BASE_URL}/toggleFavorite`,
//         { availabilityId: doctorId },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       console.log("Toggle Favorite Response:", response.data); // Log the response from the backend

//       if (response.data.success) {
//         setFavorites((prevFavorites) => {
//           const newFavorites = prevFavorites.includes(doctorId)
//             ? prevFavorites.filter((id) => id !== doctorId)
//             : [...prevFavorites, doctorId];

//           // Update favorites in AsyncStorage
//           AsyncStorage.setItem("favorites", JSON.stringify(newFavorites));
//           return newFavorites;
//         });
//       } else {
//         console.error("Failed to update favorite status.");
//       }
//     } catch (error) {
//       console.error("Error toggling favorite:", error);
//     }
//   };

//   // Handle the selected date
//   const handleConfirmDate = async (date) => {
//     const formattedDate = date.toISOString().split("T")[0]; // Format to YYYY-MM-DD
//     setSelectedDate(formattedDate);
//     setDatePickerVisibility(false);

//     try {
//       const response = await axios.get(`${API_BASE_URL}/availableTimes`, {
//         params: { doctorId, date: formattedDate },
//       });
//       setAvailableTimes(response.data);
//     } catch (error) {
//       Alert.alert("Error", "Failed to fetch available times.");
//       console.error(error);
//     }
//   };

//   const handleDateChange = async (date) => {
//     setSelectedDate(date);
//     const response = await axios.get(`${API_BASE_URL}/availableTimes`, {
//       params: { doctorId, date },
//     });
//     setAvailableTimes(response.data);
//   };

//   const handleBookAppointment = async () => {
//     if (!selectedDate || !selectedTime) {
//       Alert.alert("Error", "Please select a date and time.");
//       return;
//     }

//     try {
//       await axios.post(`${API_BASE_URL}/bookAppointment`, {
//         doctorId,
//         date: selectedDate,
//         time: selectedTime,
//       });
//       Alert.alert("Success", "Appointment booked successfully.");
//       navigation.navigate("Home"); // Navigate back to Home
//     } catch (error) {
//       Alert.alert("Error", "Failed to book appointment.");
//       console.error(error);
//     }
//   };

//   return (
//     <ImageBackground
//       source={require("../../../assets/DoctorDetails.png")}
//       style={styles.background}
//     >
//       {/* Title Section with Back chevron-back */}
//       <View style={styles.noBgSmallHeaderContainer}>
//         <TouchableOpacity
//           onPress={() => navigation.goBack()}
//           style={styles.backButton}
//         >
//           <Ionicons name="chevron-back" size={24} color="#000" />
//         </TouchableOpacity>
//         <Text style={styles.title}> {doctor.category} </Text>
//       </View>

//       <View style={styles.uAcontainer}>
//         <View style={styles.transDoctorCard}>
//           <Image source={{ uri: imageUri }} style={styles.doctorImage} />
//           <View style={styles.doctorInfo}>
//             <Text style={styles.doctorName}>{doctor.username}</Text>
//             <Text style={styles.doctorCategory}>{doctor.category}</Text>
//             <Text style={styles.description}>Location: {doctor.location}</Text>
//             <Text style={styles.doctorRating}>⭐ {doctor.rating || "N/A"}</Text>
//           </View>
//           <TouchableOpacity
//             onPress={() => toggleFavorite(doctor.id)}
//             style={styles.favoriteIcon}
//           >
//             <FontAwesome
//               name={isFavorite ? "heart" : "heart-o"}
//               size={24}
//               color={isFavorite ? "red" : "gray"}
//             />
//           </TouchableOpacity>
//         </View>

//         {/* <ScrollView contentContainerStyle={styles.scrollViewContent}> */}
//         {/* Experience and Business Hours */}
//         <View style={styles.infoContainer}>
//           <Text style={styles.infoText}>
//             {doctor.experience || "N/A"} years experience
//           </Text>
//           <Text style={styles.infoText}>{doctor.business_hours || "N/A"}</Text>
//         </View>

//         <ScrollView>
//           {/* Profile Button */}
//           <TouchableOpacity style={styles.profileButton}>
//             <Text style={styles.profileButtonText}>Profile</Text>
//           </TouchableOpacity>

//           {/* Descriptions Section */}
//           <Text style={styles.sectionTitle}>Descriptions</Text>
//           <Text style={styles.sectionContent}>{doctor.description}</Text>

//           {/* About Section */}
//           <Text style={styles.sectionTitle}>About</Text>
//           <Text style={styles.aboutText}>
//             📞 {doctor.phone_number || "N/A"}
//           </Text>
//           <Text style={styles.aboutText}>
//             📍 {doctor.hospital_address || "N/A"}
//           </Text>

//           {/* Date Picker */}
//           <Text style={styles.sectionTitle}>Select Date</Text>
//           <TouchableOpacity
//             style={styles.datePickerButton}
//             onPress={() => setDatePickerVisibility(true)}
//           >
//             <Text style={styles.datePickerText}>
//               {selectedDate || "Select a Date"}
//             </Text>
//           </TouchableOpacity>
//           <DateTimePickerModal
//             isVisible={isDatePickerVisible}
//             mode="date"
//             onConfirm={handleConfirmDate}
//             onCancel={() => setDatePickerVisibility(false)}
//             minimumDate={new Date()}
//           />

//           {/* Available Times */}
//           <Text style={styles.sectionTitle}>Select Time</Text>
//           {/* <View style={{ flexGrow: 1 }}> */}
//           <FlatList
//             data={availableTimes}
//             keyExtractor={(item) => item}
//             renderItem={({ item }) => (
//               <TouchableOpacity
//                 onPress={() => setSelectedTime(item)}
//                 style={[
//                   styles.timeSlot,
//                   item === selectedTime ? styles.selectedTimeSlot : null,
//                 ]}
//               >
//                 <Text>{item}</Text>
//               </TouchableOpacity>
//             )}
//           />
//           {/* </View> */}
//           {/* Book Appointment Button */}
//           <TouchableOpacity
//             style={styles.bookButton}
//             onPress={handleBookAppointment}
//           >
//             <Text style={styles.buttonText}>Book Appointment</Text>
//           </TouchableOpacity>
//           {/* Show selected date */}
//           {/* <TouchableOpacity
//             style={styles.datePickerButton}
//             onPress={() => setDatePickerVisibility(true)}
//           >
//             <Text style={styles.datePickerText}>
//               {selectedDate
//                 ? `Selected Date: ${selectedDate}`
//                 : "Select a Date"}
//             </Text>
//           </TouchableOpacity> */}

//           {/* Date Picker Modal */}
//           {/* <DateTimePickerModal
//             isVisible={isDatePickerVisible}
//             mode="date"
//             onConfirm={handleConfirmDate}
//             onCancel={() => setDatePickerVisibility(false)}
//             minimumDate={new Date()} // Disable past dates
//           /> */}

//           {/* Display available times */}
//           {/* <FlatList
//             data={availableTimes}
//             keyExtractor={(item) => item}
//             renderItem={({ item }) => (
//               <TouchableOpacity
//                 onPress={() => setSelectedTime(item)}
//                 style={[
//                   styles.timeSlot,
//                   item === selectedTime ? styles.selectedTimeSlot : null,
//                 ]}
//               >
//                 <Text>{item}</Text>
//               </TouchableOpacity>
//             )}
//             ListEmptyComponent={
//               selectedDate && (
//                 <Text style={styles.noTimesText}>
//                   No available times for the selected date.
//                 </Text>
//               )
//             }
//           />
//           <TouchableOpacity
//             style={styles.bookButton}
//             onPress={handleBookAppointment}
//           >
//             <Text style={styles.buttonText}>Book Appointment</Text>
//           </TouchableOpacity> */}
//         </ScrollView>
//       </View>
//     </ImageBackground>
//   );
// };

// export default AppointmentDoctorDetails;

//AppointmentDoctorDetails.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  Image,
  ImageBackground,
  ScrollView,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker"; // Ensure this is imported
import styles from "../../components/styles"; // Assuming you have a styles file
import axios from "axios";
import NavigationBar from "../../components/NavigationBar"; // Import here
import { Ionicons } from "@expo/vector-icons"; // Import icons from Expo
import { FontAwesome } from "@expo/vector-icons"; // Import FontAwesome for the heart icon
import API_BASE_URL from "../../../config/config";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AppointmentDoctorDetails = ({ route, navigation }) => {
  const { doctorId } = route.params;
  const [doctor, setDoctor] = useState({});
  const [selectedDate, setSelectedDate] = useState("");
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false); // Date picker visibility state
  const [favorites, setFavorites] = useState([]);
  const isFavorite = favorites.includes(doctorId);

  const imageUri = doctor.profile_image
    ? `data:image/png;base64,${doctor.profile_image}`
    : "https://via.placeholder.com/150";

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/doctor/${doctorId}`);
        setDoctor(response.data);
      } catch (error) {
        Alert.alert("Error", "Failed to fetch doctor details.");
        console.error(error);
      }
    };

    const fetchFavorites = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/getFavorites`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const favoriteIds = response.data.map(
          (doctor) => doctor.availability_id
        ); // Adjust based on your API response
        setFavorites(favoriteIds);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchDoctorDetails();
    fetchFavorites();
  }, [doctorId]);

  const toggleFavorite = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await axios.post(
        `${API_BASE_URL}/toggleFavorite`,
        { availabilityId: doctorId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setFavorites((prevFavorites) => {
          const newFavorites = prevFavorites.includes(doctorId)
            ? prevFavorites.filter((id) => id !== doctorId)
            : [...prevFavorites, doctorId];

          // Update favorites in AsyncStorage
          AsyncStorage.setItem("favorites", JSON.stringify(newFavorites));
          return newFavorites;
        });
      } else {
        console.error("Failed to update favorite status.");
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  // Handle the selected date
  const handleConfirmDate = async (date) => {
    const formattedDate = date.toISOString().split("T")[0]; // Format to YYYY-MM-DD
    setSelectedDate(formattedDate);
    setDatePickerVisibility(false);

    try {
      const response = await axios.get(`${API_BASE_URL}/availableTimes`, {
        params: { doctorId, date: formattedDate },
      });
      setAvailableTimes(response.data);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch available times.");
      console.error(error);
    }
  };

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert("Error", "Please select a date and time.");
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/bookAppointment`, {
        doctorId,
        date: selectedDate,
        time: selectedTime,
      });
      Alert.alert("Success", "Appointment booked successfully.");
      navigation.navigate("Home"); // Navigate back to Home
    } catch (error) {
      Alert.alert("Error", "Failed to book appointment.");
      console.error(error);
    }
  };

  //   const renderItem = ({ item }) => {
  // if (item.type === "experience") {
  //   return (
  //     <View style={styles.infoContainer}>
  //       <Text style={styles.infoText}>
  //         Experience: {doctor.experience || "N/A"}
  //       </Text>
  //     </View>
  //   );
  // }
  // if (item.type === "businessHours") {
  //   return (
  //     <View style={styles.infoContainer}>
  //       <Text style={styles.infoText}>
  //         Business Hours: {doctor.business_hours || "N/A"}
  //         {getBusinessDays(doctor.business_days)}
  //       </Text>
  //     </View>
  //   );
  // }
  //     if (item.type === "experience" || item.type === "businessHours") {
  //       return (
  //         <View style={styles.infoContainer}>
  //           {item.type === "experience" && (
  //             <View
  //               style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
  //             >
  //               <FontAwesome
  //                 name="briefcase"
  //                 size={16}
  //                 color="#e67e22"
  //                 style={{ marginRight: 5 }}
  //               />
  //               <Text style={styles.infoText}>
  //                 {doctor.experience || "N/A"} years experience
  //               </Text>
  //             </View>
  //           )}
  //           {item.type === "businessHours" && (
  //             <View
  //               style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
  //             >
  //               <FontAwesome
  //                 name="clock-o"
  //                 size={16}
  //                 color="#e67e22"
  //                 style={{ marginRight: 5 }}
  //               />
  //               <Text style={styles.infoText}>
  //                 {doctor.business_hours || "N/A"} / {""}
  //                 {getBusinessDays(doctor.business_days) || "N/A"}
  //               </Text>
  //             </View>
  //           )}
  //         </View>
  //       );
  //     }
  //     if (item.type === "description") {
  //       return (
  //         <View style={styles.whiteBackground}>
  //           <Text style={styles.aSectionTitle}>Descriptions</Text>
  //           <View style={styles.displayUnderline} />
  //           <Text style={styles.sectionContent}>{doctor.description}</Text>
  //         </View>
  //       );
  //     }
  //     if (item.type === "about") {
  //       return (
  //         <View style={styles.whiteBackground}>
  //           <Text style={styles.aSectionTitle}>About</Text>
  //           <View style={styles.displayUnderline} />
  //           <Text style={styles.sectionContent}>
  //             📞 {doctor.phone_number || "N/A"}
  //           </Text>
  //           <Text style={styles.sectionContent}>
  //             📍 {doctor.hospital_address || "N/A"}
  //           </Text>
  //         </View>
  //       );
  //     }
  //     if (item.type === "dateSelection") {
  //       return (
  //         <View style={styles.whiteBackground}>
  //           <Text style={styles.aSectionTitle}>Select Date</Text>
  //           <View style={styles.displayUnderline} />
  //           <TouchableOpacity
  //             style={styles.datePickerButton}
  //             onPress={() => setDatePickerVisibility(true)}
  //           >
  //             <Text style={styles.datePickerText}>
  //               {selectedDate || "Select a Date"}
  //             </Text>
  //           </TouchableOpacity>
  //           <DateTimePickerModal
  //             isVisible={isDatePickerVisible}
  //             mode="date"
  //             onConfirm={handleConfirmDate}
  //             onCancel={() => setDatePickerVisibility(false)}
  //             minimumDate={new Date()}
  //           />
  //         </View>
  //       );
  //     }
  //     if (item.type === "timeSelection") {
  //       return (
  //         <View style={styles.whiteBackground}>
  //           <Text style={styles.aSectionTitle}>Select Time</Text>
  //           <View style={styles.displayUnderline} />
  //           <FlatList
  //             data={availableTimes}
  //             keyExtractor={(item) => item}
  //             renderItem={({ item }) => (
  //               <TouchableOpacity
  //                 onPress={() => setSelectedTime(item)}
  //                 style={[
  //                   styles.timeSlot,
  //                   item === selectedTime ? styles.selectedTimeSlot : null,
  //                 ]}
  //               >
  //                 <Text>{item}</Text>
  //               </TouchableOpacity>
  //             )}
  //             ListEmptyComponent={
  //               selectedDate && (
  //                 <Text style={styles.noTimesText}>
  //                   No available times for the selected date.
  //                 </Text>
  //               )
  //             }
  //           />
  //         </View>
  //       );
  //     }
  //     if (item.type === "bookButton") {
  //       return (
  //         <TouchableOpacity
  //           style={styles.bookButton}
  //           onPress={handleBookAppointment}
  //         >
  //           <Text style={styles.buttonText}>Book Appointment</Text>
  //         </TouchableOpacity>
  //       );
  //     }
  //     return null;
  //   };

  const getBusinessDays = (businessDays) => {
    switch (businessDays) {
      case "Weekday":
        return "(Mon-Fri)";
      case "Weekend":
        return "(Sat-Sun)";
      case "Everyday":
        return "(Mon-Sun)";
      default:
        return "";
    }
  };

  const data = [
    { type: "experience" },
    { type: "businessHours" },
    { type: "description" },
    { type: "about" },
    { type: "dateSelection" },
    { type: "timeSelection" },
    { type: "bookButton" },
  ];

  return (
    //     <ImageBackground
    //       source={require("../../../assets/DoctorDetails.png")}
    //       style={styles.background}
    //     >
    //       <View style={styles.smallHeaderContainer}>
    //         <TouchableOpacity
    //           onPress={() => navigation.goBack()}
    //           style={styles.backButton}
    //         >
    //           <Ionicons name="chevron-back" size={24} color="#000" />
    //         </TouchableOpacity>
    //         <Text style={styles.title}> {doctor.category} </Text>
    //       </View>

    //       <View style={styles.fixedDoctorCard}>
    //         <View style={styles.transDoctorCard}>
    //           <Image source={{ uri: imageUri }} style={styles.doctorImage} />
    //           <View style={styles.doctorInfo}>
    //             <Text style={styles.doctorName}>{doctor.username}</Text>
    //             <Text style={styles.doctorCategory}>{doctor.category}</Text>
    //             <Text style={styles.description}>Hospital: {doctor.location}</Text>
    //             <Text style={styles.doctorRating}>⭐ {doctor.rating || "N/A"}</Text>
    //           </View>
    //           <TouchableOpacity
    //             onPress={toggleFavorite}
    //             style={styles.favoriteIcon}
    //           >
    //             <FontAwesome
    //               name={isFavorite ? "heart" : "heart-o"}
    //               size={24}
    //               color={isFavorite ? "red" : "gray"}
    //             />
    //           </TouchableOpacity>
    //         </View>
    //       </View>

    //       <FlatList
    //         data={data}
    //         renderItem={renderItem}
    //         keyExtractor={(item) => item.type}
    //         // contentContainerStyle={styles.scrollableContent}
    //         style={styles.uAContainer}
    //       />
    //     </ImageBackground>
    //   );
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
        <Text style={styles.title}> {doctor.category} </Text>
      </View>
      <View style={styles.uAcontainer}>
        {/* Static Doctor Info */}
        <View style={styles.transDoctorCard}>
          <Image source={{ uri: imageUri }} style={styles.doctorImage} />
          <View style={styles.doctorInfo}>
            <Text style={styles.doctorName}>{doctor.username}</Text>
            <Text style={styles.doctorCategory}>{doctor.category}</Text>
            <Text style={styles.description}>Location: {doctor.location}</Text>
            <Text style={styles.doctorRating}>⭐ {doctor.rating || "N/A"}</Text>
          </View>
          <TouchableOpacity
            onPress={() => toggleFavorite(doctor.id)}
            style={styles.favoriteIcon}
          >
            <FontAwesome
              name={isFavorite ? "heart" : "heart-o"}
              size={24}
              color={isFavorite ? "red" : "gray"}
            />
          </TouchableOpacity>
        </View>

        {/* Static Doctor Info */}
        <View style={styles.uAContainer}>
          <View style={styles.infoContainer}>
            <FontAwesome
              name="briefcase"
              size={16}
              color="#e67e22"
              style={{ marginRight: 5 }}
            />
            <Text style={styles.infoText}>
              {doctor.experience || "N/A"} years experience
            </Text>
            <FontAwesome
              name="clock-o"
              size={16}
              color="#e67e22"
              style={{ marginRight: 5 }}
            />
            <Text style={styles.infoText}>
              {doctor.business_hours || "N/A"} /{" "}
              {getBusinessDays(doctor.business_days) || "N/A"}
            </Text>
          </View>
        </View>

        {/* Single FlatList for Entire Scrollable Content */}
        <FlatList
          data={[
            { key: "Profile" },
            { key: "Description" },
            { key: "About" },
            { key: "DatePicker" },
            { key: "TimeSlots" },
            { key: "BookButton" },
          ]}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => {
            if (item.key === "Profile") {
              return (
                <TouchableOpacity style={styles.profileButton}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <FontAwesome
                      name="user"
                      size={18}
                      color="#ffffff"
                      style={{ marginRight: 8 }}
                    />
                    <Text style={styles.profileButtonText}>Profile</Text>
                  </View>
                </TouchableOpacity>
              );
            }

            if (item.key === "Description") {
              return (
                <>
                  <Text style={styles.aSectionTitle}>Descriptions</Text>
                  <View style={styles.displayUnderline} />
                  <Text style={styles.sectionContent}>
                    {doctor.description}
                  </Text>
                </>
              );
            }

            if (item.key === "About") {
              return (
                <>
                  <Text style={styles.aSectionTitle}>About</Text>
                  <View style={styles.displayUnderline} />
                  <Text style={styles.sectionContent}>
                    📞 {doctor.phone_number || "N/A"}
                  </Text>
                  <Text style={styles.sectionContent}>
                    📍 {doctor.hospital_address || "N/A"}
                  </Text>
                </>
              );
            }

            if (item.key === "DatePicker") {
              return (
                <>
                  <Text style={styles.aSectionTitle}>Select Date</Text>
                  <View style={styles.displayUnderline} />
                  <TouchableOpacity
                    style={styles.datePickerButton}
                    onPress={() => setDatePickerVisibility(true)}
                  >
                    <Text style={styles.datePickerText}>
                      {selectedDate || "Select a Date"}
                    </Text>
                  </TouchableOpacity>
                  <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={handleConfirmDate}
                    onCancel={() => setDatePickerVisibility(false)}
                    minimumDate={new Date()}
                  />
                </>
              );
            }

            if (item.key === "TimeSlots") {
              return (
                <>
                  <Text style={styles.aSectionTitle}>Select Time</Text>
                  <View style={styles.displayUnderline} />
                  <FlatList
                    data={availableTimes}
                    keyExtractor={(time) => time}
                    renderItem={(
                      { item } // {renderItem}
                    ) => (
                      <TouchableOpacity
                        onPress={() => setSelectedTime(item)}
                        style={[
                          styles.timeSlot,
                          item === selectedTime
                            ? styles.selectedTimeSlot
                            : null,
                        ]}
                      >
                        <Text>{item}</Text>
                      </TouchableOpacity>
                    )}
                    ListEmptyComponent={
                      selectedDate && (
                        <Text style={styles.noTimesText}>
                          No available times for the selected date.
                        </Text>
                      )
                    }
                  />
                </>
              );
            }

            if (item.key === "BookButton") {
              return (
                <TouchableOpacity
                  style={styles.signOutButton}
                  onPress={handleBookAppointment}
                >
                  <Text style={styles.buttonText}>Book Appointment</Text>
                </TouchableOpacity>
              );
            }
            return null;
          }}
        />
      </View>
      <NavigationBar navigation={navigation} activePage="MainPage" />
    </ImageBackground>
  );
};

export default AppointmentDoctorDetails;
