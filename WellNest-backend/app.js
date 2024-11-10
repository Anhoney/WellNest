// //app.js
// const express = require('express');
// const bodyParser = require('body-parser');
// const authRoutes = require('./routes/authRoutes');
// const cors = require('cors');
// const pool = require('./config/db'); // Import the db.js file
// // app.js or server.js (main server file)
// const registerRoute = require('./routes/registerRoute'); // Import the route

// const app = express();

// app.use(cors());
// app.use(express.json()); // To parse JSON request bodies
// // const cors = require('cors');
// // app.use(cors({
// //   origin: 'http://localhost:3000', // Replace with your frontend URL or use '*' for all origins during development
// //   credentials: true,
// // }));

// // app.use(bodyParser.json());
// // app.use('/api/auth', authRoutes);
// // // Use the route
// // app.use('/api/auth', registerRoute);

// // const PORT = 5000;
// // app.listen(PORT, () => {
// //   console.log(`Server running on http://localhost:${PORT}`);
// // });

// // A sample route to test database connection
// app.get('/test-db', async (req, res) => {
//   try {
//     const result = await pool.query('SELECT NOW()'); // Query to get the current time
//     res.status(200).json(result.rows);
//   } catch (err) {
//     console.error('Database query error:', err.stack);
//     res.status(500).send('Database query error');
//   }
// });

// //LOGIN
// // Use authentication routes
// app.use('/api/auth', authRoutes);

// // Start the server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });

// // Start your server
// // app.listen(5000, () => {
// //   console.log('Server is running on http://localhost:5000');
// // });

// app.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const registerRoute = require("./routes/registerRoute");
const appointmentsRoute = require("./routes/appointmentsRoute");
// const usersRoute = require("./routes/usersRoute");

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

// app.use("/api", usersRoute);

const PORT = process.env.PORT || 5001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
