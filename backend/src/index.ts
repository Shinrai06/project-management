import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";

import cors from "cors";
import session from "cookie-session";
import passport from "passport";
import { config } from "./config/app.config";
import connectDatabase from "./config/database.config";
import { HTTPSTATUS } from "./config/http.config";
import "./config/passport.config";
// import { redisClient, connectRedis } from "./config/redis.config";

import { asyncHandler } from "./middlewares/asyncHandler.middleware";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import { isAuthenticated } from "./middlewares/isAuthenticated.middleware";

// metrics, to enable uncomment
/*
import { register } from "./config/metrics.config";
import { prometheusMiddleware } from "./middlewares/prometheus.middleware";
*/

import authRoutes from "./routes/auth.route";
import memberRoutes from "./routes/member.route";
import projectRoutes from "./routes/project.route";
import userRoutes from "./routes/user.route";
import workspaceRoutes from "./routes/workspace.route";

const BASE_PATH = config.BASE_PATH;
// const REDIS_DEFAULT_TTL = 3600;
// const USERS_LIST_KEY = "users-list";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    name: "session",
    keys: [config.SESSION_SECRET],
    maxAge: 24 * 60 * 60 * 1000,
    secure: config.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: config.FRONTEND_ORIGIN,
    credentials: true,
  })
);

//metrics middleware uncomment to enable
//app.use(prometheusMiddleware);

// To test redis route
/*
app.get(
  `/test`,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let users_list = await redisClient.get(USERS_LIST_KEY);
    if (!users_list) {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/users`
      );
      users_list = await response.json();

      await redisClient.set(USERS_LIST_KEY, JSON.stringify(users_list), {
        EX: REDIS_DEFAULT_TTL,
      });
    } else {
      users_list = JSON.parse(users_list);
    }
    res.status(HTTPSTATUS.OK).json(users_list);
  })
);
*/

app.get(
  `/`,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    res.status(HTTPSTATUS.OK).json({
      message: "Hello Subscribe to channel & share",
    });
  })
);

/*  endpoint to expose metrics to Prometheus
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.send(await register.metrics());
});
*/

app.use(`${BASE_PATH}/auth`, authRoutes);
app.use(`${BASE_PATH}/member`, isAuthenticated, memberRoutes);
app.use(`${BASE_PATH}/project`, isAuthenticated, projectRoutes);
app.use(`${BASE_PATH}/user`, isAuthenticated, userRoutes);
app.use(`${BASE_PATH}/workspace`, isAuthenticated, workspaceRoutes);

app.use(errorHandler);

app.listen(config.PORT, async () => {
  console.log(`Server listening at port ${config.PORT} in ${config.NODE_ENV}`);

  console.log(
    `########################### Services list: ########################################`
  );
  await connectDatabase();
  // await connectRedis();

  console.log(
    "########################### Logs: ########################################"
  );
});
