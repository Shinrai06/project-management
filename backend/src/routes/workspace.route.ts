import { Router } from "express";
import {
  createWorkspaceController,
  deleteWorkSpaceController,
  getAllWorkspacesUserIsMemberController,
} from "../controllers/workspace.controller";

const workspaceRoutes = Router();

workspaceRoutes.get("/all", getAllWorkspacesUserIsMemberController);
workspaceRoutes.post("/create", createWorkspaceController);

workspaceRoutes.delete("/:workspaceId", deleteWorkSpaceController);

export default workspaceRoutes;
