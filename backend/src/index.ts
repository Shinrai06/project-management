import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";

import cors from "cors";
import session from "cookie-session";
import { config } from "./config/app.config";
import { REPLCommand } from "repl";
import connectDatabase from "./config/database.config";
import { HTTPSTATUS } from "./config/http.config";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import { asyncHandler } from "./middlewares/asyncHandler.middleware";
import { UnauthorisedExpection } from "./utils/appError";
import { redisClient, connectRedis } from "./config/redis.config";

import "./config/passport.config";
import passport from "passport";
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import { isAuthenticated } from "./middlewares/isAuthenticated.middleware";
import workspaceRoutes from "./routes/workspace.route";
import memberRoutes from "./routes/member.route";

const BASE_PATH = config.BASE_PATH;
const REDIS_DEFAULT_TTL = 3600;
const USERS_LIST_KEY = "users-list";

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

// To test redis route
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

app.get(
  `/`,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    res.status(HTTPSTATUS.OK).json({
      message: "Hello Subscribe to channel & share",
    });
  })
);

app.use(`${BASE_PATH}/auth`, authRoutes);
app.use(`${BASE_PATH}/member`, isAuthenticated, memberRoutes);
app.use(`${BASE_PATH}/user`, isAuthenticated, userRoutes);
app.use(`${BASE_PATH}/workspace`, isAuthenticated, workspaceRoutes);

app.use(errorHandler);

app.listen(config.PORT, async () => {
  console.log(`Server listening at port ${config.PORT} in ${config.NODE_ENV}`);

  console.log(
    `########################### Services list: ########################################`
  );
  await connectDatabase();
  await connectRedis();

  console.log(
    "########################### Logs: ########################################"
  );
});

// time stamp: 3 hr
