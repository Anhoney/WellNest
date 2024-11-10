// validationUtils.js
import { StyleSheet } from "react-native";

export const validateFields = (fields) => {
  const errors = {};
  let allFieldsEmpty = true;

  // Loop through each field and check if it's empty
  for (const [key, value] of Object.entries(fields)) {
    if (!value.trim()) {
      errors[key] = true; // Mark field as invalid if empty
    } else {
      allFieldsEmpty = false; // If any field has content, it's not all empty
    }
  }
  // Set allFieldsEmpty flag only if all fields are indeed empty
  if (allFieldsEmpty) {
    errors.allFieldsEmpty = true;
  }

  return errors;
};

// Style function to turn the input red if it's invalid
export const getInputStyle = (isValid) => {
  return isValid ? styles.input : [styles.input, styles.invalidInput];
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#000",
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  invalidInput: {
    borderColor: "red",
  },
});
