const jwt = require("jsonwebtoken");
const User = require("../models/User");

const SECRET_KEY = "Tdrdfs@23fv4$ddfdf#@@993e3%%ssDadss";

const authMiddleware = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "Token not provided" });
    }

    token = token.split(" ");
    if (token.length !== 2) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    token = token[1];

    try {
      const decoded = jwt.verify(token, SECRET_KEY);

      if (!decoded || !decoded.userId) {
        return res.status(401).json({ message: "Invalid token" });
      }

      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(401).json({ message: "User not found. Please log in again." });
      }

      req.user = user;
      next();

    } catch (err) {
      console.error("Token verification failed:", err.message);
      return res.status(401).json({ message: "Invalid or expired token" });
    }

  } catch (err) {
    console.error("Authentication failed:", err.message);
    return res.status(401).json({ message: "Authentication failed" });
  }
};

module.exports = authMiddleware;
