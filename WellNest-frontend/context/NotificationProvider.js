// //NotificationProvider.js
// import React, { createContext, useState, useEffect, useContext } from "react";
// import axios from "axios";
// import API_BASE_URL from "../config/config";
// import { getUserIdFromToken } from "../services/authService";

// const NotificationContext = createContext();

// export const NotificationProvider = ({ children }) => {
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [userId, setUserId] = useState(null);

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

//   const markAsRead = async (notificationIds) => {
//     try {
//       await axios.put(`${API_BASE_URL}/notifications/mark-as-read`, {
//         notificationIds,
//       });
//       // Optimistically decrease the unread count
//       setUnreadCount((prevCount) =>
//         Math.max(prevCount - notificationIds.length, 0)
//       );

//       // Optionally re-fetch to confirm the unread count is accurate
//       if (userId) {
//         fetchUnreadCount(userId);
//       }
//     } catch (error) {
//       console.error(
//         "Error marking notifications as read:",
//         error.response ? error.response.data : error.message
//       );
//     }
//   };

//   useEffect(() => {
//     const initialize = async () => {
//       const userId = await getUserIdFromToken();
//       setUserId(userId);
//       if (userId) {
//         fetchUnreadCount(userId);
//         const interval = setInterval(() => fetchUnreadCount(userId), 30000);
//         return () => clearInterval(interval);
//       }
//     };
//     initialize();
//   }, []);

//   return (
//     <NotificationContext.Provider value={{ unreadCount, markAsRead }}>
//       {children}
//     </NotificationContext.Provider>
//   );
// };

// export const useNotification = () => useContext(NotificationContext);

import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useRef,
} from "react";
import axios from "axios";
import API_BASE_URL from "../config/config";
import { getUserIdFromToken } from "../services/authService";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [userId, setUserId] = useState(null);
  const intervalRef = useRef(null);

  const fetchUnreadCount = async (userId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/notifications/unread-count/${userId}`
      );
      setUnreadCount(response.data.unreadCount);
      // console.log(
      //   `Fetched unread count for userId ${userId}:`,
      //   response.data.unreadCount
      // ); // Debug log
    } catch (error) {
      console.error(
        "Error fetching unread count:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const markAsRead = async (notificationIds) => {
    try {
      await axios.put(`${API_BASE_URL}/notifications/mark-as-read`, {
        notificationIds,
      });
      // Optimistically decrease the unread count
      setUnreadCount((prevCount) =>
        Math.max(prevCount - notificationIds.length, 0)
      );

      // Optionally re-fetch to confirm the unread count is accurate
      if (userId) {
        // fetchUnreadCount(userId);
      }
    } catch (error) {
      console.error(
        "Error marking notifications as read:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const initializeInterval = async () => {
    const fetchedUserId = await getUserIdFromToken();
    setUserId(fetchedUserId);
    if (fetchedUserId) {
      console.log(fetchedUserId);
      fetchUnreadCount(fetchedUserId);
      intervalRef.current = setInterval(() => {
        // console.log(fetchedUserId);
        fetchUnreadCount(fetchedUserId);
      }, 3000);
      // return () => clearInterval(interval);
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  };

  const handleClearInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  // useEffect(() => {
  //   const initialize = async () => {
  //     const fetchedUserId = await getUserIdFromToken();
  //     setUserId(fetchedUserId);
  //     console.log("Fetched userId from token:", userId); // Debug log
  //     if (fetchedUserId) {
  //       console.log(fetchedUserId);
  //       fetchUnreadCount(fetchedUserId);
  //       // const interval = setInterval(() => {
  //       //   console.log(fetchedUserId);
  //       //   fetchUnreadCount(fetchedUserId);
  //       // }, 3000);
  //       // return () => clearInterval(interval);
  //     }
  //   };
  //   initialize();
  // }, []);

  return (
    <NotificationContext.Provider
      value={{
        unreadCount,
        markAsRead,
        initializeInterval,
        handleClearInterval,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
