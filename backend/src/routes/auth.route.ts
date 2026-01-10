//route for registration
//route for login

import { Router } from "express";
import { getAccessToken, login, logout, register } from "../controllers/auth.controller.js";
import { authenticateRefresh } from "../middlewares/authRefresh.middleware.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", authenticate, logout);
router.get("/refresh", authenticateRefresh, getAccessToken);

export default router;

