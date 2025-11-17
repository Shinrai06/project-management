import { z } from "zod";
import { TaskPriotiyEnum, TaskStatusEnum } from "../enums/task.enum";

const titleSchema = z.string().trim().min(1).max(255);
const desciptionSchema = z.string().trim().optional();
const assignedToSchema = z.string().trim().min(1).nullable().optional();

const prioritySchema = z.enum(
  Object.values(TaskPriotiyEnum) as [string, ...string[]]
);
const statusSchema = z.enum(
  Object.values(TaskStatusEnum) as [string, ...string[]]
);

const dueDateSchema = z
  .string()
  .trim()
  .optional()
  .refine(
    (val) => {
      return !val || !isNaN(Date.parse(val));
    },
    {
      message: "Invalid date format, Please provide date",
    }
  );

export const taskIdSchema = z.string().trim().min(1);

export const createTaskSchema = z.object({
  title: titleSchema,
  description: desciptionSchema,
  assignedTo: assignedToSchema,
  priority: prioritySchema,
  status: statusSchema,
  dueDate: dueDateSchema,
});

export const updateTaskSchema = z.object({
  title: titleSchema,
  description: desciptionSchema,
  assignedTo: assignedToSchema,
  priority: prioritySchema,
  status: statusSchema,
  dueDate: dueDateSchema,
});
