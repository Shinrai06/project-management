import { Request } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";

export const createProjectController = asyncHandler(
  async (req: Request, res: Response) => {}
);
