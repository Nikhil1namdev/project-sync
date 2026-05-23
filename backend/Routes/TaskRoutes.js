import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createTask,
  getTasksByProject,
  updateTask,
  deleteTask
} from "../controller/TaskCRUDController.js";

const router = express.Router();

// Map secure routes protected by token authentication
router.route("/")
  .post(protect, createTask);

router.route("/project/:projectId")
  .get(protect, getTasksByProject);

router.route("/:id")
  .patch(protect, updateTask)
  .delete(protect, deleteTask);

export default router;
