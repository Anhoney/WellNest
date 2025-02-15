// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = req.headers["authorization"]?.split(" ")[1];
  console.log("Auth token received:", token);
  if (!token) return res.status(401).json({ error: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Failed to authenticate" });
    req.userId = user.id; // Attach user ID to the request
    next();
  });
};

module.exports = authenticateToken;
