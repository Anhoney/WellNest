// NotificationProvider.js
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

// Create a context for notifications
const NotificationContext = createContext();

// NotificationProvider component that provides notification-related data and functions
export const NotificationProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0); // State to track unread notification count
  const [userId, setUserId] = useState(null); // State to store the user ID
  const intervalRef = useRef(null); // Ref to store the interval ID for fetching notifications periodically

  // Fetch notifications from the server
  const fetchNotifications = async () => {
    try {
      if (!userId) return;

      const response = await axios.get(
        `${API_BASE_URL}/notifications/${userId}`
      );

      // Update unread count
      fetchUnreadCount(userId);
    } catch (error) {
      console.error(
        "Error fetching notifications:",
        error.response ? error.response.data : error.message
      );
    }
  };

  // Function to fetch the unread notification count
  const fetchUnreadCount = async (userId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/notifications/unread-count/${userId}`
      );
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      console.error(
        "Error fetching unread count:",
        error.response ? error.response.data : error.message
      );
    }
  };

  // Function to mark notifications as read
  const markAsRead = async (notificationIds) => {
    try {
      await axios.put(`${API_BASE_URL}/notifications/mark-as-read`, {
        notificationIds,
      });
      // Optimistically decrease the unread count
      setUnreadCount((prevCount) =>
        Math.max(prevCount - notificationIds.length, 0)
      );
    } catch (error) {
      console.error(
        "Error marking notifications as read:",
        error.response ? error.response.data : error.message
      );
    }
  };

  // Function to initialize the notification fetching interval
  const initializeInterval = async () => {
    const fetchedUserId = await getUserIdFromToken();
    setUserId(fetchedUserId);
    if (fetchedUserId) {
      fetchNotifications();
      fetchUnreadCount(fetchedUserId);
      intervalRef.current = setInterval(() => {
        fetchNotifications();
        fetchUnreadCount(fetchedUserId);
      }, 3000); // Fetch notifications every 3 seconds

      // Cleanup function to clear the interval when component unmounts
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  };

  // Function to manually clear the interval
  const handleClearInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        unreadCount, // Number of unread notifications
        markAsRead, // Function to mark notifications as read
        initializeInterval, // Function to start fetching notifications periodically
        handleClearInterval, // Function to stop fetching notifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to use the NotificationContext
export const useNotification = () => useContext(NotificationContext);
