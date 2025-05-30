// src/middlewares/prometheus.middleware.ts
import { Request, Response, NextFunction } from "express";
import { httpRequestDuration } from "../config/metrics.config";

export const prometheusMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Start timer with labels method and route (use path as fallback)
  const end = httpRequestDuration.startTimer({
    method: req.method,
    route: req.route?.path || req.path,
  });

  res.on("finish", () => {
    const statusCode = res.statusCode.toString();

    // Stop timer and record status_code label
    end({ status_code: statusCode });
  });

  next();
};
