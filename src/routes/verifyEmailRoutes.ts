// src/routes/verifyEmailRoutes.ts
import { Elysia } from "elysia";
import { verifyEmailHandler } from "../handlers/verifyEmailHandler";

export const setupVerifyEmailRoutes = (app: Elysia) => {
  app.get("/verify-email", verifyEmailHandler);
};
