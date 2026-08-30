import mongoose from "mongoose";

const connectDB = async () => {
  const maxRetries = 5;
  for (let i = 1; i <= maxRetries; i++) {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 8000,
      });
      console.log("MongoDB Connected");
      return;
    } catch (err) {
      console.error(`MongoDB connection attempt ${i} failed:`, err.message);
      if (i < maxRetries) {
        console.log("Retrying MongoDB connection in 3 seconds...");
        await new Promise((res) => setTimeout(res, 3000));
      } else {
        console.error("All MongoDB connection retries exhausted.");
      }
    }
  }
};

export default connectDB;