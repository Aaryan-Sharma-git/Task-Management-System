import express from "express";
import connectDB from "./config/database.js";
import authRouter from "./routes/auth.route.js"
import cookieParser from "cookie-parser";
import { authenticate } from "./middlewares/auth.middleware.js";
import taskRouter from "./routes/task.route.js"
import userRouter from "./routes/user.route.js"
import cors from "cors";
import { FRONTEND_URL } from "./constants/env.js";
import { sessionMiddleware } from "./middlewares/session.middleware.js";
import googleRouter from "./routes/google.route.js"

const app = express();

connectDB();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

app.use(sessionMiddleware);

app.use('/auth', authRouter);
app.use('/google', googleRouter);
app.use('/task', authenticate, taskRouter);
app.use('/user', authenticate, userRouter);

export default app;
