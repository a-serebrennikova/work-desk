import Router from "express";
import ProjectController from "../controllers/ProjectController";

const router = Router();

router.get("/", ProjectController.getAllProjects);
router.get("/:id", ProjectController.getProject);
router.post("/", ProjectController.createProject);
router.put("/:id", ProjectController.updateProject);
router.delete("/:id", ProjectController.deleteProject);

export default router;
