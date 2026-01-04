import { Router } from "express";
import { authMiddleware } from "../middlewares/system/auth.middleware.js";
import { isAdmin } from "../middlewares/system/isAdmin.middleware.js";
import { createUserByAdminController, deleteUserByAdminController, getUsersByAdminController, updateUserByAdminController } from "../controllers/system/admin.controllers.js";
import { validateNumericParam } from "../middlewares/system/validateNumericParam.js";

const router = Router();

router.get("/users", authMiddleware, isAdmin, getUsersByAdminController);
router.post("/users", authMiddleware, isAdmin, createUserByAdminController);
router.patch("/users/:id", authMiddleware, isAdmin, validateNumericParam("id"), updateUserByAdminController);
router.delete("/users/:id", authMiddleware, isAdmin, validateNumericParam("id"), deleteUserByAdminController);

export default router;