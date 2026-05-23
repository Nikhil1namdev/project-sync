import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject
} from "../controller/ProjectCRUDController.js";

const router = express.Router();

// Map routes with secure token validation protection
router.route("/")
  .post(protect, createProject)
  .get(protect, getProjects);

router.route("/:id")
  .get(protect, getProjectById)
  .patch(protect, updateProject)
  .delete(protect, deleteProject);

export default router;
