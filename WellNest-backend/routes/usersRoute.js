// const express = require("express");
// const router = express.Router();
// const {
//   sendOtp,
//   verifyOtpAndResetPassword,
// } = require("../controllers/usersController");

// router.post("/forgot-password/send-otp", sendOtp);
// router.post("/forgot-password/verify-otp", verifyOtpAndResetPassword);

// module.exports = router;

const express = require("express");
const router = express.Router();
const { getAllUsers } = require("../controllers/usersController");
const authenticateToken = require("../middleware/authMiddleware");

router.get("/users/", authenticateToken, getAllUsers);

module.exports = router;
