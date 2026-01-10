import { type AccessTokenPayload, type RefreshTokenPayload } from "../interfaces/jwt.interface.ts";

declare global {
  namespace Express {
    interface Request {
      user?: AccessTokenPayload;
      session?: {
        sessionId: string
      }
    }
  }
}
