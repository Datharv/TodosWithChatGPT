const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Connect to the MongoDB database
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to the database");
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
