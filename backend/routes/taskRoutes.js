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

router.post("/", isAuthenticated, createTask);
router.get("/",isAuthenticated, getTasks);
router.put("/:id",isAuthenticated, updateTask);
router.delete("/:id",isAuthenticated, deleteTask);
router.post("/:taskId/checklist",isAuthenticated, addChecklistItem);
router.put("/:taskId/checklist/:itemId",isAuthenticated, updateChecklistItem);
router.delete("/:taskId/checklist/:itemId",isAuthenticated, deleteChecklistItem);       

export default router;
