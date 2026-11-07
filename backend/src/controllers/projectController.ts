import { pool } from "../db";

class ProjectController {
  // TODO fix
  async getAllProjects(req: any, res: any) {
    try {
      const result = await pool.query("SELECT * FROM projects");
      console.log(result);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async createProject(req: any, res: any) {
    const { name, owner_id } = req.body;
    try {
      const result = await pool.query(
        "INSERT INTO projects (name, owner_id) VALUES ($1, $2) RETURNING *",
        [name, owner_id],
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async deleteProject(req: any, res: any) {
    const { id } = req.params;
    try {
      if (!id) {
        res.status(400).json({ error: "Project ID is required" });
        return;
      }
      await pool.query("DELETE FROM projects WHERE id = $1  RETURNING *", [id]);

      res.status(204).json();
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export default new ProjectController();
