// src/schemas/userSchema.ts
import { z } from "zod";

export const userSchema = z.object({
  merchant_name: z.string().min(1, "Merchant name is required"),
  merchant_status: z.enum(["pending", "approved"]).default("pending"),
  merchant_email: z.string().email("Invalid email format"),
  merchant_email_status: z
    .enum(["verified", "not verified"])
    .default("not verified"),
  merchant_role: z.enum(["merchant", "admin"]).default("merchant"),
  merchant_person_incharge: z.string().min(1, "Person in charge is required"),
  merchant_phone_number: z.string().optional(),
  merchant_website: z.string().optional(),
  merchant_address: z.string().optional(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const signInSchema = z.object({
  merchant_email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
