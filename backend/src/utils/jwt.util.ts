import jwt from "jsonwebtoken";
import type { JwtPayload } from "../interfaces/jwt.interface.js";
import { JWT_ACCESS_TOKEN_SECRET } from "../constants/env.js";

export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, JWT_ACCESS_TOKEN_SECRET, {expiresIn: '7d'});
};

export const verifyToken = (token: string): JwtPayload => {
  try {
    const decoded = jwt.verify(token, JWT_ACCESS_TOKEN_SECRET) as JwtPayload;
    return decoded;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};
