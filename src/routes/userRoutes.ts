// src/routes/userRoutes.ts

import { Elysia, Context } from "elysia";
import { authMiddleware } from "../middleware/authMiddleware";
import { getUserDataHandler } from "../handlers/getUserDataHandler";

// Route to get user data, accessible by both admins and merchants
export const setupUserRoutes = (app: Elysia) => {
  app.get("/users", async (context: Context) => {
    // Convert headers to Headers instance if necessary
    let headers: Headers;
    if (context.headers instanceof Headers) {
      headers = context.headers;
    } else {
      headers = new Headers(context.headers as Record<string, string>);
    }

    // Run the middleware and get the result
    const middlewareResult = await authMiddleware({ headers });

    // If middleware returned an error, return it immediately
    if (middlewareResult.status !== 200) {
      return middlewareResult;
    }

    // Call the handler with the necessary context and user information
    return getUserDataHandler({
      user: middlewareResult.user,
    });
  });
};
