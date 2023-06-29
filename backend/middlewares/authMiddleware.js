const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // Check if the request contains a valid JWT token in the cookie
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;

    // Call the next middleware or route handler
    next();
  } catch (error) {
    console.error("Failed to authenticate token:", error);
    res.status(401).json({ error: "Unauthorized" });
  }
};

module.exports = authMiddleware;
