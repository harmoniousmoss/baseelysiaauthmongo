// src/utils/mongodb.ts
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
let client: MongoClient;

export const connectToDatabase = async () => {
  if (!uri) {
    throw new Error("MONGODB_URI is not defined in the .env file");
  }

  client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("MongoDB connection successful");
    return client.db();
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    throw error;
  }
};

export const getClient = () => client;

// Automatically connect to MongoDB when the module is imported
(async () => {
  try {
    await connectToDatabase();
  } catch (error) {
    console.error("MongoDB connection failed during initialization:", error);
  }
})();
