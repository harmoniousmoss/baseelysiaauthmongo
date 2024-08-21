import { Elysia } from "elysia";
import { config } from "dotenv";
import "./utils/mongodb";
import { setupSignupRoutes } from "./routes/signupRoutes";
import { setupSigninRoutes } from "./routes/signinRoutes";
import { setupVerifyEmailRoutes } from "./routes/verifyEmailRoutes";

// Load environment variables from .env file
config();

// Initialize the Elysia app
const app = new Elysia();

// Setup the routes
setupSignupRoutes(app);
setupSigninRoutes(app);
setupVerifyEmailRoutes(app);

// Start the server
app.listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
