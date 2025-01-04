// NotificationComponent.js
import PushNotification from "react-native-push-notification";

// Configure Push Notifications
PushNotification.configure({
  onNotification: function (notification) {
    console.log("Notification:", notification);
  },
});

// Function to schedule a notification
const scheduleNotification = (medication) => {
  PushNotification.localNotificationSchedule({
    id: medication.id.toString(),
    title: "Medication Reminder",
    message: `Time to take your medication: ${medication.pill_name}`,
    date: new Date(Date.now() + 60 * 1000), // Schedule for 1 minute later
    repeatType: "day", // Repeat daily if needed
  });
};

// Example usage
const medication = {
  id: 1,
  pill_name: "Aspirin",
  time: "14:00",
};

// Schedule the notification
scheduleNotification(medication);
