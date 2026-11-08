import type { Request, Response } from "express";
import ProjectService from "../services/ProjectService";
import {
  projectBodySchema,
  projectIdParamsSchema,
} from "../schemas/projectSchema";

class ProjectController {
  async getAllProjects(_req: Request, res: Response): Promise<void> {
    const projects = await ProjectService.getAllProjects();

    res.status(200).json(projects);
  }

  async getProject(req: Request, res: Response): Promise<void> {
    const { id } = projectIdParamsSchema.parse(req.params);
    const project = await ProjectService.getProject(id);

    res.status(200).json(project);
  }

  async createProject(req: Request, res: Response): Promise<void> {
    const body = projectBodySchema.parse(req.body);
    const project = await ProjectService.createProject(body);

    res.status(201).json(project);
  }

  async updateProject(req: Request, res: Response): Promise<void> {
    const { id } = projectIdParamsSchema.parse(req.params);
    const body = projectBodySchema.parse(req.body);
    const project = await ProjectService.updateProject(id, body);

    res.status(200).json(project);
  }

  async deleteProject(req: Request, res: Response): Promise<void> {
    const { id } = projectIdParamsSchema.parse(req.params);
    await ProjectService.deleteProject(id);

    res.status(204).end();
  }
}

export default new ProjectController();
