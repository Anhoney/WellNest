// import React from "react";
// import { View, Text, Image, TouchableOpacity } from "react-native";
// import { FontAwesome } from "@expo/vector-icons"; // For icons
// import PropTypes from "prop-types";
// import styles from "./styles"; // Import custom styles for components

// const DoctorCard = ({ doctor, onPress }) => {
//   if (!doctor) {
//     // You could return null or a fallback UI in case the doctor object is missing
//     return <Text>Doctor not found</Text>;
//   }

//   const imageUri = doctor.profile_image
//     ? `data:image/png;base64,${doctor.profile_image}`
//     : "https://via.placeholder.com/150"; // Fallback image

//   return (
//     <TouchableOpacity onPress={onPress} style={styles.cardContainer}>
//       <Image source={{ uri: imageUri }} style={styles.doctorImage} />
//       <View style={styles.cardContent}>
//         <Text style={styles.doctorName}>{doctor.username}</Text>
//         <Text style={styles.doctorCategory}>{doctor.category}</Text>
//         <Text style={styles.description}>Location: {doctor.location}</Text>
//         <View style={styles.ratingContainer}>
//           <Text style={styles.doctorRating}>⭐ {doctor.rating || "N/A"}</Text>
//           <FontAwesome name="hospital-o" size={14} color="#666" />
//           <Text style={styles.hospitalName}>{doctor.hospital}</Text>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );
// };

// // PropTypes for validation
// DoctorCard.propTypes = {
//   doctor: PropTypes.shape({
//     username: PropTypes.string.isRequired,
//     category: PropTypes.string.isRequired,
//     location: PropTypes.string,
//     profile_image: PropTypes.string,
//     rating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
//     hospital: PropTypes.string,
//   }).isRequired,
//   onPress: PropTypes.func.isRequired,
// };

// export default DoctorCard;
