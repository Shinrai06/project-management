import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import {
  createTaskSchema,
  taskIdSchema,
  updateTaskSchema,
} from "../validation/task.validation";
import { projectIdScheam } from "../validation/project.validation";
import { workspaceIdSchema } from "../validation/workspace.validation";
import { getMemberRoleInWorkspace } from "../services/member.service";
import { roleGuard } from "../utils/roleGuard";
import { Permissions } from "../enums/role.enum";
import {
  createTaskService,
  deleteTaskByIdService,
  getAllTasksService,
  getTaskByIdService,
  updateTaskService,
} from "../services/task.service";
import { HTTPSTATUS } from "../config/http.config";

export const createTaskController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = createTaskSchema.parse(req.body);
    const projectId = projectIdScheam.parse(req.params.projectId);
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
    const userId = req.user?._id;

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.CREATE_TASK]);

    const { task } = await createTaskService(
      userId,
      projectId,
      workspaceId,
      body
    );

    return res.status(HTTPSTATUS.OK).json({
      message: "created task successfully",
      task,
    });
  }
);

export const getTaskByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const projectId = projectIdScheam.parse(req.params.projectId);
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
    const taskId = taskIdSchema.parse(req.params.taskId);
    const userId = req.user?._id;

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.VIEW_ONLY]);

    const { task } = await getTaskByIdService(taskId, projectId, workspaceId);
    return res.status(HTTPSTATUS.OK).json({
      message: "fetched task successfully",
      task,
    });
  }
);

export const getAllTasksController = asyncHandler(
  async (req: Request, res: Response) => {
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
    const userId = req.user?._id;

    const filters = {
      projectId: req.query.projectId as string | undefined,
      status: req.query.status
        ? (req.query.status as string)?.split(",")
        : undefined,
      priority: req.query.priority
        ? (req.query.priority as string)?.split(",")
        : undefined,
      assignedTo: req.query.assignedTo
        ? (req.query.assignedTo as string)?.split(",")
        : undefined,
      keyword: req.query.keyword as string | undefined,
      dueDate: req.query.dueDate as string | undefined,
    };

    const pagination = {
      pageSize: parseInt(req.query.pageSize as string) || 10,
      pageNumber: parseInt(req.query.pageNumber as string) || 1,
    };

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.VIEW_ONLY]);

    const { tasks, totalCount, totalPages, skip } = await getAllTasksService(
      workspaceId,
      filters,
      pagination
    );
    return res.status(HTTPSTATUS.OK).json({
      message: "fetched all tasks in workspace successfully",
      tasks,
      pagination: {
        totalCount,
        pageSize: pagination.pageSize,
        pageNumber: pagination.pageNumber,
        totalPages,
        skip,
        limit: pagination.pageSize,
      },
    });
  }
);

export const updateTaskController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = updateTaskSchema.parse(req.body);
    const projectId = projectIdScheam.parse(req.params.projectId);
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
    const taskId = taskIdSchema.parse(req.params.taskId);
    const userId = req.user?._id;

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.EDIT_TASK]);

    const { updatedTask } = await updateTaskService(
      taskId,
      projectId,
      workspaceId,
      body
    );
    return res.status(HTTPSTATUS.OK).json({
      message: "updated task successfully",
      updatedTask,
    });
  }
);

export const deleteTaskByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const projectId = projectIdScheam.parse(req.params.projectId);
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
    const taskId = taskIdSchema.parse(req.params.taskId);
    const userId = req.user?._id;

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.DELETE_TASK]);

    const { task } = await deleteTaskByIdService(
      taskId,
      projectId,
      workspaceId
    );
    return res.status(HTTPSTATUS.OK).json({
      message: "deleted task successfully",
      task,
    });
  }
);
