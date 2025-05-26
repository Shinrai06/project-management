import mongoose from "mongoose";
import { Roles } from "../enums/role.enum";
import MemberModel from "../models/member.model";
import RoleModel from "../models/roles-permission.model";
import UserModel from "../models/user.model";
import WorkspaceModel from "../models/workspace.model";
import { NotFoundExcpetion } from "../utils/appError";
import TaskModel from "../models/task.model";
import { TaskStatusEnum } from "../enums/task.enum";

export const getAllWorkspacesUserIsMemberService = async (userId: string) => {
  const memberships = await MemberModel.find({ userId })
    .populate("workspaceId")
    .select("-password")
    .exec();

  // To select the required attributes only
  const workspacesList = memberships.map(
    (membership) => membership.workspaceId
  );
  return workspacesList;
};

export const createWorkspaceService = async (
  userId: string,
  body: {
    name: string;
    description?: string | undefined;
  }
) => {
  const { name, description } = body;

  const user = await UserModel.findById(userId);
  if (!user) {
    throw new NotFoundExcpetion("User not found");
  }

  const ownerRole = await RoleModel.findOne({ name: Roles.OWNER });
  if (!ownerRole) {
    throw new NotFoundExcpetion("Owner role not found");
  }

  const workspace = new WorkspaceModel({
    name: name,
    description: description,
    owner: user._id,
  });
  await workspace.save();

  const memeber = new MemberModel({
    userId: user._id,
    workspaceId: workspace._id,
    role: ownerRole,
    joinedAt: new Date(),
  });
  await memeber.save();

  user.currentWorkspace = workspace._id as mongoose.Types.ObjectId;
  await user.save();

  return workspace;
};

export const getWorkspaceService = async (workspaceId: string) => {
  const workspace = await WorkspaceModel.findById(workspaceId).exec();
  if (!workspace) throw new NotFoundExcpetion("Workspace was not found");

  const members = await MemberModel.find({ workspaceId }).populate("role");

  const workspaceWithMembers = {
    ...workspace.toObject(),
    members,
  };
  return { workspace: workspaceWithMembers };
};

export const getWorkspaceMembersService = async (workspaceId: string) => {
  const members = await MemberModel.find({ workspaceId })
    .populate("userId", "name email profilePicture isActive")
    .populate("role", "name");

  const roles = await RoleModel.find({}, { name: 1, _id: 1 })
    .select("-permission")
    .lean();

  return { members, roles };
};

export const getWorkspaceAnalyticsService = async (workspaceId: string) => {
  const currentDate = new Date();

  const totalTasks = await TaskModel.countDocuments({
    workspace: workspaceId,
  });

  const overdueTasks = await TaskModel.countDocuments({
    workspace: workspaceId,
    dueDate: currentDate,
    status: { $ne: TaskStatusEnum.RESOLVED },
  });

  const completedTasks = await TaskModel.countDocuments({
    workspace: workspaceId,
    status: TaskStatusEnum.RESOLVED,
  });

  const analytics = {
    totalTasks,
    overdueTasks,
    completedTasks,
  };

  return { analytics };
};

export const updateWorkspaceService = async () => {};

export const deleteWorkspaceService = async (workspaceId: string) => {};

export const changeMemberRoleService = async (
  workspaceId: string,
  memberId: string,
  roleId: string
) => {
  const workspace = await WorkspaceModel.findById(workspaceId).exec();
  if (!workspace) {
    throw new NotFoundExcpetion("Workspace not found");
  }

  // submit the role id to update the member role
  const role = await RoleModel.findById(roleId).exec();
  if (!role) {
    throw new NotFoundExcpetion("Role Not found");
  }

  const member = await MemberModel.findOne({
    userId: memberId,
    workspaceId: workspaceId,
  });

  if (!member) {
    throw new Error("Member not found in the workspace");
  }

  member.role = role;
  await member.save();

  return { member };
};
