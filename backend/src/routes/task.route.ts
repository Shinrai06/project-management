import { Router } from "express";
import {
  createTaskController,
  deleteTaskByIdController,
  getAllTasksController,
  getTaskByIdController,
  updateTaskController,
} from "../controllers/task.controller";

const taskRoutes = Router();

taskRoutes.post(
  "/project/:projectId/workspace/:workspaceId/create",
  createTaskController
);

taskRoutes.get("/workspace/:workspaceId/all", getAllTasksController);

taskRoutes.put(
  "/:taskId/project/:projectId/workspace/:workspaceId/update",
  updateTaskController
);

taskRoutes.get(
  "/:taskId/project/:projectId/workspace/:workspaceId",
  getTaskByIdController
);

taskRoutes.delete(
  "/:taskId/project/:projectId/workspace/:workspaceId",
  deleteTaskByIdController
);

export default taskRoutes;
