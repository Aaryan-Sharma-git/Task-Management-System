import { JwtPayload } from "../interfaces/jwt.interface.ts";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
