// models/userModel.js
const pool = require("../config/db");

// const findUserByIC = async (icNumber) => {
//   // console.log(icNumber)
//   // const result = await pool.query('SELECT * FROM users WHERE ic_number = $1', [icNumber]);
//   const result = await pool.query('SELECT NOW()');

//   console.log(result)
//   return result.rows[0];
// };
const findUserByIC = async (icNumber) => {
  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE identity_card = $1",
      [icNumber]
    );
    return result.rows[0];
  } catch (err) {
    console.error("Error executing query:", err.stack);
    throw err; // Re-throw the error so it can be handled by the caller
  }
};

module.exports = {
  findUserByIC,
};
