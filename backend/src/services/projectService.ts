import { DatabaseError } from "pg";
import { pool } from "../db";
import { AppError } from "../errors/AppError";
import type { Project } from "../types/types";
import type { ProjectBody } from "../schemas/projectSchema";

class ProjectService {
  async getAllProjects() {
    const result = await pool.query<Project>("SELECT * FROM projects");
    return result.rows;
  }

  async getProject(id: number) {
    const result = await pool.query<Project>(
      "SELECT * FROM projects WHERE id = $1",
      [id],
    );
    const project = result.rows[0];

    if (!project) {
      throw new AppError(404, "Project not found");
    }

    return project;
  }

  async createProject(body: ProjectBody): Promise<Project> {
    const { name, owner_id } = body;

    try {
      const result = await pool.query<Project>(
        "INSERT INTO projects (name, owner_id) VALUES ($1, $2) RETURNING *",
        [name, owner_id],
      );

      return result.rows[0];
    } catch (error) {
      if (error instanceof DatabaseError && error.code === "23503") {
        throw new AppError(400, "owner_id must reference an existing user");
      }

      throw error;
    }
  }

  async updateProject(id: number, body: ProjectBody): Promise<Project> {
    const { name, owner_id } = body;
    let result;

    try {
      result = await pool.query<Project>(
        `UPDATE projects
         SET name = $1, owner_id = $2, updated_at = NOW()
         WHERE id = $3
         RETURNING *`,
        [name, owner_id, id],
      );
    } catch (error) {
      if (error instanceof DatabaseError && error.code === "23503") {
        throw new AppError(400, "owner_id must reference an existing user");
      }

      throw error;
    }

    const project = result.rows[0];
    if (!project) {
      throw new AppError(404, "Project not found");
    }

    return project;
  }

  async deleteProject(id: number): Promise<void> {
    const result = await pool.query<Project>(
      "DELETE FROM projects WHERE id = $1 RETURNING *",
      [id],
    );

    if (result.rowCount === 0) {
      throw new AppError(404, "Project not found");
    }
  }
}

export default new ProjectService();
