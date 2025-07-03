import express from "express";
import { login, getUser, logout } from "../controllers/authController.js";
import isAuthenticated from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);
router.get("/getuser", isAuthenticated, getUser);

export default router;
