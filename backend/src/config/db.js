const mongoose = require("mongoose");

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error(
      "MONGODB_URI is not set. Create backend/.env from backend/.env.example and add your MongoDB connection string."
    );
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log("MongoDB connected");
};

module.exports = connectDB;
