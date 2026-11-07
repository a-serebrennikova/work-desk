import express from "express";
import projectRoutes from "./routes/projectRoutes";
import { pool } from "./db";

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use("/projects", projectRoutes);
app.use(express.json());

async function startServer() {
  try {
    await pool.query('SELECT 1');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

startServer();
