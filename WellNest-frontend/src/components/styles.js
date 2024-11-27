//styles.js
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  // Shared background style for pages
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "flex-start",
    width: "100%",
    height: "100%",
    // height: 200,
  },
  // Shared container style
  titleContainer: {
    justifyContent: "flex-start", // Change from 'center' to 'flex-start'
    padding: 20,
    marginTop: 135, // Add some space between the top of the screen and the title
  },
  firstContainer: {
    justifyContent: "flex-start", // Change from 'center' to 'flex-start'
    padding: 20,
    marginTop: 180,
  },
  // Shared container style
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  // Style for the logo
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  // Title text used on both pages
  titleFirstLine: {
    fontSize: 30, // Smaller font size for the first line
    color: "#000000",
    fontWeight: "bold",
    textAlign: "right",
    alignSelf: "flex-end", // Align to the right
    marginBottom: 0, // Remove bottom margin for tighter space
    marginRight: 30, // Adjust the horizontal position, move left by increasing value
  },
  titleSecondLine: {
    fontSize: 65, // Larger font size for the second line
    color: "#000000",
    fontWeight: "bold",
    alignSelf: "flex-end", // Align to the right
    marginBottom: 0,
    marginRight: 30, // Same adjustment for horizontal position, move left
  },
  // Enlarged subtitle
  subtitle: {
    fontSize: 22, // Increase the font size
    color: "#000000",
    textAlign: "center",
    marginTop: -30,
    marginBottom: 60, // Add space below the subtitle
  },
  // Input container with icons
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 25,
    paddingHorizontal: 10,
    width: "90%",
  },
  icon: {
    marginRight: 10,
    marginLeft: 10,
  },
  // hpicon: {
  //   marginRight: 10,
  // },
  // Title text used on both pages
  title: {
    fontSize: 30, // Larger font size for readability
    color: "#000000",
    fontWeight: "bold",
    textAlign: "center",
    //marginTop: 100,
    // marginBottom: 100,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 18,
    color: "#000",
    borderRadius: 15, // Increase border radius for a rounder effect
    overflow: "hidden", // Ensure corners are clipped properly
  },
  // Login button
  button: {
    backgroundColor: "#ff8b49",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    width: "90%",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5, // Add hover effect on Android
  },
  buttonText: {
    color: "#fff",
    fontSize: 20, // Larger button text
  },
  // Register text with orange link
  registerText: {
    fontSize: 18,
    color: "#000",
    textAlign: "center",
    marginTop: 10,
  },
  registerLink: {
    color: "#ff8b49",
    fontWeight: "bold",
  },
  forgotPassword: {
    color: "#007BFF", // Blue for "Forgot password?"
    textAlign: "left",
    width: "90%",
    marginBottom: 40,
    fontSize: 16,
  },
  // Footer image style
  footerImage: {
    width: "100%",
    height: 100,
    position: "absolute",
    bottom: 0,
  },
  smallHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white", // White rectangle background
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Android shadow
    alignSelf: "center", // Center the rectangle
    width: "100%", // Adjust the width to fit the screen better
    justifyContent: "center",
    height: 70, // Define the height of the rectangle
    //position: 'absolute', // Use absolute positioning
    top: 60, // Position the rectangle from the top
    left: 0, // Position the rectangle from the left
    right: 0, // Position the rectangle from the right
    zIndex: 1, // Ensure the rectangle is on top of other components
    marginBottom: 40,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white", // White rectangle background
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Android shadow
    alignSelf: "center", // Center the rectangle
    width: "100%", // Adjust the width to fit the screen better
    justifyContent: "center",
    height: 80, // Define the height of the rectangle
    //position: 'absolute', // Use absolute positioning
    top: 80, // Position the rectangle from the top
    left: 0, // Position the rectangle from the left
    right: 0, // Position the rectangle from the right
    zIndex: 1, // Ensure the rectangle is on top of other components
    marginBottom: 130,
  },
  backButton: {
    position: "absolute",
    left: 10, // Ensure the back button stays at the left
  },
  instructions: {
    fontSize: 19,
    color: "#666",
    marginTop: -40,
    marginBottom: 30,
  },
  resendContainer: {
    flexDirection: "column",
    marginBottom: 20,
    alignItems: "flex-start",
  },
  resendText: {
    color: "#888",
    textAlign: "left",
  },
  resendLink: {
    color: "#f60",
    fontWeight: "bold",
    textAlign: "left", // Ensure text is aligned to the left
    marginTop: 5, // Add some space between the two texts
  },
  selectedRole: {
    fontSize: 16,
    color: "green",
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 5,
  },
  role: {
    fontSize: 16,
    color: "#007bff",
    textAlign: "center",
    marginVertical: 5,
  },
  uploadButtonText: {
    color: "white",
    fontSize: 16,
  },
  uploadButton: {
    backgroundColor: "#007bff",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    flexDirection: "row", // Align items in a row (horizontally)
    justifyContent: "center", // Center items horizontally
  },
  uploadPrecautions: {
    color: "#808080", // Same gray color
    fontSize: 15, // Keep it the same smaller font size
    marginTop: -5, // Provide enough space under the upload button
    marginBottom: 12, // More space before the next component
  },
  smallInput: {
    backgroundColor: "white",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  scrollView: {
    flexGrow: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // flexDirection: 'column', // Use column direction
    // justifyContent: 'flex-start', // Start from the top
    // alignItems: 'stretch', // Allow children to stretch to full width
  },
  question: {
    fontSize: 23,
    fontWeight: "bold",
    // marginTop: 20,
    textAlign: "left", // Align the "Role" text to the left
    width: "100%", // Ensure full width
    marginLeft: 35,
  },
  roleContainer: {
    flexDirection: "row",
    justifyContent: "space-between", // Spacing roles evenly
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
  },
  radioButtonContainer: {
    flexDirection: "row", // Align items in a row
    alignItems: "center", // Center vertically
    justifyContent: "flex-start", // Align items to the left
    width: "100%", // Full width to align with the ScrollView
  },
  radioButtonLabel: {
    marginLeft: 8, // Space between radio button and label
    textAlign: "left", // Ensure label is left-aligned
  },
  safeAreaContainer: {
    flex: 1,
    justifyContent: "center", // Align content vertically to the center
    alignItems: "center", // Align content horizontally to the center
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  precautions: {
    color: "#808080", // Gray color (adjust to make it lighter or darker as needed)
    fontSize: 15, // Smaller font size for precaution text
    marginTop: -18, // Less space with the input field above
    marginBottom: 12, // More space with the component below
  },
  singleUnderline: {
    height: 2, // Height of the underline
    backgroundColor: "#D3D3D3", // Color of the underline
    width: "90%", // Width of the underline
    alignSelf: "center", // Center the underline horizontally
    marginBottom: -10,
    // marginVertical: 10, // Margin above and below
  },
  underline: {
    height: 2, // Height of the underline
    backgroundColor: "#D3D3D3", // Color of the underline
    width: "90%", // Width of the underline
    alignSelf: "center", // Center the underline horizontally
    // marginBottom: -10,
    marginVertical: 10, // Margin above and below
  },
  radioButtonColor: {
    color: "#FFA500", // Orange color for the selected radio button
  },
  radioLabel: {
    fontSize: 20, // Set the font size for radio button labels
  },
  backgroundImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  // Shared container style
  pageContainer: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    // padding: 20,
  },
  greeting: {
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 70,
    textAlign: "left",
    marginLeft: 30,
  },
  medicineReminderContainer: {
    padding: 15,
    alignItems: "center",
  },
  reminderText: {
    fontSize: 16,
    color: "#ff8c00",
    textAlign: "left",
    marginBottom: 10,
  },
  medicineCard: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  medicineImage: {
    width: 50,
    height: 50,
  },
  medicineName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  medicineTime: {
    color: "gray",
  },
  doneButton: {
    backgroundColor: "#ff8c00",
    padding: 10,
    borderRadius: 10,
  },
  doneButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  defaultImage: {
    width: 165,
    height: 165,
    resizeMode: "contain",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 15,
  },
  moduleRow: {
    flexDirection: "row",
    // justifyContent: 'space-around',
    justifyContent: "space-between", // Ensure icons are spaced apart
    marginBottom: 20,
  },
  // icon: {
  //   width: 50,
  //   height: 50,
  //   marginLeft: 7,
  // },
  iconContainer: {
    alignItems: "center",
    marginHorizontal: 20, // Increased space between each icon
  },
  iconText: {
    textAlign: "center",
    marginTop: 5,
    fontSize: 14,
    marginLeft: -10,
    // letterSpacing: 1.5,
  },
  // Navigation bar styles
  navigationBar: {
    // flexDirection: 'row',
    // justifyContent: 'space-around',
    // paddingVertical: 10,
    // // backgroundColor: '#f5f5f5',
    // backgroundColor: 'white',
    // borderTopWidth: 1,
    // borderTopColor: '#ddd',
    flexDirection: "row",
    backgroundColor: "#e5f5ff",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  tabButton: {
    // alignItems: 'center',
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  navText: {
    // fontSize: 12,
    // // color: 'gray',
    // // textAlign: 'center',
    // marginTop: 4,
    fontSize: 12,
    color: "#000000",
    marginTop: 3,
  },
  activeNavItem: {
    borderTopWidth: 2,
    borderTopColor: "orange",
  },
  // MainPage styles
  sectionContainer: {
    backgroundColor: "white", // Set the background color to white
    padding: 10, // Add padding to the container
    borderRadius: 20, // Optional: for rounded corners
    marginBottom: 25, // Space between sections
    marginRight: 15,
    marginLeft: 15,
  },
  searchContainer: {
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#fff",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 50,
    marginHorizontal: 5,
    // borderWidth: 1,
    // borderColor: '#ccc',
    // borderRadius: 10,
    // padding: 10,
    // marginBottom: 10,
  },
  filterButtonContainer: {
    // borderWidth: 1,
    // borderColor: '#ccc',
    // paddingVertical: 10,
    // paddingHorizontal: 20,
    // borderRadius: 10,
    // marginHorizontal: 10,
    flexDirection: "row",
    // justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: 10,
  },
  specialtyContainer: {
    flexGrow: 1,
  },
  specialtyButton: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginVertical: 5,
    backgroundColor: "#fff",
  },
  specialtyText: {
    fontSize: 16,
    textAlign: "center",
  },
  appointmentContainer: {
    flex: 1,
    // padding: 20,
    marginTop: 75,
    padding: 10,
  },
  // Enlarged subtitle
  smallTitle: {
    fontSize: 16, // Increase the font size
    color: "#000000",
    textAlign: "center",
    marginTop: -50,
    marginBottom: 5,
  },
  searchRow: {
    flexDirection: "row", // Places input and button in the same row
    alignItems: "center", // Vertically centers them
  },
  searchButton: {
    backgroundColor: "#FFA500", // Orange color
    padding: 10,
    borderRadius: 10, // Ensure the button has a consistent shape
    justifyContent: "center", // Center content inside the button
    alignItems: "center",
    marginLeft: 10, // Adds spacing between input and button
    height: 50, // Ensures the button is square
    width: 50,
  },
  dateInput: {
    // backgroundColor: '#fff',
    flex: 1,
    backgroundColor: "#fff",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 50,
    marginHorizontal: 5,
    justifyContent: "center", // Center content inside the button
    alignItems: "center",
  },
  // Input field with space for the icon
  searchInputWithIcon: {
    flex: 1,
    backgroundColor: "#fff",
    borderColor: "#ddd",
    paddingHorizontal: 10,
    paddingVertical: 8,
    height: 50,
  },
  smallInputContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#fff",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  // Icon styling
  iconStyle: {
    marginRight: 10, // Add some space between the icon and the input
    paddingHorizontal: 5,
    paddingVertical: 14,
  },
  filterButton: {
    padding: 10,
    borderRadius: 30,
    backgroundColor: "#ff8b49",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    width: "50%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5, // Add hover effect on Android
  },
  filterButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 1,
  },
  activeFilter: {
    backgroundColor: "#FFA500", // Orange background for inactive button
    borderColor: "#FFA500",
  },
  inactiveFilter: {
    backgroundColor: "#ddd", // Gray background for active button
    borderColor: "#000",
  },
  filterButtonText: {
    fontSize: 17,
  },
  activeFilterText: {
    color: "#fff", // White text for inactive button
    fontWeight: "bold",
  },
  inactiveFilterText: {
    color: "#000", // Black text for active button
  },
  specialtyContainer: {
    marginVertical: 20,
  },
  dateInputContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1, // Allows the content to take full width
  },
  categoriesTitle: {
    fontSize: 22, // Increase the font size
    color: "#000000",
    textAlign: "center",
    fontWeight: "bold",
    marginTop: 10,
    // marginBottom: 5,
  },
  noBgSmallHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Android shadow
    alignSelf: "center", // Center the rectangle
    width: "100%", // Adjust the width to fit the screen better
    justifyContent: "center",
    height: 70, // Define the height of the rectangle
    //position: 'absolute', // Use absolute positioning
    top: 60, // Position the rectangle from the top
    left: 0, // Position the rectangle from the left
    right: 0, // Position the rectangle from the right
    zIndex: 1, // Ensure the rectangle is on top of other components
    marginBottom: 45,
  },
  prescriptionContainer: {
    flex: 1,
    // padding: 20,
    marginTop: 30,
  },
  noPrescriptionContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  noPrescriptionText: {
    fontSize: 16,
    color: "#000",
    marginBottom: 10,
  },
  noPrescriptionImage: {
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
  //ProfilePage
  profileContainer: {
    marginTop: 5,
    alignItems: "center",
    paddingVertical: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#fff",
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 5,
  },
  editProfileButton: {
    backgroundColor: "#333",
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 5,
    marginTop: 10,
  },
  editProfileText: {
    color: "#fff",
    fontSize: 14,
  },
  healthBookingStatus: {
    marginBottom: 20,
  },
  // sectionTitle: {
  //   fontSize: 18,
  //   fontWeight: "bold",
  //   marginBottom: 10,
  // },
  statusOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statusCard: {
    alignItems: "center",
    width: "30%",
  },
  statusIcon: {
    width: 50,
    height: 50,
    marginBottom: 5,
  },
  statusText: {
    textAlign: "center",
    fontSize: 12,
  },
  otherOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    backgroundColor: "white", // Set the background color to white
    padding: 10, // Add padding to the container
    borderRadius: 20, // Optional: for rounded corners
    marginBottom: 25, // Space between sections
    marginRight: 15,
    marginLeft: 15,
  },
  optionCard: {
    alignItems: "center",
    width: "30%",
    marginBottom: 20,
  },
  optionIcon: {
    width: 50,
    height: 50,
    marginBottom: 5,
  },
  optionText: {
    textAlign: "center",
    fontSize: 12,
  },
  accountSettings: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  accountSettingsText: {
    fontSize: 16,
  },
  // SettingPage
  settingsContainer: {
    backgroundColor: "#fff",
    // paddingHorizontal: 20,
    // paddingVertical: 10,
    marginTop: 10,
  },
  smallSectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    // marginBottom: 10,
    backgroundColor: "#f0f0f0", // Light gray background
    // paddingVertical: 8,
    // paddingHorizontal: 10,
    // borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 20, // Add padding here instead
  },
  optionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingHorizontal: 20, // Add padding here for options
  },
  optionText: {
    fontSize: 20,
    color: "#333",
    fontWeight: "bold",
  },
  signOutButton: {
    backgroundColor: "#f5a623",
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
    margin: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5, // Add hover effect on Android
  },
  signOutButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  //ProfileEditPage
  cancelButton: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    width: "90%",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5, // Add hover effect on Android
  },
  cancelButtonText: {
    color: "#333",
    fontSize: 20, // Larger button text
  },
  leftDateInput: {
    // flex: 1,
    backgroundColor: "#fff",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 50,
    marginHorizontal: 5,
    justifyContent: "center", // Center content inside the button
    // alignItems: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#ddd",
    width: "81%",
    marginLeft: 35,
  },
  genderRadioButtonContainer: {
    flexDirection: "row", // Align items in a row
    alignItems: "center", // Center vertically
    justifyContent: "flex-start", // Align items to the left
    width: "100%", // Full width to align with the ScrollView
    marginLeft: 30,
  },
  radioButtonLabel: {
    marginLeft: 8, // Space between radio button and label
    textAlign: "left", // Ensure label is left-aligned
  },
  testuploadButton: {
    backgroundColor: "#007bff",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    flexDirection: "row", // Align items in a row (horizontally)
    justifyContent: "center", // Center items horizontally
    marginTop: 150,
  },
  invalidInput: {
    borderColor: "red",
    borderWidth: 1,
  },
  //HpMainPage
  hPTitle: {
    fontSize: 27, // Larger font size for the second line
    color: "#000000",
    padding: 30,
    marginBottom: 40,
    marginRight: 30, // Same adjustment for horizontal position, move left
  },
  //HpAppointmentManagementPage
  hPGreeting: {
    fontSize: 40,
    fontWeight: "bold",
    marginTop: 80,
    textAlign: "left",
    marginLeft: 30,
  },
  hPModuleRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    // justifyContent: "space-between", // Ensure icons are spaced apart
    marginBottom: 20,
  },
  // Title text used on both pages
  hpTitle: {
    fontSize: 25, // Larger font size for readability
    color: "#000000",
    fontWeight: "bold",
    textAlign: "center",
    //marginTop: 100,
    // marginBottom: 100,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  hpButton: {
    width: "80%",
    backgroundColor: "white",
    paddingVertical: 30,
    borderRadius: 10,
    marginVertical: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
  },
  hpButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  // AppointmentCreationPage
  hpContainer: {
    flexGrow: 1,
    backgroundColor: "#D3D3D3",
    padding: 20,
  },
  formContainer: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  hpInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
  },
  hpradioButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: -8,
  },
  hpradioLabel: {
    fontSize: 16,
    // fontWeight: "bold",
  },
  timeInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
  },
  addTimeText: {
    color: "#FFA500",
    fontWeight: "bold",
    marginTop: 10,
  },
  doneButton: {
    backgroundColor: "#FFA500",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 20,
    marginTop: 70,
  },
  doneButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#FF0000", // Red color for delete button
    // padding: 10,
    // borderRadius: 5,
    marginTop: 10,
    // alignItems: "center",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 20,
  },
  deleteButtonText: {
    color: "#FFFFFF", // White text color
    fontSize: 16,
    fontWeight: "bold",
  },
  timeSlotContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 5,
    paddingRight: 10,
  },
  dateTimePickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginVertical: 10,
  },
  confirmButton: {
    backgroundColor: "#FFA500",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 10,
  },
  confirmButtonText: {
    color: "#FFF",
    fontSize: 16,
  },
  //HpMyCreatedAppointments.js
  list: {
    paddingBottom: 16,
  },
  hpAppointmentContainer: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  appointmentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  createdByText: {
    fontWeight: "bold",
  },
  appointmentDate: {
    fontSize: 16,
    color: "green",
    // marginBottom: 16,
  },
  hpAbuttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  hpAbutton: {
    backgroundColor: "#FF8C00",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  hpAbuttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  hpAcontainer: {
    flex: 1,
    backgroundColor: "#D3D3D3",
    padding: 16,
  },
  category: {
    fontSize: 14,
    color: "#777",
    // marginVertical: 5,
    marginBottom: 16,
  },
  //changePassword
  changePwdContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    marginTop: -140,
    alignItems: "center",
    paddingVertical: 10,
  },
  buttonContainer: {
    marginTop: -160, // Space above buttons
    marginBottom: 70,
    alignItems: "center", // Center buttons
    justifyContent: "space-between", // Adjust spacing between buttons if needed
  },
  //AppointmentPage
  doctorCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  doctorImage: {
    width: 75,
    height: 75,
    borderRadius: 35,
    marginRight: 15,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 2,
  },
  doctorCategory: {
    fontSize: 14,
    color: "#777",
    // marginVertical: 5,
  },
  doctorRating: {
    fontSize: 14,
    color: "#f39c12",
    // marginVertical: 5,
    marginTop: 5,
  },
  activeCategory: {
    backgroundColor: "#007BFF",
    borderColor: "#0056b3",
  },
  noDataText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginTop: 20,
  },
  favoriteIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
  },
  //AppointmentDoctorDetails.js
  transDoctorCard: {
    flexDirection: "row",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: -25,
  },
  uAcontainer: {
    // flexGrow: 1,
    padding: 16,
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 3,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    marginBottom: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: "#333",
    // fontWeight: "bold",
  },
  profileButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
    marginVertical: 10,
    margin: 70,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5, // Add hover effect on Android
  },
  profileButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17,
  },
  aSectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#333",
  },
  sectionContent: {
    fontSize: 16,
    color: "#000000",
    marginBottom: 10,
  },
  datePickerButton: {
    backgroundColor: "#E0E0E0",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  datePickerText: {
    fontSize: 14,
    color: "#333",
  },
  timeSlot: {
    padding: 10,
    margin: 5,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
  },
  selectedTimeSlot: {
    backgroundColor: "#4CAF50",
  },
  bookButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  fixedDoctorCard: {
    position: "absolute",
    top: 120,
    left: 0,
    right: 0,
    zIndex: 1,
    // backgroundColor: "white", // or any color that fits your design
    padding: 16,
  },
  scrollableContent: {
    marginTop: 150, // Adjust based on the height of your fixed card
    // flex: 1,
  },
  displayUnderline: {
    height: 2, // Height of the underline
    backgroundColor: "#D3D3D3", // Color of the underline
    width: "100%", // Width of the underline
    alignSelf: "center", // Center the underline horizontally
    marginBottom: 10,
    marginTop: -5,
    // marginVertical: 0, // Margin above and below
  },
  whiteBackground: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
  },
  uAContainer: {
    // marginTop: -25,
    padding: 16,
    // backgroundColor: "#ffffff",
  },
});
