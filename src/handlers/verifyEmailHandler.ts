// src/handlers/verifyEmailHandler.ts
import bcrypt from "bcrypt";
import { getClient } from "../utils/mongodb";

export const verifyEmailHandler = async ({
  query,
}: {
  query: { token: string };
}) => {
  const { token } = query;

  const db = getClient().db();
  const user = await db.collection("users").findOne({});

  if (!user || !bcrypt.compareSync(user.merchant_email, token)) {
    return {
      status: 400,
      body: { error: "Invalid or expired token." },
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
};
