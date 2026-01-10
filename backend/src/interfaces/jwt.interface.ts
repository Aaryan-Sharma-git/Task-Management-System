export interface AccessTokenPayload {
  userId: string;
  sessionId: string;
  email: string;
  role: "admin" | "user";
}

export interface RefreshTokenPayload {
  sessionId: string
}
