import { Router } from "express";
import { loginLimiter, refreshLimiter, registerLimiter } from '../middlewares/system/authRateLimit.js'
import { authController, registerAuthController, refreshAuthController, logoutAuthController } from "../controllers/system/auth.controller.js";
import { authMiddleware } from "../middlewares/system/auth.middleware.js";
import { loginTwitch } from "../controllers/twitch/callback.controller.js";

const router = Router();

//router.post("/", loginLimiter, authController);
//router.post("/register", registerLimiter, registerAuthController);
//router.post("/refresh", refreshLimiter, refreshAuthController);
//router.post("/logout", logoutAuthController);

router.post("/", authController);
router.post("/register", registerAuthController);
router.post("/refresh", refreshAuthController);
router.post("/logout", logoutAuthController);

router.get("/twitch/callback", loginTwitch)

export default router;