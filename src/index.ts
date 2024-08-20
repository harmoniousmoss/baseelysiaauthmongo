import { Elysia } from "elysia";
import { config } from "dotenv";
import "./utils/mongodb";
import { setupRoutes } from "./routes/signupRoutes";

// Load environment variables from .env file
config();

// Initialize the Elysia app
const app = new Elysia();

// Setup the routes
setupRoutes(app);

// Start the server
app.listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
