import { Router } from "express";
import { getCurrentUser, getAllUsers } from "../controllers/user.controller.js";

const router = Router();

router.get("/me", getCurrentUser);
router.get('/users', getAllUsers);

export default router;