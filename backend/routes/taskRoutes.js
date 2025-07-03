import express from "express";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  addChecklistItem,
  updateChecklistItem,
  deleteChecklistItem,
} from "../controllers/taskController.js";
import isAuthenticated from "../middleware/authMiddleware.js";

const router = express.Router();

// 📦 Task routes
router.post("/", isAuthenticated, createTask);              // Create a new task
router.get("/",isAuthenticated, getTasks);                // Get all tasks for the user
router.put("/:id",isAuthenticated, updateTask);           // Update a task
router.delete("/:id",isAuthenticated, deleteTask);        // Delete a task
// ✅ Checklist routes (sub-routes of task)
router.post("/:taskId/checklist",isAuthenticated, addChecklistItem);                       // Add checklist item
router.put("/:taskId/checklist/:itemId",isAuthenticated, updateChecklistItem);            // Update checklist item
router.delete("/:taskId/checklist/:itemId",isAuthenticated, deleteChecklistItem);         // Delete checklist item

export default router;
