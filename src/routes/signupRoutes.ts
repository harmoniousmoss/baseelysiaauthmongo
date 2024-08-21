// src/routes/signupRoutes.ts
import { Elysia } from "elysia";
import { signupHandler } from "../handlers/signupHandler";

export const setupSignupRoutes = (app: Elysia) => {
  app.post("/signup", signupHandler);
};
