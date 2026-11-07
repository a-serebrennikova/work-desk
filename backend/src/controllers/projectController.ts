import type { Request, Response } from "express";
import { pool } from "../db";
import type { Project } from "../types/types";

type ProjectBody = Pick<Project, "name" | "owner_id">;
type ProjectParams = { id: string };

class ProjectController {
  async getAllProjects(_req: Request, res: Response): Promise<void> {
    try {
      const result = await pool.query<Project>("SELECT * FROM projects");
      res.status(200).json(result.rows);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async getProject(req: Request<ProjectParams>, res: Response): Promise<void> {
    try {
      const result = await pool.query<Project>(
        "SELECT * FROM projects WHERE id = $1",
        [req.params.id],
      );
      const project = result.rows[0];
      
      if (!project) {
        res.status(404).json({ error: "Project not found" });
        return;
      }

      res.status(200).json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async createProject(
    req: Request<Record<string, never>, unknown, ProjectBody>,
    res: Response,
  ): Promise<void> {
    const { name, owner_id } = req.body;

    try {
      if (name === undefined || owner_id === undefined) {
        res.status(400).json({
          error: "Missing required fields: name and owner_id",
        });
        return;
      }

      const result = await pool.query<Project>(
        "INSERT INTO projects (name, owner_id) VALUES ($1, $2) RETURNING *",
        [name, owner_id],
      );

      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async updateProject(
    req: Request<ProjectParams, unknown, ProjectBody>,
    res: Response,
  ): Promise<void> {
    const { id } = req.params;
    const { name, owner_id } = req.body;

    try {
      if (name === undefined || owner_id === undefined) {
        res.status(400).json({
          error: "Missing required fields: name and owner_id",
        });
        return;
      }

      const result = await pool.query<Project>(
        `UPDATE projects
         SET name = $1, owner_id = $2, updated_at = NOW()
         WHERE id = $3
         RETURNING *`,
        [name, owner_id, id],
      );

      const project = result.rows[0];
      if (!project) {
        res.status(404).json({ error: "Project not found" });
        return;
      }

      res.status(200).json(project);
    } catch (error) {
      console.error("Error updating project:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async deleteProject(
    req: Request<ProjectParams>,
    res: Response,
  ): Promise<void> {
    const { id } = req.params;

    try {
      const result = await pool.query<Project>(
        "DELETE FROM projects WHERE id = $1 RETURNING *",
        [id],
      );

      if (result.rowCount === 0) {
        res.status(404).json({ error: "Project not found" });
        return;
      }

      res.status(204).json();
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export default new ProjectController();
