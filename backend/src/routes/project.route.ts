import { Router } from "express";
import {
  createProjectController,
  getAllProjectsInWorkspaceController,
  getProjectAnalyticsController,
  getProjectByIdAndWorkspaceIdController,
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

export default projectRoutes;
