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
    fontSize: 20, // Increase the font size
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
//   title: {
//     fontSize: 32, // Larger font size for readability
//     color: '#000000',
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 450,
//   },
  // TextInput style for LoginPage
  // input: {
  //   height: 50,
  //   width: '90%', // Make inputs wider
  //   borderColor: '#ddd',
  //   borderWidth: 1,
  //   borderRadius: 5,
  //   marginBottom: 20,
  //   paddingHorizontal: 15,
  //   fontSize: 18, // Larger text for input
  //   backgroundColor: '#fff',
  // },
  // // Button style for LoginPage
  // button: {
  //   backgroundColor: '#ff8b49',
  //   // backgroundColor: '#f9a825',
  //   padding: 15,
  //   borderRadius: 5,
  //   alignItems: 'center',
  //   width: '90%', // Make the button as wide as the input fields
  //   marginBottom: 20,
  // },
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
});
