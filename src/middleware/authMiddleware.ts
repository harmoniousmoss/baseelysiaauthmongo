// src/middleware/authMiddleware.ts

import jwt from "jsonwebtoken";
import { getClient } from "../utils/mongodb";
import { ObjectId } from "mongodb";

// General authentication middleware for both admin and merchant roles
export const authMiddleware = async ({ headers }: { headers: Headers }) => {
  const authHeader = headers.get("Authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return {
      status: 401,
      body: { error: "Authorization header missing or invalid" },
    };
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_jwt_secret"
    ) as { id: string };

    const db = getClient().db();
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(decoded.id) });

    if (!user) {
      return {
        status: 403,
        body: { error: "Access denied" },
      };
    }

    // Return user information to the next handler
    return { status: 200, user };
  } catch (error) {
    return {
      status: 401,
      body: { error: "Invalid or expired token" },
    };
  }
};

// Admin-specific middleware that extends the general authMiddleware
export const adminAuthMiddleware = async ({
  headers,
}: {
  headers: Headers;
}) => {
  const result = await authMiddleware({ headers });

  if (result.status !== 200 || !result.user) {
    return result;
  }

  const { user } = result;
  if (user.merchant_role !== "admin") {
    return {
      status: 403,
      body: { error: "Access denied: Admins only" },
    };
  }

  return result;
};
