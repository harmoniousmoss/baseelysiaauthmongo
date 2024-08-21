import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { signUpSchema } from "../schemas/userSchema";
import { getClient } from "../utils/mongodb";
import { SignupRequestBody } from "../interfaces/userInterfaces";
import { sendEmail } from "../utils/email";

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

  // Generate a JWT token
  const verificationToken = jwt.sign(
    { email: merchant_email },
    process.env.JWT_SECRET || "your_jwt_secret",
    { expiresIn: "1h" } // Token expires in 1 hour
  );

  // Send email verification to the user
  const verificationLink = `http://localhost:3000/verify-email?token=${verificationToken}`;
  await sendEmail(
    merchant_email,
    "Verify your email address",
    `<p>Hi ${merchant_name},</p>
     <p>Thank you for signing up. Please verify your email address by clicking the link below:</p>
     <p><a href="${verificationLink}">Verify Email</a></p>`
  );

  // Send an email to the admin for approval
  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail) {
    await sendEmail(
      adminEmail,
      "New User Signup Requires Approval",
      `<p>A new user has signed up and requires approval:</p>
       <ul>
         <li><strong>Name:</strong> ${merchant_name}</li>
         <li><strong>Email:</strong> ${merchant_email}</li>
         <li><strong>Role:</strong> ${merchant_role}</li>
         <li><strong>Status:</strong> ${merchant_status}</li>
       </ul>
       <p>Please review and approve the signup in the admin panel.</p>`
    );
  }

  return {
    status: 201,
    body: {
      message:
        "User signup successful. Please check your email for verification.",
    },
  };
};
