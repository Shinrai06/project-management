import { NextFunction, Request, Response } from "express";
import { UnauthorisedExpection } from "../utils/appError";
import { asyncHandler } from "./asyncHandler.middleware";

export const isAuthenticated = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user._id) {
      throw new UnauthorisedExpection("Unauthorised, Please log in");
    }
    next();
  }
);
