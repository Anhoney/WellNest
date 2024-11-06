// controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { findUserByPhoneNo } = require("../models/userModel");

const loginUser = async (req, res) => {
  const { phoneNo, password } = req.body;
  // console.log(phoneNo)
  // console.log(password)

  try {
    const user = await findUserByPhoneNo(phoneNo);
    console.log(user);
    if (!user) return res.status(401).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(403).json({ error: "Invalid password" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  loginUser,
};
