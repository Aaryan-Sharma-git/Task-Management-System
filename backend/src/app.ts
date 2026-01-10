import express from "express";
import connectDB from "./config/database.js";
import authRouter from "./routes/auth.route.js"
import cookieParser from "cookie-parser";
import { authenticate } from "./middlewares/auth.middleware.js";
import taskRouter from "./routes/task.route.js"
import userRouter from "./routes/user.route.js"
import cors from "cors";
import { FRONTEND_URL } from "./constants/env.js";

const app = express();

connectDB();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: FRONTEND_URL, // allows all domains
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);


app.use('/auth', authRouter);
app.use('/task', authenticate, taskRouter);
app.use('/user', authenticate, userRouter);

export default app;
