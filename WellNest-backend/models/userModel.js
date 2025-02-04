// models/userModel.js
const pool = require("../config/db");

// const findUserByPhoneNo = async (phoneNo) => {
//   // console.log(phoneNo)
//   // const result = await pool.query('SELECT * FROM users WHERE ic_number = $1', [phoneNo]);
//   const result = await pool.query('SELECT NOW()');

//   console.log(result)
//   return result.rows[0];
// };
const findUserByPhoneNo = async (phoneNo) => {
  try {
    const result = await pool.query("SELECT * FROM users WHERE phone_no = $1", [
      phoneNo,
    ]);
    return result.rows[0];
  } catch (err) {
    console.error("Error executing query:", err.stack);
    throw err; // Re-throw the error so it can be handled by the caller
  }
};

// const updateProfileImage = async (userId, profileImage) => {
//   const query = "UPDATE users SET profile_image = $1 WHERE id = $2";
//   await pool.query(query, [profileImage, userId]);
// };

module.exports = {
  findUserByPhoneNo,
  // updateProfileImage,
};
