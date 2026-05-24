import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getActivitiesByProject,
  getRecentActivities
} from "../controller/ActivityController.js";

const router = express.Router();

// Map secure routes protected by auth token validation
router.get("/recent", protect, getRecentActivities);
router.get("/project/:projectId", protect, getActivitiesByProject);

export default router;
