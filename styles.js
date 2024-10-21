//styles.js
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  // Shared background style for pages
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'flex-start',
  },
  // Shared container style
  titleContainer: {
    justifyContent: 'flex-start', // Change from 'center' to 'flex-start'
    padding: 20,
    marginTop: 135, // Add some space between the top of the screen and the title
  },
  firstContainer: {
    justifyContent: 'flex-start', // Change from 'center' to 'flex-start'
    padding: 20,
    marginTop: 180, 
  },
  // Shared container style
  container: {
    alignItems: 'center',
    justifyContent: 'center',
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
    color: '#000000',
    fontWeight: 'bold',
    textAlign: 'right',
    alignSelf: 'flex-end',  // Align to the right
    marginBottom: 0,  // Remove bottom margin for tighter space
    marginRight: 30, // Adjust the horizontal position, move left by increasing value
  },
  titleSecondLine: {
    fontSize: 65, // Larger font size for the second line
    color: '#000000',
    fontWeight: 'bold',
    alignSelf: 'flex-end',  // Align to the right
    marginBottom: 0,
    marginRight: 30, // Same adjustment for horizontal position, move left
  },
  // Enlarged subtitle
  subtitle: {
    fontSize: 22, // Increase the font size
    color: '#000000',
    textAlign: 'center',
    marginTop: -30,
    marginBottom: 60, // Add space below the subtitle
  },
  // Input container with icons
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: '90%',
  },
  icon: {
    marginRight: 10,
  },
  // Title text used on both pages
  title: {
    fontSize: 32, // Larger font size for readability
    color: '#000000',
    fontWeight: 'bold',
    textAlign: 'center',
    //marginTop: 100,
   // marginBottom: 100,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 18,
    color: '#000',
    borderRadius: 15, // Increase border radius for a rounder effect
    overflow: 'hidden', // Ensure corners are clipped properly
  },
  // Login button
  button: {
    backgroundColor: '#ff8b49',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    width: '90%',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5, // Add hover effect on Android
  },
  buttonText: {
    color: '#fff',
    fontSize: 20, // Larger button text
  },
  // Register text with orange link
  registerText: {
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
    marginTop: 10,
  },
  registerLink: {
    color: '#ff8b49',
    fontWeight: 'bold',
  },
  forgotPassword: {
    color: '#007BFF', // Blue for "Forgot password?"
    textAlign: 'left',
    width: '90%',
    marginBottom: 40,
    fontSize: 16,
  },
  // Footer image style
  footerImage: {
    width: '100%',
    height: 100,
    position: 'absolute',
    bottom: 0,
  },
  smallHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white', // White rectangle background
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Android shadow
    alignSelf: 'center', // Center the rectangle
    width: '100%', // Adjust the width to fit the screen better
    justifyContent: 'center',
    height: 70, // Define the height of the rectangle
    //position: 'absolute', // Use absolute positioning
    top: 80, // Position the rectangle from the top
    left: 0, // Position the rectangle from the left
    right: 0, // Position the rectangle from the right
    zIndex: 1, // Ensure the rectangle is on top of other components
   marginBottom: 40,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white', // White rectangle background
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Android shadow
    alignSelf: 'center', // Center the rectangle
    width: '100%', // Adjust the width to fit the screen better
    justifyContent: 'center',
    height: 80, // Define the height of the rectangle
    //position: 'absolute', // Use absolute positioning
    top: 80, // Position the rectangle from the top
    left: 0, // Position the rectangle from the left
    right: 0, // Position the rectangle from the right
    zIndex: 1, // Ensure the rectangle is on top of other components
   marginBottom: 130,
  },
  backButton: {
    position: 'absolute',
    left: 10,  // Ensure the back button stays at the left
  },
  instructions: {
    fontSize: 19,
    color: '#666',
    marginTop: -40,
    marginBottom: 30,
  },
  icon: {
    marginRight: 10,
  },
  resendContainer: {
    flexDirection: 'column',
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  resendText: {
    color: '#888',
    textAlign: 'left',
  },
  resendLink: {
    color: '#f60',
    fontWeight: 'bold',
    textAlign: 'left', // Ensure text is aligned to the left
    marginTop: 5, // Add some space between the two texts
  },
  selectedRole: {
    fontSize: 16,
    color: 'green',
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 5,
  },
  role: {
    fontSize: 16,
    color: '#007bff',
    textAlign: 'center',
    marginVertical: 5,
  },
  uploadButtonText: {
    color: 'white',
    fontSize: 16,
  },
  uploadButton: {
    backgroundColor: '#007bff',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    flexDirection: 'row', // Align items in a row (horizontally)
  justifyContent: 'center', // Center items horizontally
  },
  uploadPrecautions: {
    color: '#808080',  // Same gray color
    fontSize: 15,  // Keep it the same smaller font size
    marginTop: -5,  // Provide enough space under the upload button
    marginBottom: 12,  // More space before the next component
  },  
  smallInput: {
    backgroundColor: 'white',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
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
    fontWeight: 'bold',
    // marginTop: 20,
    textAlign: 'left',  // Align the "Role" text to the left
    width: '100%',  // Ensure full width
    marginLeft: 25,
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Spacing roles evenly
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  // radioButtonContainer: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   // alignItems: 'flex-start',  // Align items to the left
  //   justifyContent: 'flex-start', // Make sure it's aligned to the left
  //   marginBottom: 10,
  //   width: '100%',  // Take full width
  //   // paddingHorizontal: 10, // Add horizontal padding for spacing
  //   flexDirection: 'column', // Use column direction
  //   justifyContent: 'flex-start', // Start from the top
  //   alignItems: 'stretch', // Allow children to stretch to full width
  // },
  radioButtonContainer: {
    flexDirection: 'row', // Align items in a row
    alignItems: 'center', // Center vertically
    justifyContent: 'flex-start', // Align items to the left
    width: '100%', // Full width to align with the ScrollView
  },
  radioButtonLabel: {
    marginLeft: 8, // Space between radio button and label
    textAlign: 'left', // Ensure label is left-aligned
  },
  safeAreaContainer: {
    flex: 1,
    justifyContent: 'center', // Align content vertically to the center
    alignItems: 'center',     // Align content horizontally to the center
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  precautions: {
    color: '#808080', // Gray color (adjust to make it lighter or darker as needed)
    fontSize: 15, // Smaller font size for precaution text
    marginTop: -18, // Less space with the input field above
    marginBottom: 12, // More space with the component below
  },
  underline: {
    height: 2, // Height of the underline
    backgroundColor: '#D3D3D3', // Color of the underline
    width: '90%', // Width of the underline
    alignSelf: 'center', // Center the underline horizontally
    marginVertical: 10, // Margin above and below
  },
  radioButtonColor: {
    color: '#FFA500',  // Orange color for the selected radio button
  },
  radioLabel: {
    fontSize: 20, // Set the font size for radio button labels
  },

});
