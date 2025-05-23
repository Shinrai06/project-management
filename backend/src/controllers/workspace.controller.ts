import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { createWorkspaceSchema } from "../validation/workspace.validation";
import { HTTPSTATUS } from "../config/http.config";
import {
  createWorkspaceService,
  deleteWorkspaceService,
  getAllWorkspacesUserIsMemberService,
} from "../services/workspace.service";

// Get the workspace the user is part of

export const getAllWorkspacesUserIsMemberController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const workspaceList = await getAllWorkspacesUserIsMemberService(userId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Fetched the workspaces for th user successfully",
      workspaceList,
    });
  }
);

export const createWorkspaceController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = createWorkspaceSchema.parse(req.body);
    const userId = req.user?._id;

    const workspace = await createWorkspaceService(userId, body);

    return res.status(HTTPSTATUS.OK).json({
      message: "Created workspace successfully",
      workspace,
    });
  }
);

export const updateWorkSpaceController = asyncHandler(
  async (req: Request, res: Response) => {}
);

export const deleteWorkSpaceController = asyncHandler(
  async (req: Request, res: Response) => {
    const workspaceId = req.params.workspaceId;

    const workspace = await deleteWorkspaceService(workspaceId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Deleted workspace successfully",
      workspace,
    });
  }
);
