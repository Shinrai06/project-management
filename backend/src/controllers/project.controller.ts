import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import {
  createProjectSchema,
  projectIdScheam,
  updateProjectSchema,
} from "../validation/project.validation";
import { workspaceIdSchema } from "../validation/workspace.validation";
import {
  createProjectService,
  deleteProjectByIdService,
  getAllProjectsInWorkspaceService,
  getProjectAnalyticsService,
  getProjectByIdandWorkspaceIdService,
  updateProjectSerivce,
} from "../services/project.service";
import { HTTPSTATUS } from "../config/http.config";
import { getMemberRoleInWorkspace } from "../services/member.service";
import { roleGuard } from "../utils/roleGuard";
import { Permissions } from "../enums/role.enum";

export const createProjectController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = createProjectSchema.parse(req.body);
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
    const userId = req.user?._id;

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.CREATE_PROJECT]);

    const { project } = await createProjectService(userId, workspaceId, body);
    res.status(HTTPSTATUS.OK).json({
      message: "created project successfully",
      project,
    });
  }
);

export const getAllProjectsInWorkspaceController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.VIEW_ONLY]);

    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const pageNumber = parseInt(req.query.pageNumber as string) || 1;
    const { projects, totalCount, totalPages, skip } =
      await getAllProjectsInWorkspaceService(workspaceId, pageNumber, pageSize);

    return res.status(HTTPSTATUS.OK).json({
      message: "fetched all the projects in the workspace successfully",
      projects,
      pagination: {
        totalCount,
        pageSize,
        pageNumber,
        totalPages,
        skip,
        limit: pageSize,
      },
    });
  }
);

export const getProjectByIdAndWorkspaceIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const projectId = projectIdScheam.parse(req.params.projectId);
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.VIEW_ONLY]);

    const { project } = await getProjectByIdandWorkspaceIdService(
      projectId,
      workspaceId
    );

    return res.status(HTTPSTATUS.OK).json({
      message: "fetched the project successfully",
      project,
    });
  }
);

export const getProjectAnalyticsController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const projectId = projectIdScheam.parse(req.params.projectId);
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.VIEW_ONLY]);

    const { analytics } = await getProjectAnalyticsService(
      projectId,
      workspaceId
    );

    return res.status(HTTPSTATUS.OK).json({
      message: "fetched project analytics successfully",
      analytics,
    });
  }
);

export const updateProjectController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = updateProjectSchema.parse(req.body);
    const projectId = projectIdScheam.parse(req.params.projectId);
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);

    const userId = req.user?._id;

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.EDIT_PROJECT]);

    const { project } = await updateProjectSerivce(
      projectId,
      workspaceId,
      body
    );
    res.status(HTTPSTATUS.OK).json({
      message: "updated project successfully",
      project,
    });
  }
);

export const deleteProjectByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const projectId = projectIdScheam.parse(req.params.projectId);
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
    const userId = req.user?._id;

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.DELETE_PROJECT]);

    const { project } = await deleteProjectByIdService(projectId, workspaceId);

    res.status(HTTPSTATUS.OK).json({
      message: "deleted project successfully",
      project,
    });
  }
);
