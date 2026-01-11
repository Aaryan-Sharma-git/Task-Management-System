import session from "express-session";
import { SESSION_SECRET } from "../constants/env.js";

export const sessionMiddleware = session({
  name: "oauth-session",
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,

  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 10 * 60 * 1000, // 10 minutes
  },
});
