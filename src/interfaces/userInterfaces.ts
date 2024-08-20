// src/interfaces/userInterfaces.ts
export interface SignupRequestBody {
  merchant_name: string;
  merchant_status?: "pending" | "approved";
  merchant_email: string;
  merchant_email_status?: "verified" | "not verified";
  merchant_role?: "merchant" | "admin";
  merchant_person_incharge: string;
  merchant_phone_number?: string;
  merchant_website?: string;
  merchant_address?: string;
  password: string;
}
