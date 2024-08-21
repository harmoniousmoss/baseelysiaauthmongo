// src/routes/signinRoutes.ts
import { Elysia } from "elysia";
import { signinHandler } from "../handlers/signinHandler";

export const setupSigninRoutes = (app: Elysia) => {
  app.post("/signin", signinHandler);
};
