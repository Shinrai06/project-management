// Ensure the keys and values are the same

export const TaskStatusEnum = {
  BACKLOG: "BACKLOG",
  TODO: "TODO",
  IN_PROGRESS: "IN_PROGRESS",
  CODE_REVIEW: "CODE_REVIEW",
  RESOLVED: "RESOLVED",
  WONT_FIX: "WONT_FIX",
} as const;

export const TaskPriotiyEnum = {
  HIGH: "HIGH",
  MEDIUM: "MEDIUM",
  LOW: "LOW",
} as const;

export type TaskStatusEnumType = keyof typeof TaskStatusEnum;
export type TaskPriotiyEnumType = keyof typeof TaskPriotiyEnum;
