import { Router } from "express";
import { continueWithGoogle, googleCallback } from "../controllers/google.controller.js";

const router = Router();

router.get("/", continueWithGoogle);
router.get("/callback", googleCallback);

export default router;
