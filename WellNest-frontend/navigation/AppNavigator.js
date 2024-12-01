// frontend/navigation/AppNavigator.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

// Shared screens
import FirstPage from "../src/screens/FirstPage";
import LoginPage from "../src/screens/LoginPage";
import ForgotPasswordPage from "../src/screens/ForgotPasswordPage";
import RegisterPage from "../src/screens/RegisterPage";
import ChangePassword from "../src/screens/ChangePassword";

// Elderly and caregivers
import MainPage from "../src/screens/ElderlyNCaregivers/MainPage";
import AppointmentPage from "../src/screens/ElderlyNCaregivers/AppointmentPage";
import VirtualConsultationPage from "../src/screens/ElderlyNCaregivers/VirtualConsultationPage";
import PrescriptionHistoryPage from "../src/screens/ElderlyNCaregivers/PrescriptionHistoryPage";
import ProfilePage from "../src/screens/ElderlyNCaregivers/ProfilePage";
import SettingPage from "../src/screens/ElderlyNCaregivers/SettingPage";
import ProfileEditPage from "../src/screens/ElderlyNCaregivers/ProfileEditPage";
import MedicationReminderPage from "../src/screens/ElderlyNCaregivers/MedicationReminderPage";
import ElderlyAssessmentPage from "../src/screens/ElderlyNCaregivers/ElderlyAssessmentPage";
import AppointmentDoctorDetails from "../src/screens/ElderlyNCaregivers/AppointmentDoctorDetails";
import CategoryDoctorsScreen from "../src/screens/ElderlyNCaregivers/CategoryDoctorsScreen";
import DoctorProfileScreen from "../src/screens/ElderlyNCaregivers/DoctorProfileScreen";
import BookAppointmentDetailsScreen from "../src/screens/ElderlyNCaregivers/BookAppointmentDetailsScreen";
import AppointmentConfirmationScreen from "../src/screens/ElderlyNCaregivers/AppointmentConfirmationScreen";
import AppointmentHistoryScreen from "../src/screens/ElderlyNCaregivers/AppointmentHistoryScreen";
import HistoryAppDetails from "../src/screens/ElderlyNCaregivers/HistoryAppDetails";

// Healthcare Provider screens
import HealthcareProviderMainPage from "../src/screens/HealthcareProvider/HealthcareProviderMainPage";
import HpAppointmentManagementPage from "../src/screens/HealthcareProvider/HpAppointmentManagementPage";
import HpAppointmentCreationPage from "../src/screens/HealthcareProvider/HpAppointmentCreationPage";
import HpMyCreatedAppointments from "../src/screens/HealthcareProvider/HpMyCreatedAppointments";
import HpAppointmentEditPage from "../src/screens/HealthcareProvider/HpAppointmentEditPage";
import HpProfilePage from "../src/screens/HealthcareProvider/HpProfilePage";
import HpEditProfilePage from "../src/screens/HealthcareProvider/HpEditProfilePage";

// Community Organizer
import CommunityOrganizerMainPage from "../src/screens/CommunityOrganizers/CommunityOrganizerMainPage";
import CoProfilePage from "../src/screens/CommunityOrganizers/CoProfilePage";
import CoEditProfilePage from "../src/screens/CommunityOrganizers/CoEditProfilePage";

const Stack = createStackNavigator();

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator
      initialRouteName="FirstPage"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="FirstPage" component={FirstPage} />
      <Stack.Screen name="LoginPage" component={LoginPage} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordPage} />
      <Stack.Screen name="Register" component={RegisterPage} />
      <Stack.Screen
        name="MainPage"
        component={MainPage}
        options={{ title: "Home" }}
      />
      <Stack.Screen
        name="AppointmentBooking"
        component={AppointmentPage}
        options={{ title: "Book Appointment" }}
      />
      <Stack.Screen
        name="VirtualConsultation"
        component={VirtualConsultationPage}
        options={{ title: "Virtual Consultation" }}
      />
      <Stack.Screen
        name="Prescription"
        component={PrescriptionHistoryPage}
        options={{ title: "Prescription" }}
      />
      <Stack.Screen
        name="ProfilePage"
        component={ProfilePage}
        options={{ title: "Account" }}
      />
      <Stack.Screen
        name="SettingPage"
        component={SettingPage}
        options={{ title: "Setting" }}
      />
      <Stack.Screen
        name="ProfileEditPage"
        component={ProfileEditPage}
        options={{ title: "ProfileEdit" }}
      />
      <Stack.Screen
        name="MedicationReminderPage"
        component={MedicationReminderPage}
        options={{ title: "MedicationReminder" }}
      />
      <Stack.Screen
        name="ElderlyAssessmentPage"
        component={ElderlyAssessmentPage}
        options={{ title: "ElderlyAssessment" }}
      />
      <Stack.Screen
        name="HealthcareProviderMainPage"
        component={HealthcareProviderMainPage}
        options={{ title: "HealthcareProvider" }}
      />
      <Stack.Screen
        name="HpAppointmentManagementPage"
        component={HpAppointmentManagementPage}
        options={{ title: "AppointmentManagement" }}
      />
      <Stack.Screen
        name="HpAppointmentCreationPage"
        component={HpAppointmentCreationPage}
        options={{ title: "AppointmentCreation" }}
      />
      <Stack.Screen
        name="HpMyCreatedAppointments"
        component={HpMyCreatedAppointments}
        options={{ title: "MyCreatedAppointments" }}
      />
      <Stack.Screen
        name="HpAppointmentEditPage"
        component={HpAppointmentEditPage}
        options={{ title: "AppointmentEditPage" }}
      />
      <Stack.Screen
        name="HpProfilePage"
        component={HpProfilePage}
        options={{ title: "HpProfilePage" }}
      />
      <Stack.Screen
        name="HpEditProfilePage"
        component={HpEditProfilePage}
        options={{ title: "HpEditProfilePage" }}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{ title: "ChangePassword" }}
      />
      <Stack.Screen
        name="CommunityOrganizerMainPage"
        component={CommunityOrganizerMainPage}
        options={{ title: "CommunityOrganizerMainPage" }}
      />
      <Stack.Screen
        name="CoProfilePage"
        component={CoProfilePage}
        options={{ title: "CoProfilePage" }}
      />
      <Stack.Screen
        name="CoEditProfilePage"
        component={CoEditProfilePage}
        options={{ title: "CoEditProfilePage" }}
      />
      <Stack.Screen
        name="DoctorDetails"
        component={AppointmentDoctorDetails}
        options={{ title: "DoctorDetails" }}
      />
      <Stack.Screen name="CategoryDoctors" component={CategoryDoctorsScreen} />
      <Stack.Screen
        name="DoctorProfileScreen"
        component={DoctorProfileScreen}
        options={{ title: "DoctorProfile" }}
      />
      <Stack.Screen
        name="BookAppointmentDetailsScreen"
        component={BookAppointmentDetailsScreen}
        options={{ title: "BookAppointment" }}
      />
      <Stack.Screen
        name="AppointmentConfirmation"
        component={AppointmentConfirmationScreen}
        options={{ title: "AppointmentConfirmation" }}
      />
      <Stack.Screen
        name="AppointmentHistory"
        component={AppointmentHistoryScreen}
        options={{ title: "AppointmentHistory" }}
      />
      <Stack.Screen name="HistoryAppDetails" component={HistoryAppDetails} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
