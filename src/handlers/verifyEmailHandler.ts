import jwt from "jsonwebtoken";
import { getClient } from "../utils/mongodb";

export const verifyEmailHandler = async ({
  query,
}: {
  query: { token: string };
}) => {
  const { token } = query;

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_jwt_secret"
    ) as { email: string };

    const db = getClient().db();
    const user = await db
      .collection("users")
      .findOne({ merchant_email: decoded.email });

    if (!user) {
      return {
        status: 400,
        body: { error: "User not found." },
      };
    }

    await db
      .collection("users")
      .updateOne(
        { merchant_email: user.merchant_email },
        { $set: { merchant_email_status: "verified" } }
      );

    return {
      status: 200,
      body: { message: "Email successfully verified." },
    };
  } catch (error) {
    return {
      status: 400,
      body: { error: "Invalid or expired token." },
    };
  }
};
