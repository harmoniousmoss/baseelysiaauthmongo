import { Elysia } from "elysia";
import { config } from "dotenv";
import "./utils/mongodb"; // Importing will trigger the connection

// Load environment variables from .env file
config();

// Initialize the Elysia app
const app = new Elysia().get("/", () => "Hello Elysia").listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
