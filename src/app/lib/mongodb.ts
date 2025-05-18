import mongoose from 'mongoose';

const connectToDatabase = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  const MONGODB_URI = "mongodb+srv://hollow122025:C4BJjULbUhkFNJIO@hollow.lbjqvqi.mongodb.net/?retryWrites=true&w=majority&appName=Hollow";
  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
  }

  mongoose.set('strictQuery', true); // Optional, suppress deprecation warning
  await mongoose.connect(MONGODB_URI);
};

export default connectToDatabase;
