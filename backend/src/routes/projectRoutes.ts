import Router from "express";
import ProjectController from "../controllers/projectController";

const router = Router();

router.get("/", ProjectController.getAllProjects);
router.post("/create", ProjectController.createProject);
router.delete("/:id", ProjectController.deleteProject);

export default router;
