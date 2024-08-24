// src/middleware/authMiddleware.ts
import jwt from "jsonwebtoken";
import { getClient } from "../utils/mongodb";
import { ObjectId } from "mongodb";

export const adminAuthMiddleware = async ({
  headers,
}: {
  headers: Headers;
}) => {
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

    if (!user || user.merchant_role !== "admin") {
      return {
        status: 403,
        body: { error: "Access denied: Admins only" },
      };
    }

    // Set user info to request context (or return user object)
    return { status: 200, user };
  } catch (error) {
    return {
      status: 401,
      body: { error: "Invalid or expired token" },
    };
  }
};
