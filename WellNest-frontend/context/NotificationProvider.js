//NotificationProvider.js
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
// import scheduleNotification from "../src/utils/notificationUtils";
// import {
//   scheduleNotification,
//   requestNotificationPermissions,
// } from "../src/utils/notificationUtils";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [userId, setUserId] = useState(null);
  const intervalRef = useRef(null);

  // Fetch notifications from the server
  const fetchNotifications = async () => {
    try {
      if (!userId) return;

      const response = await axios.get(
        `${API_BASE_URL}/notifications/${userId}`
      );

      // Example: Schedule notifications based on server response
      // response.data.notifications.forEach((notification) => {
      //   scheduleNotification(notification.time, notification.message);
      // });

      // Update unread count
      fetchUnreadCount(userId);
    } catch (error) {
      console.error(
        "Error fetching notifications:",
        error.response ? error.response.data : error.message
      );
    }
  };

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
      fetchNotifications();
      console.log(fetchedUserId);
      fetchUnreadCount(fetchedUserId);
      intervalRef.current = setInterval(() => {
        // console.log(fetchedUserId);
        fetchNotifications();
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
