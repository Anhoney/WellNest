import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  // Shared background style for pages
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  // Shared container style
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start', // Change from 'center' to 'flex-start'
    //justifyContent: 'center',
    padding: 20,
    marginBottom: 400, // Add some space between the top of the screen and the title
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
    fontSize: 40, // Smaller font size for the first line
    color: '#000000',
    fontWeight: 'bold',
    textAlign: 'right',
    marginBottom: 5, // Add some space between the two lines
  },
  titleSecondLine: {
    fontSize: 65, // Larger font size for the second line
    color: '#000000',
    fontWeight: 'bold',
    textAlign: 'right',
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
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 15,
    fontSize: 18, // Larger text for input
    backgroundColor: '#fff',
  },
  // Button style for LoginPage
  button: {
    backgroundColor: '#ff8b49',
    // backgroundColor: '#f9a825',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20, // Larger button text
  },
  // Registration link text
  registerText: {
    fontSize: 18,
    color: '#007BFF',
    textAlign: 'center',
  },
  // Footer image style
  footerImage: {
    width: '100%',
    height: 100,
    position: 'absolute',
    bottom: 0,
  },
});
