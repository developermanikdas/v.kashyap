import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const seedUser = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error("MONGO_URI is not defined in .env file.");
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB for seeding...");

    const username = process.env.SEED_USERNAME || "admin";
    const email = process.env.SEED_EMAIL || "admin@example.com";
    const password = process.env.SEED_PASSWORD || "admin12345";
    const fullName = process.env.SEED_FULLNAME || "Administrator";

    const existingUser = await User.findOne({ username: username.toLowerCase() });
    if (existingUser) {
      console.log(`User '${username}' already exists. Updating credentials...`);
      const hashedPassword = await bcrypt.hash(password, 12);
      existingUser.password = hashedPassword;
      existingUser.email = email.toLowerCase();
      existingUser.fullName = fullName;
      await existingUser.save();
      console.log("User updated successfully.");
    } else {
      console.log(`Creating default user '${username}'...`);
      const hashedPassword = await bcrypt.hash(password, 12);
      await User.create({
        fullName,
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        password: hashedPassword,
        isVerified: true,
      });
      console.log("Default user created successfully.");
    }

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedUser();
