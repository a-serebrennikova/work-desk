import { taskBodySchema, taskIdParamsSchema } from "../schemas/taskSchema";
import TaskService from "../services/TaskService";
import type { Request, Response } from "express";

class TaskController {
  async getTasks(_req: Request, res: Response) {
    const tasks = await TaskService.getTasks();

    res.status(200).json(tasks);
  }

  async getTask(req: Request, res: Response) {
    const { id } = taskIdParamsSchema.parse(req.params);
    const task = await TaskService.getTask(id);

    res.status(200).json(task);
  }

  async createTask(req: Request, res: Response) {
    const body = taskBodySchema.parse(req.body);
    const task = await TaskService.createTask(body);

    res.status(201).json(task);
  }

  async updateTask(req: Request, res: Response) {
    const { id } = taskIdParamsSchema.parse(req.params);
    const body = taskBodySchema.parse(req.body);
    const task = await TaskService.updateTask(id, body);

    res.status(200).json(task);
  }

  async deleteTask(req: Request, res: Response): Promise<void> {
    const { id } = taskIdParamsSchema.parse(req.params);
    await TaskService.deleteTask(id);

    res.status(204).end();
  }
}

export default new TaskController();
