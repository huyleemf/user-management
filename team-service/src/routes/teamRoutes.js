import express from "express";
const router = express.Router();

import {
  createTeam,
  addMember,
  removeMember,
  addManager,
  removeManager,
  getTeam,
  removeTeam,
  getTeams,
} from "../controllers/teamController.js";

import protect from "../middleware/authenMiddleware.js";
import authorizeRoles from "../middleware/authorMiddleware.js";

router.delete(
  "/:teamId/members/:memberId",
  protect,
  authorizeRoles,
  removeMember
);
router.get("/", protect, getTeams);

router.post("/:teamId/members", protect, authorizeRoles, addMember);

router.delete(
  "/:teamId/managers/:managerId",
  protect,
  authorizeRoles,
  removeManager
);

router.post("/:teamId/managers", protect, authorizeRoles, addManager);

router.get("/:teamId", protect, getTeam);

router.delete("/:teamId", protect, authorizeRoles, removeTeam);

router.post("/", protect, authorizeRoles, createTeam);

export default router;
