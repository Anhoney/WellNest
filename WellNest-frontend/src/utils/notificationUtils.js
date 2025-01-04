//notificationUtils.js
import * as Notifications from "expo-notifications";

// Configure Notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Schedule Local Alarm Notification
export async function scheduleAlarmNotification(id, time, message) {
  const trigger = new Date(time); // Set to the desired time
  trigger.setSeconds(0);

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Medication Reminder",
      body: message,
      data: { id },
      sound: "default",
    },
    trigger,
  });
}
