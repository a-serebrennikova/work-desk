import express from "express";
import type { ErrorRequestHandler } from "express";
import projectRoutes from "./routes/projectRoutes";
import taskRoutes from "./routes/taskRoutes";
import { pool } from "./db";
import { AppError } from "./errors/AppError";
import { ZodError } from "zod";

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());

app.use("/projects", projectRoutes);
app.use("/tasks", taskRoutes);

app.get("/live", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.status(200).json({ status: "ok", database: "connected" });
  } catch (error) {
    console.error("Health check failed:", error);
    res.status(503).json({ status: "error", database: "unavailable" });
  }
});

const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    res.status(400).json({
      error: "Invalid request",
      details: error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json({ error: error.message });
    return;
  }

  console.error("Unhandled request error:", error);
  res.status(500).json({ error: "Internal Server Error" });
};

app.use(errorHandler);

async function startServer() {
  try {
    await pool.query("SELECT 1");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    await pool.end();
    process.exitCode = 1;
  }
}

startServer();
