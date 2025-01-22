// usersController.js
const pool = require("../config/db");

const getAllUsers = async (req, res) => {
  const query = `
    SELECT 
        id,
        full_name,
        phone_no,
        email,
        profile_image
    FROM 
        users
    ORDER BY 
        id;
    `;
  try {
    const result = await pool.query(query);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Users not found." });
    }
    res.status(200).json(result.rows); // Return the first row of the result
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ error: "Failed to fetch users." });
  }
};

module.exports = {
  getAllUsers,
};
// const twilio = require("twilio"); // Assuming you're using Twilio for SMS
// const crypto = require("crypto");

// const twilioClient = twilio(
//   process.env.TWILIO_ACCOUNT_SID,
//   process.env.TWILIO_AUTH_TOKEN
// );

// // Function to send OTP
// const sendOtp = async (req, res) => {
//   const { phoneNo } = req.body;

//   // Generate a random OTP
//   const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP

//   // Set expiration time to 10 minutes from now
//   const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

//   // Store OTP in the database or in-memory store with an expiration time
//   await pool.query(
//     "UPDATE users SET otp = $1, otp_expiry = $2 WHERE phone_no = $3",
//     [otp, otpExpiry, phoneNo]
//   );

//   // Send OTP via SMS
//   try {
//     await twilioClient.messages.create({
//       body: `Your OTP is ${otp}`,
//       from: process.env.TWILIO_PHONE_NUMBER,
//       to: phoneNo,
//     });
//     res.status(200).json({ message: "OTP sent successfully" });
//   } catch (error) {
//     console.error("Error sending OTP:", error);
//     res.status(500).json({ error: "Failed to send OTP" });
//   }
// };

// // Function to verify OTP and reset password
// const verifyOtpAndResetPassword = async (req, res) => {
//   const { phoneNo, otp, newPassword } = req.body;

//   // Check if the OTP is valid and not expired
//   const result = await pool.query(
//     "SELECT * FROM users WHERE phone_no = $1 AND otp = $2 AND otp_expiry > NOW()",
//     [phoneNo, otp]
//   );

//   if (result.rows.length === 0) {
//     return res.status(400).json({ message: "Invalid or expired OTP" });
//   }

//   // Update the user's password
//   const hashedPassword = await bcrypt.hash(newPassword, 10); // Hash the new password
//   await pool.query(
//     "UPDATE users SET password = $1, otp = NULL, otp_expiry = NULL WHERE phone_no = $2",
//     [hashedPassword, phoneNo]
//   );

//   res.status(200).json({ message: "Password reset successfully" });
// };

// module.exports = {
//   sendOtp,
//   verifyOtpAndResetPassword,
//   // other exports...
// };
