import mongoose from "mongoose";
import { Roles } from "../enums/role.enum";
import MemberModel from "../models/member.model";
import RoleModel from "../models/roles-permission.model";
import UserModel from "../models/user.model";
import WorkspaceModel from "../models/workspace.model";
import { NotFoundExcpetion } from "../utils/appError";

export const getAllWorkspacesUserIsMemberService = async (userId: string) => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new NotFoundExcpetion("User not found");
  }

  // To select the required attributes only
  const workspacesList = await WorkspaceModel.find({ owner: user._id }).select(
    "_id name description"
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

export const updateWorkspaceService = async () => {};

export const deleteWorkspaceService = async (workspaceId: string) => {};
