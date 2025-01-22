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
import Notifications from "../src/screens/Notification";

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
import VirtualCategoryDoctorsScreen from "../src/screens/ElderlyNCaregivers/VirtualCategoryDoctorsScreen";
import VirtualDoctorDetails from "../src/screens/ElderlyNCaregivers/VirtualDoctorDetails";
import VirtualBookingDetails from "../src/screens/ElderlyNCaregivers/VirtualBookingDetails";
// import VirtualConfirmationScreen from "../src/screens/ElderlyNCaregivers/VirtualConfirmationScreen";
import VirtualDoctorProfileScreen from "../src/screens/ElderlyNCaregivers/VirtualDoctorProfileScreen";
import {
  VirtualConfirmationScreen,
  PaymentScreen,
} from "../src/screens/ElderlyNCaregivers/VirtualConfirmationScreen";
import MedicalReport from "../src/screens/ElderlyNCaregivers/MedicalReport";
import AddReminder from "../src/screens/ElderlyNCaregivers/AddReminder";
import SocialEventsScreen from "../src/screens/ElderlyNCaregivers/SocialEventsScreen";
import VolunteerOpportunitiesScreen from "../src/screens/ElderlyNCaregivers/VolunteerOpportunitiesScreen";
import FamilyCaregiverCollaboration from "../src/screens/ElderlyNCaregivers/CollaborationScreen";
import SocialEventsDetails from "../src/screens/ElderlyNCaregivers/SocialEventsDetails";
import VolunteerOpportunityDetails from "../src/screens/ElderlyNCaregivers/VolunteerOpportunityDetails";
import TestAssessment from "../src/screens/ElderlyNCaregivers/TestAssessment";
import CarePlanScreen from "../src/screens/ElderlyNCaregivers/CarePlanScreen";
import EditCarePlanScreen from "../src/screens/ElderlyNCaregivers/EditCarePlanScreen";
import AccessCollaborators from "../src/screens/ElderlyNCaregivers/AccessCollaborators";
import FamilyCollabScreen from "../src/screens/ElderlyNCaregivers/FamilyCollabScreen";
import CaregiverInformation from "../src/screens/ElderlyNCaregivers/CaregiverInformation";
import ChatRoomElderly from "../src/screens/ElderlyNCaregivers/ChatRoomElderly";
import ManageChatRoomElderly from "../src/screens/ElderlyNCaregivers/ManageChatRoomElderly";

// Healthcare Provider screens
import HealthcareProviderMainPage from "../src/screens/HealthcareProvider/HealthcareProviderMainPage";
import HpAppointmentManagementPage from "../src/screens/HealthcareProvider/HpAppointmentManagementPage";
import HpAppointmentCreationPage from "../src/screens/HealthcareProvider/HpAppointmentCreationPage";
import HpMyCreatedAppointments from "../src/screens/HealthcareProvider/HpMyCreatedAppointments";
import HpAppointmentEditPage from "../src/screens/HealthcareProvider/HpAppointmentEditPage";
import HpProfilePage from "../src/screens/HealthcareProvider/HpProfilePage";
import HpEditProfilePage from "../src/screens/HealthcareProvider/HpEditProfilePage";
import HpUpcomingAppointments from "../src/screens/HealthcareProvider/HpUpcomingAppointments";
import HpUpcomingAppointmentDetails from "../src/screens/HealthcareProvider/HpUpcomingAppointmentDetails";
import HpPastAppointments from "../src/screens/HealthcareProvider/HpPastAppointments";
import MedicalReportWriting from "../src/screens/HealthcareProvider/MedicalReportWriting";
import HpVAppManagementPage from "../src/screens/HealthcareProvider/HpVAppManagementPage";
import HpCreateOrEditVApp from "../src/screens/HealthcareProvider/HpCreateOrEditVApp";
import HpVUpcomingAppointments from "../src/screens/HealthcareProvider/HpVUpcomingAppointments";
import HpVUpcomingAppointmentDetails from "../src/screens/HealthcareProvider/HpVUpcomingAppointmentDetails";
import HpVPastAppointments from "../src/screens/HealthcareProvider/HpVPastAppointments";
import HpNotification from "../src/screens/HealthcareProvider/HpNotification";

// Community Organizer
import CommunityOrganizerMainPage from "../src/screens/CommunityOrganizers/CommunityOrganizerMainPage";
import CoProfilePage from "../src/screens/CommunityOrganizers/CoProfilePage";
import CoEditProfilePage from "../src/screens/CommunityOrganizers/CoEditProfilePage";
import CoSocialEventsManagement from "../src/screens/CommunityOrganizers/CoSocialEventsManagement";
import CoCreateNEditEvents from "../src/screens/CommunityOrganizers/CoCreateNEditEvents";
import CoSocialEventsDetails from "../src/screens/CommunityOrganizers/CoSocialEventsDetails";
import CoEventParticipants from "../src/screens/CommunityOrganizers/CoEventParticipants";
import CoVolunteerOpportunitiesManagement from "../src/screens/CommunityOrganizers/CoVolunteerOpportunitiesManagement";
import CoCreateNEditOpportunity from "../src/screens/CommunityOrganizers/CoCreateNEditOpportunity";
import CoOpportunityDetails from "../src/screens/CommunityOrganizers/CoOpportunityDetails";
import CoOpportunityParticipants from "../src/screens/CommunityOrganizers/CoOpportunityParticipants";
import CoElderlyCareAssessmentManagement from "../src/screens/CommunityOrganizers/CoElderlyCareAssessmentManagement";
import CoAddAssessmentScreen from "../src/screens/CommunityOrganizers/CoAddAssessmentScreen";
import CoCreateAssessmentQuestionScreen from "../src/screens/CommunityOrganizers/CoCreateAssessmentQuestionScreen";

import CoCreateChatRoom from "../src/screens/CommunityOrganizers/CoCreateChatRoom";
import ChatRoom from "../src/screens/CommunityOrganizers/ChatRoom";
import CoManageChatRoom from "../src/screens/CommunityOrganizers/CoManageChatRoom";

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
      <Stack.Screen
        name="HpUpcomingAppointments"
        component={HpUpcomingAppointments}
      />
      <Stack.Screen name="HistoryAppDetails" component={HistoryAppDetails} />
      <Stack.Screen
        name="HpUpcomingAppointmentDetails"
        component={HpUpcomingAppointmentDetails}
      />
      <Stack.Screen name="HpPastAppointments" component={HpPastAppointments} />
      <Stack.Screen
        name="MedicalReportWriting"
        component={MedicalReportWriting}
      />
      <Stack.Screen
        name="HpVAppManagementPage"
        component={HpVAppManagementPage}
      />
      <Stack.Screen name="HpCreateOrEditVApp" component={HpCreateOrEditVApp} />
      <Stack.Screen
        name="VirtualCategoryDoctors"
        component={VirtualCategoryDoctorsScreen}
      />
      <Stack.Screen
        name="VirtualBookingDetails"
        component={VirtualBookingDetails}
      />
      <Stack.Screen
        name="VirtualDoctorDetails"
        component={VirtualDoctorDetails}
      />
      <Stack.Screen
        name="VirtualConfirmation"
        component={VirtualConfirmationScreen}
      />
      <Stack.Screen
        name="VirtualDoctorProfileScreen"
        component={VirtualDoctorProfileScreen}
      />
      <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
      <Stack.Screen
        name="HpVUpcomingAppointments"
        component={HpVUpcomingAppointments}
      />
      <Stack.Screen
        name="HpVUpcomingAppointmentDetails"
        component={HpVUpcomingAppointmentDetails}
      />
      <Stack.Screen
        name="HpVPastAppointments"
        component={HpVPastAppointments}
      />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="MedicalReport" component={MedicalReport} />
      <Stack.Screen name="HpNotification" component={HpNotification} />
      <Stack.Screen name="AddReminder" component={AddReminder} />
      <Stack.Screen name="SocialEventsScreen" component={SocialEventsScreen} />
      <Stack.Screen
        name="VolunteerOpportunitiesScreen"
        component={VolunteerOpportunitiesScreen}
      />
      <Stack.Screen
        name="CollaborationScreen"
        component={FamilyCaregiverCollaboration}
      />
      <Stack.Screen
        name="SocialEventsManagementScreen"
        component={CoSocialEventsManagement}
      />
      <Stack.Screen
        name="CoCreateNEditEvents"
        component={CoCreateNEditEvents}
      />
      <Stack.Screen
        name="CoSocialEventsDetails"
        component={CoSocialEventsDetails}
      />
      <Stack.Screen
        name="CoEventParticipants"
        component={CoEventParticipants}
      />
      <Stack.Screen
        name="CoVolunteerOpportunitiesManagement"
        component={CoVolunteerOpportunitiesManagement}
      />
      <Stack.Screen
        name="CoCreateNEditOpportunity"
        component={CoCreateNEditOpportunity}
      />
      <Stack.Screen
        name="CoOpportunityDetails"
        component={CoOpportunityDetails}
      />
      <Stack.Screen
        name="CoOpportunityParticipants"
        component={CoOpportunityParticipants}
      />
      <Stack.Screen
        name="SocialEventsDetails"
        component={SocialEventsDetails}
      />
      <Stack.Screen
        name="VolunteerOpportunityDetails"
        component={VolunteerOpportunityDetails}
      />
      <Stack.Screen
        name="CoElderlyCareAssessmentManagement"
        component={CoElderlyCareAssessmentManagement}
      />
      <Stack.Screen
        name="AddAssessmentScreen"
        component={CoAddAssessmentScreen}
      />
      <Stack.Screen
        name="CreateAssessmentQuestionScreen"
        component={CoCreateAssessmentQuestionScreen}
      />
      <Stack.Screen name="TestAssessment" component={TestAssessment} />
      <Stack.Screen name="CarePlanScreen" component={CarePlanScreen} />
      <Stack.Screen name="EditCarePlan" component={EditCarePlanScreen} />
      <Stack.Screen
        name="AccessCollaborators"
        component={AccessCollaborators}
      />
      <Stack.Screen name="FamilyCollabScreen" component={FamilyCollabScreen} />
      <Stack.Screen
        name="CaregiverInformation"
        component={CaregiverInformation}
      />
      <Stack.Screen name="AddChatRoom" component={CoCreateChatRoom} />
      <Stack.Screen name="chatRoom" component={ChatRoom} />
      <Stack.Screen name="CoManageChatRoom" component={CoManageChatRoom} />
      <Stack.Screen name="ChatRoomElderly" component={ChatRoomElderly} />
      <Stack.Screen
        name="ManageChatRoomElderly"
        component={ManageChatRoomElderly}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
