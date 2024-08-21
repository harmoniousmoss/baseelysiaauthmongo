// src/handlers/signinHandler.ts
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { signInSchema } from "../schemas/userSchema";
import { getClient } from "../utils/mongodb";
import { SignupRequestBody } from "../interfaces/userInterfaces";

export const signinHandler = async ({ body }: { body: SignupRequestBody }) => {
  const result = signInSchema.safeParse(body);

  if (!result.success) {
    return {
      status: 400,
      body: { error: result.error.errors.map((err) => err.message) },
    };
  }

  const { merchant_email, password } = result.data;

  const db = getClient().db();
  const user = await db.collection("users").findOne({ merchant_email });

  if (!user) {
    return {
      status: 401,
      body: { error: "Invalid email or password" },
    };
  }

  if (user.merchant_email_status !== "verified") {
    return {
      status: 403,
      body: { error: "Email not verified" },
    };
  }

  if (user.merchant_status !== "approved") {
    return {
      status: 403,
      body: { error: "Account not approved" },
    };
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return {
      status: 401,
      body: { error: "Invalid email or password" },
    };
  }

  const token = jwt.sign(
    {
      id: user._id,
      merchant_email: user.merchant_email,
      merchant_role: user.merchant_role,
    },
    process.env.JWT_SECRET || "your_jwt_secret",
    { expiresIn: "1h" }
  );

  return {
    status: 200,
    body: { message: "Sign-in successful", token },
  };
};
