import mongoose from 'mongoose';

const MONGO_URI = 'mongodb://127.0.0.1:27017/socialDB';

mongoose.set('strictQuery', false);

// Function to connect to MongoDB
// This function uses Mongoose to connect to the MongoDB database
export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(`🟢 MongoDB is connected at: ${MONGO_URI}`);
  } catch (error) {
    console.error('🔴 MongoDB connection error:', error);
    process.exit(1);
  }
};
