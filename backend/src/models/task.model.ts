import mongoose, { Document, Schema } from "mongoose";
import {
  TaskPriotiyEnum,
  TaskPriotiyEnumType,
  TaskStatusEnum,
  TaskStatusEnumType,
} from "../enums/task.enum";
import { generateTaskCode } from "../utils/uuid";

export interface TaskDocument extends Document {
  taskCode: string;
  title: string;
  description: string | null;
  createdBy: mongoose.Types.ObjectId;
  assignedTo: mongoose.Types.ObjectId | null;
  priority: TaskPriotiyEnumType;
  status: TaskStatusEnumType;
  project: mongoose.Types.ObjectId;
  workspace: mongoose.Types.ObjectId;
  dueDate: Date | null;
  createdAt: Date;
  UpdateAt: Date;
}

const taskSchema = new Schema<TaskDocument>(
  {
    taskCode: {
      type: String,
      unique: true,
      default: generateTaskCode,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: null,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    workspace: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    status: {
      type: String,
      enum: Object.values(TaskStatusEnum),
      default: TaskStatusEnum.TODO,
    },
    priority: {
      type: String,
      enum: Object.values(TaskPriotiyEnum),
      default: TaskPriotiyEnum.MEDIUM,
    },
    dueDate: {
      type: Date,
      required: false,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const TaskModel = mongoose.model<TaskDocument>("Task", taskSchema);
export default TaskModel;
