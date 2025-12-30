//here the request from the user will be intercepted and the access_token will be verified. If the token is valid then a payload will be recieved whose data will ve verified such as if user exist or not. once the payload is recieved, the data will be forwarded within body to the routes.

import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.util.js";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.access_token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const decoded = verifyToken(token);

    req.user = decoded;

    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please login again.",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid authentication token",
    });
  }
};
