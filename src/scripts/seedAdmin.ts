// src/scripts/seedAdmin.ts
import bcrypt from "bcrypt";
import { config } from "dotenv";
import { getClient } from "../utils/mongodb";

// Load environment variables from .env file
config();

const seedAdmin = async () => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.error("ADMIN_EMAIL or ADMIN_PASSWORD is not set in .env file");
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const adminUser = {
    merchant_name: "Admin",
    merchant_status: "approved",
    merchant_email: adminEmail,
    merchant_email_status: "verified",
    merchant_role: "admin",
    merchant_person_incharge: "Admin",
    password: hashedPassword,
    created_at: new Date(),
    updated_at: new Date(),
  };

  try {
    const db = getClient().db();
    const existingAdmin = await db
      .collection("users")
      .findOne({ merchant_email: adminEmail });

    if (existingAdmin) {
      console.log("Admin user already exists");
    } else {
      await db.collection("users").insertOne(adminUser);
      console.log("Admin user seeded successfully");
    }
  } catch (error) {
    console.error("Error seeding admin user:", error);
  } finally {
    process.exit(0);
  }
};

seedAdmin();
