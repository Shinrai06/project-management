import mongoose from "mongoose";
import ProjectModel from "../models/project.model";
import TaskModel from "../models/task.model";
import { NotFoundExcpetion } from "../utils/appError";
import { TaskStatusEnum } from "../enums/task.enum";

export const createProjectService = async (
  userId: string,
  workspaceId: string,
  body: {
    name: string;
    emoji?: string;
    description?: string;
  }
) => {
  const project = new ProjectModel({
    ...(body.emoji && { emoji: body.emoji }),
    name: body.name,
    description: body.description,
    workspace: workspaceId,
    createdBy: userId,
  });

  await project.save();

  return { project };
};

export const getAllProjectsInWorkspaceService = async (
  workspaceId: string,
  pageNumber: number,
  pageSize: number
) => {
  const totalCount = await ProjectModel.countDocuments({
    workspace: workspaceId,
  });

  const skip = (pageNumber - 1) * pageSize;
  const projects = await ProjectModel.find({ workspace: workspaceId })
    .skip(skip)
    .limit(pageSize)
    .populate("createdBy", "_id name profilePicture -password")
    .sort({ createdAt: -1 });

  const totalPages = Math.ceil(totalCount / pageSize);
  return { projects, totalCount, totalPages, skip };
};

export const getProjectByIdandWorkspaceIdService = async (
  projectId: string,
  workspaceId: string
) => {
  const project = await ProjectModel.findOne({
    _id: projectId,
    workspace: workspaceId,
  }).select("_id emoji name description");

  if (!project) {
    throw new NotFoundExcpetion("project not found");
  }

  return { project };
};

export const getProjectAnalyticsService = async (
  projectId: string,
  workspaceId: string
) => {
  const project = await ProjectModel.findById(projectId);

  if (!project || project.workspace.toString() !== workspaceId) {
    throw new NotFoundExcpetion("project not found");
  }

  const currentDate = new Date();

  // LEARN: mongoose aggregate
  const taskAnalytics = await TaskModel.aggregate([
    {
      $match: {
        project: new mongoose.Types.ObjectId(projectId),
      },
    },
    {
      $facet: {
        totalTasks: [{ $count: "count" }],
        overdueTasks: [
          {
            $match: {
              dueDate: { $lt: currentDate },
              status: { $ne: TaskStatusEnum.RESOLVED },
            },
          },
          {
            $count: "count",
          },
        ],
        completedTasks: [
          {
            $match: {
              status: TaskStatusEnum.RESOLVED,
            },
          },
          {
            $count: "count",
          },
        ],
      },
    },
  ]);
  const _analytics = taskAnalytics[0];

  const analytics = {
    totalTasks: _analytics.totalTasks[0]?.count || 0,
    overdueTasks: _analytics.overdueTasks[0]?.count || 0,
    completedTasks: _analytics.completedTasks[0]?.count || 0,
  };
  return { analytics };
};

export const updateProjectSerivce = async (
  projectId: string,
  workspaceId: string,
  body: {
    name: string;
    emoji?: string;
    description?: string;
  }
) => {
  const { name, emoji, description } = body;
  const project = await ProjectModel.findOne({
    _id: projectId,
    workspace: workspaceId,
  });
  if (!project) {
    throw new NotFoundExcpetion("project not found");
  }
  if (name !== undefined) project.name = name;
  if (emoji !== undefined) project.emoji = emoji;
  if (description !== undefined) project.description = description;

  await project.save();
  return { project };
};

export const deleteProjectByIdService = async (
  projectId: string,
  workspaceId: string
) => {
  const project = await ProjectModel.findOne({
    _id: projectId,
    workspace: workspaceId,
  });

  if (!project) {
    throw new NotFoundExcpetion("project not found");
  }

  await project.deleteOne();
  await TaskModel.deleteMany({
    project: project._id,
  });

  return { project };
};
