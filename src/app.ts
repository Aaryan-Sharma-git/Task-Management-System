import express from "express";
import connectDB from "./config/database.js";
import authRouter from "./routes/auth.route.js"
import cookieParser from "cookie-parser";
import { authenticate } from "./middlewares/auth.middleware.js";
import taskRouter from "./routes/task.route.js"

const app = express();

connectDB();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/auth', authRouter);
app.use('/task', authenticate, taskRouter);

export default app;
