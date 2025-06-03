import { TaskPriotiyEnum, TaskStatusEnum } from "../enums/task.enum";
import MemberModel from "../models/member.model";
import ProjectModel from "../models/project.model";
import TaskModel from "../models/task.model";
import WorkspaceModel from "../models/workspace.model";
import { BadRequestException, NotFoundExcpetion } from "../utils/appError";

export const createTaskService = async (
  userId: string,
  projectId: string,
  workspaceId: string,
  body: {
    title: string;
    description?: string;
    assignedTo?: string | null;
    priority: string;
    status: string;
    dueDate?: string;
  }
) => {
  const { title, description, assignedTo, priority, status, dueDate } = body;
  const project = await ProjectModel.findById(projectId);

  if (!project || project.workspace.toString() !== workspaceId.toString()) {
    throw new NotFoundExcpetion("project not found");
  }

  if (assignedTo) {
    const isAssignedUserMember = await MemberModel.find({
      userId: assignedTo,
      workspaceId,
    });

    if (!isAssignedUserMember) {
      throw new BadRequestException("assigned user not member of workspace");
    }
  }

  const task = new TaskModel({
    title,
    description,
    createdBy: userId,
    assignedTo,
    priority: priority || TaskPriotiyEnum.MEDIUM,
    status: status || TaskStatusEnum.BACKLOG,
    dueDate,
    project: projectId,
    workspace: workspaceId,
  });

  await task.save();

  return { task };
};

export const getTaskByIdService = async (
  taskId: string,
  projectId: string,
  workspaceId: string
) => {
  const project = await ProjectModel.findById(projectId);

  if (!project || project.workspace.toString() !== workspaceId.toString()) {
    throw new NotFoundExcpetion(
      "project not found or project not part of workspace"
    );
  }

  const task = await TaskModel.findById(taskId).populate(
    "assignedTo",
    "_id name profilePicture -password"
  );
  if (!task || task.project.toString() !== projectId.toString()) {
    throw new NotFoundExcpetion("task not found or task not part of project");
  }

  return { task };
};

export const getAllTasksService = async (
  workspaceId: string,
  filters: {
    projectId?: string;
    status?: string[];
    priority?: string[];
    assignedTo?: string[];
    keyword?: string;
    dueDate?: string;
  },
  pagination: { pageSize: number; pageNumber: number }
) => {
  const workspace = await WorkspaceModel.findById(workspaceId);
  if (!workspace) {
    throw new NotFoundExcpetion("workspace not found");
  }

  // handle filters
  const query: Record<string, any> = {
    workspace: workspaceId,
  };

  if (filters.projectId) {
    query.project = filters.projectId;
  }

  if (filters.status && filters.status?.length > 0) {
    query.status = { $in: filters.status };
  }

  if (filters.priority && filters.priority?.length > 0) {
    query.priority = { $in: filters.priority };
  }

  if (filters.assignedTo && filters.assignedTo?.length > 0) {
    query.assignedTo = { $in: filters.assignedTo };
  }

  if (filters.keyword) {
    query.title = { $regex: filters.keyword, $options: "i" };
  }

  if (filters.dueDate) {
    query.dueDate = { $eq: new Date(filters.dueDate) };
  }

  // handle pagination
  const { pageNumber, pageSize } = pagination;
  const totalCount = await TaskModel.countDocuments(query);
  const skip = (pageNumber - 1) * pageSize;

  const tasks = await TaskModel.find(query)
    .skip(skip)
    .limit(pageSize)
    .populate("createdBy", "_id name profilePicture -password")
    .populate("assignedTo", "_id name profilePicture -password")
    .populate("project", "_id emoji name")
    .sort({ createdAt: -1 });

  const totalPages = Math.ceil(totalCount / pageSize);
  return { tasks, totalCount, totalPages, skip };
};

export const updateTaskService = async (
  taskId: string,
  projectId: string,
  workspaceId: string,
  body: {
    title: string;
    description?: string;
    assignedTo?: string | null;
    priority: string;
    status: string;
    dueDate?: string;
  }
) => {
  const { assignedTo } = body;
  const project = await ProjectModel.findById(projectId);

  if (!project || project.workspace.toString() !== workspaceId.toString()) {
    throw new NotFoundExcpetion(
      "project not found or project not part of workspace"
    );
  }

  if (assignedTo) {
    const isAssignedUserMember = await MemberModel.find({
      userId: assignedTo,
      workspaceId,
    });

    if (!isAssignedUserMember) {
      throw new BadRequestException("assigned user not member of workspace");
    }
  }

  const task = await TaskModel.findById(taskId);

  if (!task || task.project.toString() !== projectId.toString()) {
    throw new NotFoundExcpetion("task not found or task not part of project");
  }

  const updatedTask = await TaskModel.findByIdAndUpdate(
    taskId,
    {
      ...body,
    },
    { new: true }
  );

  if (!updatedTask) {
    throw new BadRequestException("failed to update task");
  }

  return { updatedTask };
};

export const deleteTaskByIdService = async (
  taskId: string,
  projectId: string,
  workspaceId: string
) => {
  const project = await ProjectModel.findById(projectId);

  if (!project || project.workspace.toString() !== workspaceId.toString()) {
    throw new NotFoundExcpetion(
      "project not found or project not part of workspace"
    );
  }

  const task = await TaskModel.findOne({ _id: taskId, workspace: workspaceId });
  if (!task) {
    throw new NotFoundExcpetion("task not found");
  }

  await task.deleteOne();
  return { task };
};
