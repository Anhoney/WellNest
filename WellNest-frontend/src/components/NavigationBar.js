// //NavigationBar.js
// // import React from "react";
// import React, { useEffect, useState } from "react";
// import { View, Text, TouchableOpacity } from "react-native";
// import Ionicons from "react-native-vector-icons/Ionicons";
// import styles from "./styles"; // Assuming you have your styles.js setup
// import axios from "axios";
// import API_BASE_URL from "../../config/config"; // Your API base URL
// import { getUserIdFromToken } from "../../services/authService"; // Helper to get userId

// const NavigationBar = ({ navigation, activePage }) => {
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [userId, setUserId] = useState(null);

//   // Fetch unread count from the server
//   const fetchUnreadCount = async (userId) => {
//     try {
//       const response = await axios.get(
//         `${API_BASE_URL}/notifications/unread-count/${userId}`
//       );
//       setUnreadCount(response.data.unreadCount);
//     } catch (error) {
//       console.error(
//         "Error fetching unread count:",
//         error.response ? error.response.data : error.message
//       );
//     }
//   };

//   // Fetch userId and setup interval for polling unread notifications
//   useEffect(() => {
//     const initialize = async () => {
//       const userId = await getUserIdFromToken();
//       setUserId(userId);
//       if (userId) {
//         fetchUnreadCount(userId); // Initial fetch
//         const interval = setInterval(() => fetchUnreadCount(userId), 30000); // Poll every 30 seconds
//         return () => clearInterval(interval); // Cleanup on unmount
//       }
//     };
//     initialize();
//   }, []);

//   const tabs = [
//     { name: "MainPage", label: "Home", icon: "home-outline" },
//     { name: "AppointmentHistory", label: "Schedule", icon: "calendar-outline" },
//     { name: "Chat", label: "Chat", icon: "chatbubble-ellipses-outline" },
//     {
//       name: "Notification",
//       label: "Notification",
//       icon: "notifications-outline",
//     },
//     { name: "ProfilePage", label: "Account", icon: "person-outline" },
//   ];

//   return (
//     <View style={styles.navigationBar}>
//       {tabs.map((tab, index) => (
//         <TouchableOpacity
//           key={index}
//           onPress={() => navigation.navigate(tab.name)}
//           style={styles.tabButton}
//         >
//           <View style={{ position: "relative" }}>
//             <Ionicons
//               name={tab.icon}
//               size={28}
//               color={activePage === tab.name ? "#e67e22" : "#273746"}
//             />
//             {tab.name === "Notification" && unreadCount > 0 && (
//               <View style={styles.redDot}>
//                 <Text style={styles.redDotText}>{unreadCount}</Text>
//               </View>
//             )}
//           </View>

//           <Text
//             style={[
//               styles.navText,
//               {
//                 color: activePage === tab.name ? "#e67e22" : "#273746",
//                 fontWeight: activePage === tab.name ? "bold" : "normal",
//               },
//             ]}
//           >
//             {tab.label}
//           </Text>
//         </TouchableOpacity>
//       ))}
//     </View>
//   );
// };

// export default NavigationBar;
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import styles from "./styles";
import { useNotification } from "../../context/NotificationProvider";

const NavigationBar = ({ navigation, activePage }) => {
  const { unreadCount } = useNotification();

  const tabs = [
    { name: "MainPage", label: "Home", icon: "home-outline" },
    { name: "AppointmentHistory", label: "Schedule", icon: "calendar-outline" },
    { name: "Chat", label: "Chat", icon: "chatbubble-ellipses-outline" },
    {
      name: "Notification",
      label: "Notification",
      icon: "notifications-outline",
    },
    { name: "ProfilePage", label: "Account", icon: "person-outline" },
  ];

  return (
    <View style={styles.navigationBar}>
      {tabs.map((tab, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => navigation.navigate(tab.name)}
          style={styles.tabButton}
        >
          <View style={{ position: "relative" }}>
            <Ionicons
              name={tab.icon}
              size={28}
              color={activePage === tab.name ? "#e67e22" : "#273746"}
            />
            {tab.name === "Notification" && unreadCount > 0 && (
              <View style={styles.redDot}>
                <Text style={styles.redDotText}>{unreadCount}</Text>
              </View>
            )}
          </View>
          <Text
            style={[
              styles.navText,
              {
                color: activePage === tab.name ? "#e67e22" : "#273746",
                fontWeight: activePage === tab.name ? "bold" : "normal",
              },
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default NavigationBar;
