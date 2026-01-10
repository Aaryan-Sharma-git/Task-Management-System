import jwt, { type SignOptions, type VerifyOptions } from "jsonwebtoken";
import type { AccessTokenPayload, RefreshTokenPayload } from "../interfaces/jwt.interface.js";
import { JWT_ACCESS_TOKEN_SECRET, JWT_REFRESH_TOKEN_SECRET } from "../constants/env.js";
import { TokenType } from "./enum.util.js";

export const generateToken = (payload: AccessTokenPayload | RefreshTokenPayload, options?: SignOptions, tokenType?: TokenType): string => {
  return jwt.sign(payload, (tokenType == TokenType.REFRESH_TOKEN) ? JWT_REFRESH_TOKEN_SECRET : JWT_ACCESS_TOKEN_SECRET, options);
};

export const verifyToken = (token: string, options?: VerifyOptions, tokenType?: TokenType): AccessTokenPayload | RefreshTokenPayload => {
  try {
    const decoded = jwt.verify(token, (tokenType == TokenType.REFRESH_TOKEN) ? JWT_REFRESH_TOKEN_SECRET : JWT_ACCESS_TOKEN_SECRET, options) as AccessTokenPayload | RefreshTokenPayload;
    return decoded;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};
