// src/handlers/signupHandler.ts
import bcrypt from "bcrypt";
import { signUpSchema } from "../schemas/userSchema";
import { getClient } from "../utils/mongodb";
import { SignupRequestBody } from "../interfaces/userInterfaces";

export const signupHandler = async ({ body }: { body: SignupRequestBody }) => {
  const result = signUpSchema.safeParse(body);
  if (!result.success) {
    return {
      status: 400,
      body: { error: result.error.errors.map((err) => err.message) },
    };
  }

  const {
    merchant_name,
    merchant_status,
    merchant_email,
    merchant_email_status,
    merchant_role,
    merchant_person_incharge,
    merchant_phone_number,
    merchant_website,
    merchant_address,
    password,
  } = result.data;

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    merchant_name,
    merchant_status,
    merchant_email,
    merchant_email_status,
    merchant_role,
    merchant_person_incharge,
    merchant_phone_number,
    merchant_website,
    merchant_address,
    password: hashedPassword,
    created_at: new Date(),
    updated_at: new Date(),
  };

  const db = getClient().db();
  await db.collection("users").insertOne(newUser);

  return {
    status: 201,
    body: { message: "User signup successful", user: newUser },
  };
};
