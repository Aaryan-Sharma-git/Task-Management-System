//here the request from the user will be intercepted and the access_token will be verified. If the token is valid then a payload will be recieved whose data will ve verified such as if user exist or not. once the payload is recieved, the data will be forwarded within body to the routes.

import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.util.js";
import { accessTokenCookieOptions } from "../utils/cookie.js";
import { TokenType } from "../utils/enum.util.js";
import type { AccessTokenPayload } from "../interfaces/jwt.interface.js";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req.cookies?.access_token;

    if (!accessToken) {
      return res.status(401).json({
        success: false,
        message: "access token is missing. bacche",
        errorCode: "INVALID_ACCESS_TOKEN"
      });
    }

    const decoded = verifyToken(accessToken, accessTokenCookieOptions, TokenType.ACCESS_TOKEN) as AccessTokenPayload;

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      sessionId: decoded.sessionId
    };

    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please login again.",
        errorCode: "INVALID_ACCESS_TOKEN"
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid authentication token",
      errorCode: "INVALID_ACCESS_TOKEN"
    });
  }
};
