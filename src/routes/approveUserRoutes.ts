import { Elysia, Context } from "elysia";
import { approveUserHandler } from "../handlers/approveUserHandler";
import { adminAuthMiddleware } from "../middleware/authMiddleware";

export const setupApproveUserRoutes = (app: Elysia) => {
  app.put("/approve-user/:userId", async (context: Context) => {
    // Convert headers to Headers instance if necessary
    let headers: Headers;
    if (context.headers instanceof Headers) {
      headers = context.headers;
    } else {
      headers = new Headers(context.headers as Record<string, string>);
    }

    // Run the middleware and get the result
    const middlewareResult = await adminAuthMiddleware({ headers });

    // If middleware returned an error, return it immediately
    if (middlewareResult.status !== 200) {
      return middlewareResult;
    }

    // Call the handler with the necessary context and user information
    return approveUserHandler({
      params: context.params,
      user: middlewareResult.user,
    });
  });
};
