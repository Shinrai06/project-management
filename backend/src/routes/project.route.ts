import { Router } from "express";
import {
  createProjectController,
  deleteProjectByIdController,
  getAllProjectsInWorkspaceController,
  getProjectAnalyticsController,
  getProjectByIdAndWorkspaceIdController,
  updateProjectController,
} from "../controllers/project.controller";

const projectRoutes = Router();

projectRoutes.post("/workspace/:workspaceId/create", createProjectController);

// handle pagination
projectRoutes.get(
  "/workspace/:workspaceId/all",
  getAllProjectsInWorkspaceController
);

projectRoutes.get(
  "/:projectId/workspace/:workspaceId",
  getProjectByIdAndWorkspaceIdController
);

projectRoutes.get(
  "/:projectId/workspace/:workspaceId/analytics",
  getProjectAnalyticsController
);

projectRoutes.put(
  "/:projectId/workspace/:workspaceId/update",
  updateProjectController
);

projectRoutes.delete(
  "/:projectId/workspace/:workspaceId/delete",
  deleteProjectByIdController
);

export default projectRoutes;
