const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const registerRoute = require("./routes/registerRoute");
const appointmentsRoute = require("./routes/appointmentsRoute");
const profileRoutes = require("./routes/profileRoutes");
const userAppointmentsRoutes = require("./routes/userAppointmentsRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const medicalReportRoutes = require("./routes/medicalReportRoutes");
// const chatRoutes = require("./routes/chatRoutes"); // Added chat routes

require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Basic home route for testing
app.get("/", (req, res) => {
  res.send("<h1>Hello World</h1>");
});

// Use the registration route
app.use("/api/auth", registerRoute);
app.use("/api/auth", authRoutes);
app.use("/api", appointmentsRoute);
app.use("/api", profileRoutes);
// app.use("/api", chatRoutes); // Added chat routes
app.use("/api", userAppointmentsRoutes);
app.use("/api", favoriteRoutes);
app.use("/api", medicalReportRoutes);

// Serve static files from the "uploads" directory
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Adjust the path as necessary

const PORT = process.env.PORT || 5001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
