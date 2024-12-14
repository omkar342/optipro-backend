import mongoose from "mongoose";
require("dotenv").config();

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGODB_URL_PROD as string);

    console.log(`MongoDB Connected`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error("An unknown error occurred during MongoDB connection.");
    }
    process.exit(1);
  }
};

export default connectDB;
