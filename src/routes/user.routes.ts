import { Router } from "express";
import { getUserController, updateUserController } from "../controllers/system/user.controller.js";
import { authMiddleware } from "../middlewares/system/auth.middleware.js";

const router = Router();

router.get("/me", authMiddleware, getUserController);
router.patch("/me", authMiddleware, updateUserController);

export default router;