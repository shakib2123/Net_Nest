import mongoose from "mongoose";

let isConnected: boolean = false;

const DATABASE_URL = process.env.DATABASE_URL || "your_mongodb_uri_here";

if (!DATABASE_URL) {
  throw new Error(
    "Please define the DATABASE_URL environment variable inside .env.local"
  );
}

if (!isConnected) {
  console.log("MongoDB not connected.");
}

async function connectDB() {
  try {
    await mongoose.connect(DATABASE_URL, { dbName: "Net_Nest" });

    isConnected = true;
    console.log("MongoDB connected successfully.");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

export default connectDB;
