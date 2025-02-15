// HpVUpcomingAppointments.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  ImageBackground,
  Image,
  Modal,
  TextInput,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { getUserIdFromToken } from "../../../services/authService";
import API_BASE_URL from "../../../config/config";
import styles from "../../components/styles"; // Import shared styles
import HpNavigationBar from "../../components/HpNavigationBar";
import ImageViewer from "react-native-image-zoom-viewer"; // Import the zoom viewer
import { WebView } from "react-native-webview";
import * as Calendar from "expo-calendar";

const HpVUpcomingAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const navigation = useNavigation();
  const [meetingLink, setMeetingLink] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      fetchUpcomingAppointments();
    }, [])
  );

  useEffect(() => {
    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === "granted") {
        const calendars = await Calendar.getCalendarsAsync(
          Calendar.EntityTypes.EVENT
        );

        const expoCalendarIds = calendars
          .filter((calendar) => calendar.title === "Expo Calendar")
          .map((calendar) => calendar.id);
      }
    })();
  }, []);

  async function getDefaultCalendarSource() {
    const defaultCalendar = await Calendar.getDefaultCalendarAsync();
    return defaultCalendar.source;
  }

  async function createCalendar() {
    const defaultCalendarSource = await getDefaultCalendarSource();
    const newCalendarID = await Calendar.createCalendarAsync({
      title: "Expo Calendar",
      color: "green",
      entityType: Calendar.EntityTypes.EVENT,
      sourceId: defaultCalendarSource.id,
      source: defaultCalendarSource,
      name: "internalCalendarName",
      ownerAccount: "personal",
      accessLevel: Calendar.CalendarAccessLevel.OWNER,
    });
  }

  const setReminder = async (hpva_date, hpva_time, u_id) => {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status !== "granted") {
      console.log("Calendar permission not granted");
      return;
    }

    const calendars = await Calendar.getCalendarsAsync(
      Calendar.EntityTypes.EVENT
    );
    const expoCalendar = calendars.find(
      (calendar) => calendar.title === "Expo Calendar"
    );

    let calendarId;

    if (expoCalendar) {
      calendarId = expoCalendar.id;
    } else {
      const defaultCalendarSource = await Calendar.getDefaultCalendarAsync();
      calendarId = await Calendar.createCalendarAsync({
        title: "Expo Calendar",
        color: "blue",
        entityType: Calendar.EntityTypes.EVENT,
        sourceId: defaultCalendarSource.id,
        source: defaultCalendarSource,
        name: "internalCalendarName",
        ownerAccount: "personal",
        accessLevel: Calendar.CalendarAccessLevel.OWNER,
      });
    }

    // Check if hpva_time is defined
    if (!hpva_time) {
      console.error("hpva_time is undefined");
      return;
    }

    // Parse the appointment date and time
    try {
      // Combine date and time, then parse into a 24-hour ISO format
      const [time, meridian] = hpva_time.split(" ");
      const [hours, minutes] = time.split(":").map(Number);
      const adjustedHours =
        meridian === "PM" && hours < 12
          ? hours + 12
          : hours === 12 && meridian === "AM"
          ? 0
          : hours;

      const parsedDate = new Date(
        `${hpva_date}T${String(adjustedHours).padStart(2, "0")}:${String(
          minutes
        ).padStart(2, "0")}:00`
      );

      // Check if the parsed date is valid
      if (isNaN(parsedDate.getTime())) {
        throw new RangeError(`Invalid Date: ${hpva_date}T${hpva_time}`);
      }

      // Create the calendar event
      await Calendar.createEventAsync(calendarId, {
        title: "WellNest Virtual Appointment Reminder",
        startDate: parsedDate,
        endDate: new Date(parsedDate.getTime() + 60 * 60 * 1000), // Default 60 minutes duration
        timeZone: "GMT",
        alarms: [{ relativeOffset: -60 }], // Alert 1 hour before
      });
    } catch (error) {
      console.error("Error creating reminder:", error.message);
    }
  };

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

      const initialMeetingLinks = data.reduce((acc, appointment) => {
        acc[appointment.hpva_id] = appointment.meeting_link || "";
        return acc;
      }, {});
      setMeetingLink(initialMeetingLinks);
      setIsEditing(
        data.reduce((acc, appointment) => {
          acc[appointment.hpva_id] = Boolean(appointment.meeting_link);
          return acc;
        }, {})
      );
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

  const handleConfirmMeetingLink = async (appointmentId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/virtual/appointments/updateMeetingLink/${appointmentId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ meetingLink: meetingLink[appointmentId] }),
        }
      );
      if (!response.ok) throw new Error("Failed to update meeting link.");

      Alert.alert("Success", "Meeting link updated.");
      setIsEditing((prev) => ({ ...prev, [appointmentId]: true }));
    } catch (error) {
      console.error("Error updating meeting link:", error);
      Alert.alert("Error", "Failed to update meeting link.");
    }
  };

  const renderAppointment = ({ item }) => {
    let imageUri = item.profile_image || "https://via.placeholder.com/150";

    const openReceipt = async (receiptUrl, hpva_id, hpva_date, hpva_time) => {
      if (
        receiptUrl.startsWith("http://") ||
        receiptUrl.startsWith("https://")
      ) {
        setSelectedReceipt({ url: receiptUrl, hpva_id, hpva_date, hpva_time }); // Store both URL and hpva_id
      } else {
        setSelectedReceipt({
          url: `http://localhost:5001/${receiptUrl}`,
          hpva_id,
          hpva_date,
          hpva_time,
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
              onPress={() =>
                openReceipt(
                  item.receipt_url,
                  item.hpva_id,
                  item.hpva_date,
                  item.hpva_time
                )
              }
            >
              <View style={styles.checkStatusContainer}>
                <Ionicons name="receipt" size={24} color="white" />
                <Text style={styles.checkText}>Check Receipt</Text>
              </View>
            </TouchableOpacity>
          ) : null}

          {/* If approved and checked, show input for meeting link */}
          {item.status === "approved" && item.payment_status === "checked" && (
            <View style={styles.meetingLinkContainer}>
              <TextInput
                style={styles.HpVmeetingLinkInput}
                placeholder="Enter Meeting Link"
                value={meetingLink[item.hpva_id] || item.meeting_link || ""}
                onChangeText={(text) =>
                  setMeetingLink((prev) => ({ ...prev, [item.hpva_id]: text }))
                }
              />
              <TouchableOpacity
                style={styles.HpVconfirmButton}
                onPress={() => handleConfirmMeetingLink(item.hpva_id)}
              >
                <Text style={styles.HpVconfirmButtonText}>
                  {isEditing[item.hpva_id]
                    ? "Edit Meeting Link"
                    : "Confirm Meeting Link"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
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

        {isPDF ? (
          <WebView
            source={{ uri: selectedReceipt.url }} // Use selectedReceipt.url
            style={{ flex: 1 }}
            onError={(error) => {
              console.error("WebView Error:", error);
              Alert.alert("Error", "Failed to load PDF file.");
            }}
          />
        ) : (
          <ImageViewer
            imageUrls={[{ url: selectedReceipt.url }]} // Use selectedReceipt.url
            enableSwipeDown
            onSwipeDown={() => setSelectedReceipt(null)}
          />
        )}

        <View style={styles.modalButtonContainer}>
          <TouchableOpacity
            style={styles.HpVapproveButton}
            onPress={async () => {
              try {
                await updateAppointmentStatus(
                  selectedReceipt.hpva_id,
                  "approved",
                  "checked"
                );
                await setReminder(
                  selectedReceipt.hpva_date,
                  selectedReceipt.hpva_time,
                  selectedReceipt.u_id
                ); // Set the reminder after updating the status
                setSelectedReceipt(null); // Close the modal
              } catch (error) {
                console.error("Error setting reminder:", error);
                Alert.alert("Error", "Failed to set reminder.");
              }
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
        <HpNavigationBar navigation={navigation} />
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

        <View style={styles.singleUnderline}></View>
        <View style={[{ marginBottom: 20 }]}></View>
        <FlatList
          data={appointments}
          keyExtractor={(item) => item.hpva_id.toString()}
          renderItem={renderAppointment}
          contentContainerStyle={styles.hpContainer}
        />
        {renderReceiptModal()}
        <HpNavigationBar navigation={navigation} />
      </ImageBackground>
    </View>
  );
};

export default HpVUpcomingAppointments;
