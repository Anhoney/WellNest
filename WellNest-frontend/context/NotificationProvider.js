//NotificationProvider.js
import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import API_BASE_URL from "../config/config";
import { getUserIdFromToken } from "../services/authService";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [userId, setUserId] = useState(null);

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
        fetchUnreadCount(userId);
      }
    } catch (error) {
      console.error(
        "Error marking notifications as read:",
        error.response ? error.response.data : error.message
      );
    }
  };

  useEffect(() => {
    const initialize = async () => {
      const userId = await getUserIdFromToken();
      setUserId(userId);
      if (userId) {
        fetchUnreadCount(userId);
        const interval = setInterval(() => fetchUnreadCount(userId), 30000);
        return () => clearInterval(interval);
      }
    };
    initialize();
  }, []);

  return (
    <NotificationContext.Provider value={{ unreadCount, markAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
