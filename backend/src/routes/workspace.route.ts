import { Router } from "express";
import {
  changeWorkspaceMemberRoleController,
  createWorkspaceController,
  deleteWorkSpaceByIdController,
  getAllWorkspacesUserIsMemberController,
  getWorkspaceAnalyticsController,
  getWorkspaceController,
  getWorkspaceMembersController,
  updateWorkSpaceController,
} from "../controllers/workspace.controller";

const workspaceRoutes = Router();

// GET all workspaces the user is a member of
workspaceRoutes.get("/all", getAllWorkspacesUserIsMemberController);

// POST create a new workspace
workspaceRoutes.post("/create", createWorkspaceController);

// PUT change a member's role in a workspace
workspaceRoutes.put(
  "/change/member/role/:workspaceId",
  changeWorkspaceMemberRoleController
);

// PUT update workspace
workspaceRoutes.put("/update/:workspaceId", updateWorkSpaceController);

// GET workspace analytics
workspaceRoutes.get("/analytics/:workspaceId", getWorkspaceAnalyticsController);

// GET workspace members
workspaceRoutes.get("/members/:workspaceId", getWorkspaceMembersController);

// DELETE workspace (consider adding :workspaceId for clarity)
workspaceRoutes.delete("/:workspaceId", deleteWorkSpaceByIdController);

// GET a specific workspace (must come last to avoid swallowing other routes)
workspaceRoutes.get("/:workspaceId", getWorkspaceController);

export default workspaceRoutes;
