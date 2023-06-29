const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

dotenv.config({
  path: "config/config.env",
});
// Start the server
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);


connectDB();

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
