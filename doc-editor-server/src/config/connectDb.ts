import mongoose from "mongoose";

const connectDb = async (): Promise<void> => {
  try {

    await mongoose.connect(process.env.DB_URL as string, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      family: 4,
      maxPoolSize: 10,
      minPoolSize: 1,
      maxIdleTimeMS: 60000,
      waitQueueTimeoutMS: 60000,
      retryWrites: true,
      retryReads: true

    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Error connecting to database", error);
    process.exit(1);
  }
};

export default connectDb;