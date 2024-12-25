// const http = require("http");
// const socketIo = require("socket.io");
// const app = require("./app"); // Your Express app

// // Create an HTTP server to wrap the Express app
// const server = http.createServer(app);

// // Set up the WebSocket server with socket.io
// const io = socketIo(server, {
//   cors: {
//     origin: "*", // Adjust as needed for security
//   },
// });

// // Handle WebSocket connections
// io.on("connection", (socket) => {
//   console.log("A user connected");

//   // Listen for user registration
//   socket.on("register", (userId) => {
//     console.log(`User registered with ID: ${userId}`);
//     socket.join(userId); // Join a room named after the userId
//   });

//   // Handle user disconnection
//   socket.on("disconnect", () => {
//     console.log("A user disconnected");
//   });
// });

// // Export the WebSocket server instance
// module.exports = io;

// // Start the HTTP server
// const PORT = process.env.PORT || 5001;
// server.listen(PORT, "0.0.0.0", () => {
//   console.log(`Server is running on port ${PORT}`);
// });
