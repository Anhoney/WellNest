// //HpUpcomingAppointments.js
// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   ScrollView,
//   ImageBackground,
//   Image,
// } from "react-native";
// import { useNavigation, useFocusEffect } from "@react-navigation/native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import API_BASE_URL from "../../../config/config";
// import axios from "axios";
// import { getUserIdFromToken } from "../../../services/authService";
// import Ionicons from "react-native-vector-icons/Ionicons";
// import { format } from "date-fns";
// import HpNavigationBar from "../../components/HpNavigationBar"; // Import your custom navigation bar component
// import styles from "../../components/styles"; // Import shared styles

// const HpVUpcomingAppointments = () => {
//   const [appointments, setAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigation = useNavigation();

//   // useEffect(() => {
//   //   fetchUpcomingAppointments();
//   // }, []);
//   useFocusEffect(
//     React.useCallback(() => {
//       fetchUpcomingAppointments();
//     }, [])
//   );

//   const fetchUpcomingAppointments = async () => {
//     try {
//       const hpId = await getUserIdFromToken(); // Get healthcare provider ID
//       console.log("hpId:", hpId);
//       if (!hpId) {
//         Alert.alert("Error", "Unable to fetch user information.");
//         return;
//       }

//       const response = await fetch(
//         `${API_BASE_URL}/virtual/getUpcomingAppointment/${hpId}`
//       );
//       if (!response.ok) {
//         throw new Error("Failed to fetch appointments.");
//       }

//       const data = await response.json();
//       setAppointments(data);
//       console.log("appointments", data);
//     } catch (error) {
//       console.error("Error fetching appointments:", error);
//       Alert.alert("Error", "Failed to fetch appointments.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const approveAppointment = async (appointmentId) => {
//     try {
//       const response = await fetch(
//         `${API_BASE_URL}/virtual/appointments/approve/${appointmentId}`,
//         { method: "PUT" }
//       );
//       if (!response.ok) {
//         throw new Error("Failed to approve appointment.");
//       }

//       const data = await response.json();
//       Alert.alert("Success", "Appointment approved successfully.");
//       fetchUpcomingAppointments(); // Refresh the list
//     } catch (error) {
//       console.error("Error approving appointment:", error);
//       Alert.alert("Error", "Failed to approve appointment.");
//     }
//   };

//   const renderAppointment = ({ item }) => {
//     // Log the appointment date for debugging
//     console.log("appointments", item.hpva_date);
//     // Convert date and time into readable formats
//     //   const formattedDate = item.app_date; // Already formatted by backend
//     //   const formattedTime = item.app_time; // Already formatted by backend
//     let imageUri = item.profile_image
//       ? item.profile_image // Base64 string returned from the backend
//       : "https://via.placeholder.com/150";

//     return (
//       <TouchableOpacity
//         style={styles.card}
//         onPress={() =>
//           navigation.navigate("HpUpcomingAppointmentDetails", {
//             hpva_id: item.hpva_id,
//           })
//         }
//       >
//         <Image source={{ uri: imageUri }} style={styles.doctorImage} />
//         <View style={styles.doctorInfo}>
//           <Text style={styles.doctorName}>{item.full_name}</Text>
//           <Text style={styles.details}>Date: {item.hpva_date}</Text>
//           <Text style={styles.details}>Time: {item.hpva_time}</Text>
//           <Text style={styles.details}>Patient: {item.who_will_see}</Text>
//           <Text style={styles.details}>Status: {item.status}</Text>
//           <Text style={styles.details}>
//             Payment Status: {item.payment_status}
//           </Text>

//           {item.status === "pending" && (
//             <TouchableOpacity
//               style={styles.approveButton}
//               onPress={() => approveAppointment(item.hpva_id)}
//             >
//               <View style={styles.statusContainer}>
//                 <Ionicons name="checkmark-circle" size={24} color="green" />
//                 <Text style={styles.approveText}>Approve</Text>
//               </View>
//             </TouchableOpacity>
//           )}
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   if (loading) {
//     return <Text>Loading...</Text>;
//   }

//   if (appointments.length === 0) {
//     return (
//       <ImageBackground
//         source={require("../../../assets/PlainGrey.png")}
//         style={styles.background}
//       >
//         {/* Title Section with Back chevron-back */}
//         <View style={styles.smallHeaderContainer}>
//           <TouchableOpacity
//             onPress={() => navigation.goBack()}
//             style={styles.backButton}
//           >
//             <Ionicons name="chevron-back" size={24} color="#000" />
//           </TouchableOpacity>
//           <Text style={styles.hpTitle}>Upcoming Appointments </Text>
//         </View>

//         <View style={styles.centerContent}>
//           <Image
//             source={require("../../../assets/NothingDog.png")}
//             style={styles.noDataImage}
//           />
//           <Text style={styles.noDataText}>No Upcoming Appointments</Text>
//         </View>
//       </ImageBackground>
//     );
//   }

//   return (
//     <ImageBackground
//       source={require("../../../assets/PlainGrey.png")}
//       style={styles.background}
//     >
//       {/* Title Section with Back chevron-back */}
//       <View style={styles.smallHeaderContainer}>
//         <TouchableOpacity
//           onPress={() => navigation.goBack()}
//           style={styles.backButton}
//         >
//           <Ionicons name="chevron-back" size={24} color="#000" />
//         </TouchableOpacity>
//         <Text style={styles.hpTitle}>Upcoming Appointments </Text>
//       </View>
//       <View style={styles.hpContainer}>
//         <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
//         <View style={styles.singleUnderline}></View>
//         {loading ? (
//           <Text>Loading...</Text>
//         ) : (
//           <FlatList
//             data={appointments}
//             keyExtractor={(item) => item.hpva_id.toString()}
//             renderItem={renderAppointment}
//             ListEmptyComponent={<Text>No upcoming appointments found.</Text>}
//           />
//         )}
//       </View>
//       {/* Navigation Bar */}
//       <HpNavigationBar navigation={navigation} />
//     </ImageBackground>
//   );
// };

// export default HpVUpcomingAppointments;

// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   Alert,
//   ImageBackground,
//   Image,
//   Modal,
// } from "react-native";
// import { useNavigation, useFocusEffect } from "@react-navigation/native";
// import Ionicons from "react-native-vector-icons/Ionicons";
// import { getUserIdFromToken } from "../../../services/authService";
// import API_BASE_URL from "../../../config/config";
// import styles from "../../components/styles"; // Import shared styles
// import HpNavigationBar from "../../components/HpNavigationBar";
// import ImageViewer from "react-native-image-zoom-viewer"; // Import the zoom viewer

// const HpVUpcomingAppointments = () => {
//   const [appointments, setAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedReceipt, setSelectedReceipt] = useState(null);
//   const navigation = useNavigation();

//   useFocusEffect(
//     React.useCallback(() => {
//       fetchUpcomingAppointments();
//     }, [])
//   );

//   const fetchUpcomingAppointments = async () => {
//     try {
//       const hpId = await getUserIdFromToken();
//       if (!hpId) {
//         Alert.alert("Error", "Unable to fetch user information.");
//         return;
//       }

//       const response = await fetch(
//         `${API_BASE_URL}/virtual/getUpcomingAppointment/${hpId}`
//       );
//       if (!response.ok) throw new Error("Failed to fetch appointments.");

//       const data = await response.json();
//       setAppointments(data);
//     } catch (error) {
//       console.error("Error fetching appointments:", error);
//       Alert.alert("Error", "Failed to fetch appointments.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateAppointmentStatus = async (
//     appointmentId,
//     status,
//     paymentStatus
//   ) => {
//     try {
//       const response = await fetch(
//         `${API_BASE_URL}/virtual/appointments/updateStatus/${appointmentId}`,
//         {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ status, paymentStatus }),
//         }
//       );
//       if (!response.ok) throw new Error("Failed to update appointment status.");

//       Alert.alert("Success", `Appointment marked as ${status}`);
//       fetchUpcomingAppointments(); // Refresh list
//     } catch (error) {
//       console.error("Error updating appointment status:", error);
//       Alert.alert("Error", "Failed to update appointment status.");
//     }
//   };

//   const renderAppointment = ({ item }) => {
//     let imageUri = item.profile_image || "https://via.placeholder.com/150";

//     // Log the receipt URL correctly
//     console.log("receiptUrl", item.receipt_url); // Use item.receipt_url instead of receiptUrl

//     // const openReceipt = (receiptUrl) => setSelectedReceipt(receiptUrl);
//     const openReceipt = (receiptUrl) => {
//       //   const baseUrl = "http://10.115.66.6:5001";
//       // Check if the URL starts with "http://" or "https://"
//       if (
//         receiptUrl.startsWith("http://") ||
//         receiptUrl.startsWith("https://")
//       ) {
//         setSelectedReceipt(receiptUrl);
//         // setSelectedReceipt(
//         //   receiptUrl.replace("http://localhost:5001", baseUrl)
//         // );
//       } else {
//         // If the URL is not formatted correctly, prepend the base URL
//         setSelectedReceipt(`http://localhost:5001/${receiptUrl}`);
//         // setSelectedReceipt(`${baseUrl}/${receiptUrl}`);
//       }
//     };

//     return (
//       <TouchableOpacity
//         style={styles.card}
//         onPress={() =>
//           navigation.navigate("HpUpcomingAppointmentDetails", {
//             hpva_id: item.hpva_id,
//           })
//         }
//       >
//         <Image source={{ uri: imageUri }} style={styles.doctorImage} />
//         <View style={styles.doctorInfo}>
//           <Text style={styles.doctorName}>{item.full_name}</Text>
//           <Text style={styles.details}>Date: {item.hpva_date}</Text>
//           <Text style={styles.details}>Time: {item.hpva_time}</Text>
//           <Text style={styles.details}>Patient: {item.who_will_see}</Text>
//           <Text style={styles.details}>Status: {item.status}</Text>
//           <Text style={styles.details}>
//             Payment Status: {item.payment_status}
//           </Text>

//           {item.payment_status === "uncheck" || item.status === "pending" ? (
//             <TouchableOpacity
//               style={styles.checkReceiptButton}
//               onPress={() => openReceipt(item.receipt_url)}
//             >
//               <View style={styles.statusContainer}>
//                 <Ionicons name="receipt" size={24} color="blue" />
//                 <Text style={styles.checkText}>Check Receipt</Text>
//               </View>
//             </TouchableOpacity>
//           ) : null}
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   if (loading) return <Text>Loading...</Text>;

//   if (appointments.length === 0) {
//     return (
//       <ImageBackground
//         source={require("../../../assets/PlainGrey.png")}
//         style={styles.background}
//       >
//         {/* Title Section with Back chevron-back */}
//         <View style={styles.smallHeaderContainer}>
//           <TouchableOpacity
//             onPress={() => navigation.goBack()}
//             style={styles.backButton}
//           >
//             <Ionicons name="chevron-back" size={24} color="#000" />
//           </TouchableOpacity>
//           <Text style={styles.hpTitle}>Upcoming Virtual Appointments </Text>
//         </View>

//         <View style={styles.centerContent}>
//           <Image
//             source={require("../../../assets/NothingDog.png")}
//             style={styles.noDataImage}
//           />
//           <Text style={styles.noDataText}>No Upcoming Appointments</Text>
//         </View>
//       </ImageBackground>
//     );
//   }

//   return (
//     <ImageBackground
//       source={require("../../../assets/PlainGrey.png")}
//       style={styles.background}
//     >
//       {/* Title Section */}
//       <View style={styles.smallHeaderContainer}>
//         <TouchableOpacity
//           onPress={() => navigation.goBack()}
//           style={styles.backButton}
//         >
//           <Ionicons name="chevron-back" size={24} color="#000" />
//         </TouchableOpacity>
//         <Text style={styles.hpTitle}>Upcoming Vitual {"\n"} Appointments</Text>
//       </View>
//       <View style={styles.hpContainer}>
//         <Text style={styles.sectionTitle}>Upcoming Virtual Appointments</Text>
//         <View style={styles.singleUnderline}></View>
//         {/* Appointment List */}
//         <FlatList
//           data={appointments}
//           keyExtractor={(item) => item.hpva_id.toString()}
//           renderItem={renderAppointment}
//         />
//       </View>
//       {/* Navigation Bar */}
//       <HpNavigationBar navigation={navigation} />

//       {/* Receipt Modal */}
//       {/* {selectedReceipt && (
//         <Modal visible={true} animationType="slide" transparent={true}>
//           <View style={styles.HpVmodalContainer}>
//             <View style={styles.HpVmodalContent}>
//               <Image
//                 source={{ uri: selectedReceipt }}
//                 style={styles.receiptImage}
//                 onError={(error) =>
//                   console.error("Image Load Error:", error.nativeEvent)
//                 }
//               />
//               <View style={styles.modalActions}>
//                 <TouchableOpacity
//                   style={styles.approveButton}
//                   onPress={() => {
//                     updateAppointmentStatus(
//                       item.hpva_id,
//                       "approved",
//                       "checked"
//                     );
//                     setSelectedReceipt(null);
//                   }}
//                 >
//                   <Text style={styles.approveText}>Approve</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   style={styles.problemButton}
//                   onPress={() => {
//                     updateAppointmentStatus(
//                       item.hpva_id,
//                       "receipt problem",
//                       "checked"
//                     );
//                     setSelectedReceipt(null);
//                   }}
//                 >
//                   <Text style={styles.problemText}>Receipt Problem</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   style={styles.cancelButton}
//                   onPress={() => setSelectedReceipt(null)}
//                 >
//                   <Ionicons name="close-circle" size={24} color="red" />
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </View>
//         </Modal> */}
//       {/* Receipt Modal */}
//       {/* {selectedReceipt && (
//         <Modal visible={true} animationType="fade" transparent={false}>
//           <Ionicons
//             name="close-circle"
//             size={36}
//             color="red"
//             style={styles.closeIcon}
//             onPress={() => setSelectedReceipt(null)}
//           />
//           <ImageViewer
//             imageUrls={[{ url: selectedReceipt }]} // Single image array
//             enableSwipeDown
//             onSwipeDown={() => setSelectedReceipt(null)}
//           />
//         </Modal>
//       )} */}
//       {selectedReceipt && (
//         <Modal visible={true} animationType="fade" transparent={false}>
//           {/* Close Button */}
//           <Ionicons
//             name="close-circle"
//             size={36}
//             color="red"
//             style={styles.HpVcloseIcon}
//             onPress={() => setSelectedReceipt(null)}
//           />

//           {/* Zoomable Image or PDF */}
//           <ImageViewer
//             imageUrls={[{ url: selectedReceipt }]} // Single image array
//             enableSwipeDown
//             onSwipeDown={() => setSelectedReceipt(null)}
//           />

//           {/* Action Buttons Below the Viewer */}
//           <View style={styles.modalButtonContainer}>
//             {/* Approve Button */}
//             <TouchableOpacity
//               style={styles.HpVapproveButton}
//               onPress={() => {
//                 updateAppointmentStatus(
//                   selectedReceipt.hpva_id,
//                   "approved",
//                   "checked"
//                 );
//                 setSelectedReceipt(null);
//               }}
//             >
//               <Text style={styles.HpVapproveText}>Approve</Text>
//             </TouchableOpacity>

//             {/* Receipt Problem Button */}
//             <TouchableOpacity
//               style={styles.HpVproblemButton}
//               onPress={() => {
//                 updateAppointmentStatus(
//                   selectedReceipt.hpva_id,
//                   "receipt problem",
//                   "checked"
//                 );
//                 setSelectedReceipt(null);
//               }}
//             >
//               <Text style={styles.HpVproblemText}>Receipt Problem</Text>
//             </TouchableOpacity>
//           </View>
//         </Modal>
//       )}
//     </ImageBackground>
//   );
// };

// export default HpVUpcomingAppointments;

// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   Alert,
//   ImageBackground,
//   Image,
//   Modal,
// } from "react-native";
// import { useNavigation, useFocusEffect } from "@react-navigation/native";
// import Ionicons from "react-native-vector-icons/Ionicons";
// import { getUserIdFromToken } from "../../../services/authService";
// import API_BASE_URL from "../../../config/config";
// import styles from "../../components/styles"; // Import shared styles
// import HpNavigationBar from "../../components/HpNavigationBar";
// import ImageViewer from "react-native-image-zoom-viewer"; // Import the zoom viewer
// import Pdf from "react-native-pdf"; // Import the PDF viewer

// const HpVUpcomingAppointments = () => {
//   const [appointments, setAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedReceipt, setSelectedReceipt] = useState(null);
//   const navigation = useNavigation();

//   useFocusEffect(
//     React.useCallback(() => {
//       fetchUpcomingAppointments();
//     }, [])
//   );

//   const fetchUpcomingAppointments = async () => {
//     try {
//       const hpId = await getUserIdFromToken();
//       if (!hpId) {
//         Alert.alert("Error", "Unable to fetch user information.");
//         return;
//       }

//       const response = await fetch(
//         `${API_BASE_URL}/virtual/getUpcomingAppointment/${hpId}`
//       );
//       if (!response.ok) throw new Error("Failed to fetch appointments.");

//       const data = await response.json();
//       setAppointments(data);
//     } catch (error) {
//       console.error("Error fetching appointments:", error);
//       Alert.alert("Error", "Failed to fetch appointments.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateAppointmentStatus = async (
//     appointmentId,
//     status,
//     paymentStatus
//   ) => {
//     try {
//       const response = await fetch(
//         `${API_BASE_URL}/virtual/appointments/updateStatus/${appointmentId}`,
//         {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ status, paymentStatus }),
//         }
//       );
//       if (!response.ok) throw new Error("Failed to update appointment status.");

//       Alert.alert("Success", `Appointment marked as ${status}`);
//       fetchUpcomingAppointments(); // Refresh list
//     } catch (error) {
//       console.error("Error updating appointment status:", error);
//       Alert.alert("Error", "Failed to update appointment status.");
//     }
//   };

//   const renderAppointment = ({ item }) => {
//     let imageUri = item.profile_image || "https://via.placeholder.com/150";

//     const openReceipt = (receiptUrl) => {
//       if (
//         receiptUrl.startsWith("http://") ||
//         receiptUrl.startsWith("https://")
//       ) {
//         setSelectedReceipt(receiptUrl);
//       } else {
//         setSelectedReceipt(`http://localhost:5001/${receiptUrl}`);
//       }
//     };

//     return (
//       <TouchableOpacity
//         style={styles.card}
//         onPress={() =>
//           navigation.navigate("HpUpcomingAppointmentDetails", {
//             hpva_id: item.hpva_id,
//           })
//         }
//       >
//         <Image source={{ uri: imageUri }} style={styles.doctorImage} />
//         <View style={styles.doctorInfo}>
//           <Text style={styles.doctorName}>{item.full_name}</Text>
//           <Text style={styles.details}>Date: {item.hpva_date}</Text>
//           <Text style={styles.details}>Time: {item.hpva_time}</Text>
//           <Text style={styles.details}>Patient: {item.who_will_see}</Text>
//           <Text style={styles.details}>Status: {item.status}</Text>
//           <Text style={styles.details}>
//             Payment Status: {item.payment_status}
//           </Text>

//           {item.payment_status === "uncheck" || item.status === "pending" ? (
//             <TouchableOpacity
//               style={styles.checkReceiptButton}
//               onPress={() => openReceipt(item.receipt_url)}
//             >
//               <View style={styles.statusContainer}>
//                 <Ionicons name="receipt" size={24} color="blue" />
//                 <Text style={styles.checkText}>Check Receipt</Text>
//               </View>
//             </TouchableOpacity>
//           ) : null}
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   //   const renderReceiptModal = () => {
//   //     if (!selectedReceipt) return null;

//   //     const isPDF = selectedReceipt.endsWith(".pdf");

//   //     return (
//   //       <Modal visible={true} animationType="fade" transparent={false}>
//   //         <Ionicons
//   //           name="close-circle"
//   //           size={36}
//   //           color="red"
//   //           style={styles.HpVcloseIcon}
//   //           onPress={() => setSelectedReceipt(null)}
//   //         />
//   //         {isPDF ? (
//   //           <Pdf
//   //             source={{ uri: selectedReceipt, cache: true }}
//   //             style={{ flex: 1 }}
//   //             onError={(error) => {
//   //               console.error("PDF Load Error:", error);
//   //               Alert.alert("Error", "Failed to load PDF.");
//   //             }}
//   //           />
//   //         ) : (
//   //           <ImageViewer
//   //             imageUrls={[{ url: selectedReceipt }]} // Single image array
//   //             enableSwipeDown
//   //             onSwipeDown={() => setSelectedReceipt(null)}
//   //           />
//   //         )}
//   //         <View style={styles.modalButtonContainer}>
//   //           <TouchableOpacity
//   //             style={styles.HpVapproveButton}
//   //             onPress={() => {
//   //               updateAppointmentStatus(
//   //                 selectedReceipt.hpva_id,
//   //                 "approved",
//   //                 "checked"
//   //               );
//   //               setSelectedReceipt(null);
//   //             }}
//   //           >
//   //             <Text style={styles.HpVapproveText}>Approve</Text>
//   //           </TouchableOpacity>
//   //           <TouchableOpacity
//   //             style={styles.HpVproblemButton}
//   //             onPress={() => {
//   //               updateAppointmentStatus(
//   //                 selectedReceipt.hpva_id,
//   //                 "receipt problem",
//   //                 "checked"
//   //               );
//   //               setSelectedReceipt(null);
//   //             }}
//   //           >
//   //             <Text style={styles.HpVproblemText}>Receipt Problem</Text>
//   //           </TouchableOpacity>
//   //         </View>
//   //       </Modal>
//   //     );
//   //   };

//   const renderReceiptModal = () => {
//     if (!selectedReceipt) return null;

//     const isPDF = selectedReceipt.endsWith(".pdf");

//     return (
//       <Modal visible={true} animationType="fade" transparent={false}>
//         <Ionicons
//           name="close-circle"
//           size={36}
//           color="red"
//           style={styles.HpVcloseIcon}
//           onPress={() => setSelectedReceipt(null)}
//         />
//         {isPDF ? (
//           <View style={{ flex: 1 }}>
//             <Pdf
//               source={{ uri: selectedReceipt, cache: true }}
//               onLoadComplete={(numberOfPages) => {
//                 console.log(`Loaded PDF with ${numberOfPages} pages`);
//               }}
//               onError={(error) => {
//                 console.error("PDF Load Error:", error);
//                 Alert.alert(
//                   "Error",
//                   "Failed to load PDF. Check the file link."
//                 );
//               }}
//               style={{ flex: 1 }}
//             />
//           </View>
//         ) : (
//           <ImageViewer
//             imageUrls={[{ url: selectedReceipt }]} // Single image array
//             enableSwipeDown
//             onSwipeDown={() => setSelectedReceipt(null)}
//           />
//         )}
//         <View style={styles.modalButtonContainer}>
//           <TouchableOpacity
//             style={styles.HpVapproveButton}
//             onPress={() => {
//               updateAppointmentStatus(
//                 selectedReceipt.hpva_id,
//                 "approved",
//                 "checked"
//               );
//               setSelectedReceipt(null);
//             }}
//           >
//             <Text style={styles.HpVapproveText}>Approve</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={styles.HpVproblemButton}
//             onPress={() => {
//               updateAppointmentStatus(
//                 selectedReceipt.hpva_id,
//                 "receipt problem",
//                 "checked"
//               );
//               setSelectedReceipt(null);
//             }}
//           >
//             <Text style={styles.HpVproblemText}>Receipt Problem</Text>
//           </TouchableOpacity>
//         </View>
//       </Modal>
//     );
//   };

//   if (loading) return <Text>Loading...</Text>;

//   if (appointments.length === 0) {
//     return (
//       <ImageBackground
//         source={require("../../../assets/PlainGrey.png")}
//         style={styles.background}
//       >
//         <View style={styles.smallHeaderContainer}>
//           <TouchableOpacity
//             onPress={() => navigation.goBack()}
//             style={styles.backButton}
//           >
//             <Ionicons name="chevron-back" size={24} color="#000" />
//           </TouchableOpacity>
//           <Text style={styles.hpTitle}>Upcoming Virtual Appointments </Text>
//         </View>

//         <View style={styles.centerContent}>
//           <Image
//             source={require("../../../assets/NothingDog.png")}
//             style={styles.noDataImage}
//           />
//           <Text style={styles.noDataText}>No Upcoming Appointments</Text>
//         </View>
//       </ImageBackground>
//     );
//   }

//   return (
//     <ImageBackground
//       source={require("../../../assets/PlainGrey.png")}
//       style={styles.background}
//     >
//       <View style={styles.smallHeaderContainer}>
//         <TouchableOpacity
//           onPress={() => navigation.goBack()}
//           style={styles.backButton}
//         >
//           <Ionicons name="chevron-back" size={24} color="#000" />
//         </TouchableOpacity>
//         <Text style={styles.hpTitle}>Upcoming Virtual {"\n"} Appointments</Text>
//       </View>
//       <View style={styles.hpContainer}>
//         <Text style={styles.sectionTitle}>Upcoming Virtual Appointments</Text>
//         <View style={styles.singleUnderline}></View>
//         <FlatList
//           data={appointments}
//           keyExtractor={(item) => item.hpva_id.toString()}
//           renderItem={renderAppointment}
//         />
//       </View>
//       <HpNavigationBar navigation={navigation} />
//       {renderReceiptModal()}
//     </ImageBackground>
//   );
// };

// export default HpVUpcomingAppointments;

import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  ImageBackground,
  Image,
  Modal,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { getUserIdFromToken } from "../../../services/authService";
import API_BASE_URL from "../../../config/config";
import styles from "../../components/styles"; // Import shared styles
import HpNavigationBar from "../../components/HpNavigationBar";
import ImageViewer from "react-native-image-zoom-viewer"; // Import the zoom viewer
import * as DocumentPicker from "expo-document-picker"; // Import DocumentPicker
import * as FileSystem from "expo-file-system"; // Import FileSystem
import { WebView } from "react-native-webview";

const HpVUpcomingAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      fetchUpcomingAppointments();
    }, [])
  );

  // Function to format service names
  const formatServiceName = (serviceName) => {
    return serviceName.replace(/([A-Z])/g, " $1").trim();
  };

  const fetchUpcomingAppointments = async () => {
    try {
      const hpId = await getUserIdFromToken();
      if (!hpId) {
        Alert.alert("Error", "Unable to fetch user information.");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/virtual/getUpcomingAppointment/${hpId}`
      );
      if (!response.ok) throw new Error("Failed to fetch appointments.");

      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      Alert.alert("Error", "Failed to fetch appointments.");
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (
    appointmentId,
    status,
    paymentStatus
  ) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/virtual/appointments/updateStatus/${appointmentId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status, paymentStatus }),
        }
      );
      if (!response.ok) throw new Error("Failed to update appointment status.");

      Alert.alert("Success", `Appointment marked as ${status}`);
      fetchUpcomingAppointments(); // Refresh list
    } catch (error) {
      console.error("Error updating appointment status:", error);
      Alert.alert("Error", "Failed to update appointment status.");
    }
  };

  const renderAppointment = ({ item }) => {
    let imageUri = item.profile_image || "https://via.placeholder.com/150";

    const openReceipt = async (receiptUrl, hpva_id) => {
      if (
        receiptUrl.startsWith("http://") ||
        receiptUrl.startsWith("https://")
      ) {
        // setSelectedReceipt(receiptUrl);
        setSelectedReceipt({ url: receiptUrl, hpva_id }); // Store both URL and hpva_id
      } else {
        // setSelectedReceipt(`http://localhost:5001/${receiptUrl}`);
        setSelectedReceipt({
          url: `http://localhost:5001/${receiptUrl}`,
          hpva_id,
        }); // Store both URL and hpva_id
      }
    };

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate("HpVUpcomingAppointmentDetails", {
            hpva_id: item.hpva_id,
          })
        }
      >
        <Image source={{ uri: imageUri }} style={styles.doctorImage} />
        <View style={styles.doctorInfo}>
          <Text style={styles.doctorName}>{item.full_name}</Text>
          <Text style={styles.details}>
            Service: {formatServiceName(item.service)}
          </Text>
          <Text style={styles.details}>Date: {item.hpva_date}</Text>
          <Text style={styles.details}>Time: {item.hpva_time}</Text>
          <Text style={styles.details}>Patient: {item.who_will_see}</Text>
          {/* <Text style={styles.details}>Status: {item.status}</Text>
          <Text style={styles.details}>
            Payment Status: {item.payment_status}
          </Text> */}
          <Text
            style={[
              styles.details,
              item.status === "approved" ? { color: "green" } : {},
            ]}
          >
            Status: {item.status}
          </Text>
          <Text
            style={[
              styles.details,
              item.payment_status === "uncheck" ? { color: "red" } : {},
              item.payment_status === "checked" ? { color: "green" } : {},
            ]}
          >
            Payment Status: {item.payment_status}
          </Text>

          {item.payment_status === "uncheck" || item.status === "pending" ? (
            <TouchableOpacity
              style={styles.checkReceiptButton}
              onPress={() => openReceipt(item.receipt_url, item.hpva_id)}
            >
              <View style={styles.checkStatusContainer}>
                <Ionicons name="receipt" size={24} color="white" />
                <Text style={styles.checkText}>Check Receipt</Text>
              </View>
            </TouchableOpacity>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  const renderReceiptModal = () => {
    if (!selectedReceipt) return null;

    const isPDF = selectedReceipt.url.endsWith(".pdf");

    return (
      <Modal visible={true} animationType="fade" transparent={false}>
        <Ionicons
          name="close-circle"
          size={36}
          color="red"
          style={styles.HpVcloseIcon}
          onPress={() => setSelectedReceipt(null)}
        />
        {/* {isPDF ? (
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              onPress={async () => {
                const fileUri = await FileSystem.downloadAsync(
                  selectedReceipt,
                  FileSystem.documentDirectory +
                    selectedReceipt.split("/").pop()
                );
                // Open the downloaded PDF using the default PDF viewer
                await FileSystem.openDocument(fileUri.uri);
              }}
            >
              <Text style={styles.openPdfText}>Open PDF</Text>
            </TouchableOpacity>
          </View> */}
        {isPDF ? (
          <WebView
            source={{ uri: selectedReceipt.url }} // Use selectedReceipt.url
            // source={{ uri: selectedReceipt }}
            style={{ flex: 1 }}
            onError={(error) => {
              console.error("WebView Error:", error);
              Alert.alert("Error", "Failed to load PDF file.");
            }}
          />
        ) : (
          <ImageViewer
            imageUrls={[{ url: selectedReceipt.url }]} // Use selectedReceipt.url
            // imageUrls={[{ url: selectedReceipt }]} // Single image array
            enableSwipeDown
            onSwipeDown={() => setSelectedReceipt(null)}
          />
        )}

        <View style={styles.modalButtonContainer}>
          <TouchableOpacity
            style={styles.HpVapproveButton}
            onPress={() => {
              updateAppointmentStatus(
                selectedReceipt.hpva_id,
                "approved",
                "checked"
              );
              setSelectedReceipt(null);
            }}
          >
            <Text style={styles.HpVapproveText}>Approve</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.HpVproblemButton}
            onPress={() => {
              updateAppointmentStatus(
                selectedReceipt.hpva_id,
                "receipt problem",
                "checked"
              );
              setSelectedReceipt(null);
            }}
          >
            <Text style={styles.HpVproblemText}>Receipt Problem</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  };

  if (loading) return <Text>Loading...</Text>;

  if (appointments.length === 0) {
    return (
      <ImageBackground
        source={require("../../../assets/PlainGrey.png")}
        style={styles.background}
      >
        <View style={styles.smallHeaderContainer}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.hpTitle}>Upcoming Virtual Appointments </Text>
        </View>

        <View style={styles.centerContent}>
          <Image
            source={require("../../../assets/NothingDog.png")}
            style={styles.noDataImage}
          />
          <Text style={styles.noDataText}>No Upcoming Appointments</Text>
        </View>
      </ImageBackground>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={require("../../../assets/PlainGrey.png")}
        style={styles.background}
      >
        <View style={styles.smallHeaderContainer}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.hpTitle}>
            Upcoming Virtual {"\n"} Appointments
          </Text>
        </View>
        <Text>{"/n"}</Text>
        <View style={styles.singleUnderline}></View>
        {/* <View style={styles.hpContainer}> */}
        {/* <Text style={styles.sectionTitle}>Upcoming Virtual Appointments</Text> */}
        <View style={styles.singleUnderline}></View>
        <FlatList
          data={appointments}
          keyExtractor={(item) => item.hpva_id.toString()}
          renderItem={renderAppointment}
          contentContainerStyle={styles.hpContainer}
        />
        {/* </View> */}
        {renderReceiptModal()}
        <HpNavigationBar navigation={navigation} />
      </ImageBackground>
    </View>
  );
};

export default HpVUpcomingAppointments;
