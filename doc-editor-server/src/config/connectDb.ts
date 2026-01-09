import mongoose from "mongoose";

const connectDb = async (): Promise<void> => {
  try {

    await mongoose.connect(process.env.DB_URL as string);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Error connecting to database", error);
    process.exit(1);
  }
};

export default connectDb;