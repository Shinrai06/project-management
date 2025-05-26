import { Router } from "express";
import {
  changeWorkspaceMemberRoleController,
  createWorkspaceController,
  deleteWorkSpaceController,
  getAllWorkspacesUserIsMemberController,
  getWorkspaceAnalyticsController,
  getWorkspaceController,
  getWorkspaceMembersController,
} from "../controllers/workspace.controller";

const workspaceRoutes = Router();

workspaceRoutes.get("/all", getAllWorkspacesUserIsMemberController);
workspaceRoutes.post("/create", createWorkspaceController);

workspaceRoutes.put(
  "/change/member/role/:workspaceId",
  changeWorkspaceMemberRoleController
);
workspaceRoutes.get("/analytics/:workspaceId", getWorkspaceAnalyticsController);
workspaceRoutes.get("/members/:workspaceId", getWorkspaceMembersController);

workspaceRoutes.delete("/", deleteWorkSpaceController);
workspaceRoutes.get("/:workspaceId", getWorkspaceController);

export default workspaceRoutes;
