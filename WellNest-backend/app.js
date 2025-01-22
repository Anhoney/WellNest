//app.js
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer"); // Import multer for file uploads
const WebSocket = require("ws"); // Import WebSocket library
const authRoutes = require("./routes/authRoutes");
const registerRoute = require("./routes/registerRoute");
const appointmentsRoute = require("./routes/appointmentsRoute");
const profileRoutes = require("./routes/profileRoutes");
const userAppointmentsRoutes = require("./routes/userAppointmentsRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const medicalReportRoutes = require("./routes/medicalReportRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const medicationRoutes = require("./routes/medicationRoutes");
const eventsRoutes = require("./routes/eventsRoutes");
const opportunitiesRoutes = require("./routes/opportunitiesRoutes");
const assessmentRoutes = require("./routes/assessmentRoutes");
const careplanRoutes = require("./routes/careplanRoutes");
const collaboratorsRoutes = require("./routes/collaboratorsRoutes");
const supportGroupRoutes = require("./routes/supportGroupRoutes");
const supportGroupUserRoutes = require("./routes/supportGroupUserRoutes");
const supportGroupMessageRoutes = require("./routes/supportGroupMessageRoutes");
const usersRoutes = require("./routes/usersRoute");
// const chatRoutes = require("./routes/chatRoutes"); // Added chat routes
const scheduler = require("./scheduler"); // Import the scheduler

require("dotenv").config();
require("./reminderJobs"); // Import the scheduled tasks

const app = express();
app.use(cors());
// app.use(bodyParser.json());
app.use(bodyParser.json({ limit: "50mb" })); // Increase limit to handle image data
app.use(bodyParser.urlencoded({ extended: true }));
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
// Use Notification Routes
app.use("/api", notificationRoutes);
app.use("/api", medicationRoutes);
app.use("/api", eventsRoutes);
app.use("/api", opportunitiesRoutes);
app.use("/api", assessmentRoutes);
app.use("/api", careplanRoutes);
app.use("/api", collaboratorsRoutes);
app.use("/api", supportGroupRoutes);
app.use("/api", supportGroupUserRoutes);
app.use("/api", supportGroupMessageRoutes);
app.use("/api", usersRoutes);

// Serve static files from the "uploads" directory
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Adjust the path as necessary

const PORT = process.env.PORT || 5001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
// module.exports = app;

// // Create a WebSocket server
// const wss = new WebSocket.Server({ noServer: true });

// // Handle WebSocket connections
// wss.on("connection", (ws) => {
//   console.log("New client connected");

//   ws.on("close", () => {
//     console.log("Client disconnected");
//   });
// });

// // Function to send notifications to a specific user
// const sendNotification = (userId, message) => {
//   wss.clients.forEach((client) => {
//     if (client.readyState === WebSocket.OPEN) {
//       client.send(JSON.stringify({ userId, message }));
//     }
//   });
// };

// // Integrate WebSocket with the HTTP server
// const server = app.listen(process.env.PORT || 5001, "0.0.0.0", () => {
//   console.log(`Server is running on port ${process.env.PORT || 5001}`);
// });

// // Upgrade HTTP server to handle WebSocket connections
// server.on("upgrade", (request, socket, head) => {
//   wss.handleUpgrade(request, socket, head, (ws) => {
//     wss.emit("connection", ws, request);
//   });
// });
