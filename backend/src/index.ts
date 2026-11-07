import express from "express";
import projectRoutes from "./routes/projectRoutes";
import { pool } from "./db";

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use("/projects", projectRoutes);

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
