import { DatabaseError } from "pg";
import { pool } from "../db";
import { TaskBody } from "../schemas/taskSchema";
import { Task } from "../types/types";
import { AppError } from "../errors/AppError";

class TaskService {
  async getTasks() {
    const result = await pool.query<Task>("SELECT * FROM tasks");
    return result.rows;
  }

  async getTask(id: number) {
    const result = await pool.query<Task>("SELECT * FROM tasks WHERE id = $1", [
      id,
    ]);
    return result.rows[0];
  }

  async createTask(body: TaskBody) {
    const { project_id, title, description, status, position, assignee_id } =
      body;

    try {
      const result = await pool.query<Task>(
        `INSERT INTO tasks (project_id, title, description, status, position, assignee_id)
         VALUES ($1, $2, $3, $4 , $5, $6)
         RETURNING *`,
        [
          project_id,
          title,
          description ?? null,
          status,
          position,
          assignee_id ?? null,
        ],
      );

      return result.rows[0];
    } catch (error) {
      if (error instanceof DatabaseError && error.code === "23503") {
        throw new AppError(
          400,
          "project_id or assignee_id must reference an existing record",
        );
      }
      throw error;
    }
  }

  async updateTask(id: number, body: TaskBody) {
    const { project_id, title, description, status, position, assignee_id } =
      body;

    try {
      const result = await pool.query<Task>(
        `UPDATE tasks
         SET project_id = $2, title = $3, description = $4, status = $5, position = $6, assignee_id = $7
         WHERE id = $1
         RETURNING *`,
        [
          id,
          project_id,
          title,
          description ?? null,
          status,
          position,
          assignee_id ?? null,
        ],
      );

      if (result.rowCount === 0) {
        throw new AppError(404, "Task not found");
      }

      return result.rows[0];
    } catch (error) {
      if (error instanceof DatabaseError && error.code === "23503") {
        throw new AppError(
          400,
          "project_id or assignee_id must reference an existing record",
        );
      }
      throw error;
    }
  }

  async deleteTask(id: number) {
    const result = await pool.query<Task>(
      "DELETE FROM tasks WHERE id = $1 RETURNING *",
      [id],
    );

    if (result.rowCount === 0) {
      throw new AppError(404, "Task not found");
    }
  }
}

export default new TaskService();
