// // frontend/services/authService.js
// import AsyncStorage from "@react-native-async-storage/async-storage";

// // Store the token after login
// export const storeToken = async (token) => {
//   try {
//     await AsyncStorage.setItem("token", token);
//   } catch (error) {
//     console.error("Error storing token:", error);
//   }
// };

// // Retrieve the token for automatic login
// export const getToken = async () => {
//   try {
//     const token = await AsyncStorage.getItem("authToken");
//     return token;
//   } catch (error) {
//     console.error("Error retrieving token:", error);
//     return null;
//   }
// };

// // Clear the token on logout
// export const clearToken = async () => {
//   try {
//     await AsyncStorage.removeItem("authToken");
//   } catch (error) {
//     console.error("Error clearing token:", error);
//   }
// };
// frontend/services/authService.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";

// /**
//  * Store the authentication token.
//  * @param {string} token - JWT token to store.
//  */
// Store the token after login
export const storeToken = async (token) => {
  try {
    await AsyncStorage.setItem("authToken", token);
  } catch (error) {
    console.error("Error storing token:", error);
  }
};

// /**
//  * Retrieve the stored authentication token.
//  * @returns {Promise<string|null>} The stored token, or null if not found.
//  */
// Retrieve the token for automatic login
export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    return token;
  } catch (error) {
    console.error("Error retrieving token:", error);
    return null;
  }
};

/**
 * Clear the stored authentication token.
 */
// Clear the token on logout
export const clearToken = async () => {
  try {
    await AsyncStorage.removeItem("authToken");
  } catch (error) {
    console.error("Error clearing token:", error);
  }
};

// /**
//  * Extract the user ID from the stored JWT token.
//  * @returns {Promise<string|null>} The user ID, or null if not found or token is invalid.
//  */
export const getUserIdFromToken = async () => {
  try {
    const token = await getToken();
    if (token) {
      const decodedToken = jwt_decode(token);
      return decodedToken.id; // Adjust the key based on the actual token payload
    }
    return null;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};
