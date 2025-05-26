import { Router } from "express";
import { joinWorkspaceContoller } from "../controllers/member.controller";

const memberRoutes = Router();
memberRoutes.post("/workspace/:inviteCode/join", joinWorkspaceContoller);

export default memberRoutes;
