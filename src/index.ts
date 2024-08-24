import { Elysia } from "elysia";
import { config } from "dotenv";
import { readFileSync } from "fs";
import { join } from "path";
import "./utils/mongodb";
import { setupSignupRoutes } from "./routes/signupRoutes";
import { setupSigninRoutes } from "./routes/signinRoutes";
import { setupVerifyEmailRoutes } from "./routes/verifyEmailRoutes";

// Load environment variables from .env file
config();

const app = new Elysia();

// Serve the HTML file for the root route
// Serve the HTML file for the root route
app.get("/", () => {
  const html = readFileSync(join(__dirname, "public", "index.html"), "utf8");
  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html",
    },
  });
});

// Setup the routes
setupSignupRoutes(app);
setupSigninRoutes(app);
setupVerifyEmailRoutes(app);

// Start the server
app.listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
