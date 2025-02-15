const pool = require("../config/db");
const crypto = require("crypto-js"); // Import AES library

const AES_SECRET_KEY = process.env.AES_SECRET_KEY; // Ensure you have a secret key in your environment variables

const encryptIdentityCard = (identityCard) => {
  return crypto.AES.encrypt(identityCard, AES_SECRET_KEY).toString();
};

const decryptIdentityCard = (encryptedIdentityCard) => {
  return crypto.AES.decrypt(encryptedIdentityCard, AES_SECRET_KEY).toString(
    crypto.enc.Utf8
  );
};

const findUserByPhoneNo = async (phoneNo) => {
  try {
    const result = await pool.query("SELECT * FROM users WHERE phone_no = $1", [
      phoneNo,
    ]);
    if (result.rows.length > 0) {
      // Decrypt the identity card before returning the user
      const user = result.rows[0];
      user.identity_card = decryptIdentityCard(user.identity_card);
      return user;
    }
    return null;
  } catch (err) {
    console.error("Error executing query:", err.stack);
    throw err; // Re-throw the error so it can be handled by the caller
  }
};

// Function to create or update a user
const createUser = async (userData) => {
  const { identity_card, ...rest } = userData;
  const encryptedIdentityCard = encryptIdentityCard(identity_card);

  const query = "INSERT INTO users (identity_card, ...) VALUES ($1, ...)";
  await pool.query(query, [encryptedIdentityCard, ...rest]);
};

module.exports = {
  findUserByPhoneNo,
  createUser,
  encryptIdentityCard,
  decryptIdentityCard,
};
