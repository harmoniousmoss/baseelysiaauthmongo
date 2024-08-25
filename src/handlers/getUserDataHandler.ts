// src/handlers/getUserDataHandler.ts

import { getClient } from "../utils/mongodb";
import { ObjectId } from "mongodb";

// Handler to get user data based on the user's role
export const getUserDataHandler = async ({ user }: { user: any }) => {
  const db = getClient().db();

  if (user.merchant_role === "admin") {
    // Admin: Retrieve all user data
    const users = await db.collection("users").find({}).toArray();
    return {
      status: 200,
      body: users,
    };
  } else {
    // Merchant: Retrieve only their own data
    const userData = await db
      .collection("users")
      .findOne({ _id: new ObjectId(user._id) });
    return {
      status: 200,
      body: userData,
    };
  }
};
