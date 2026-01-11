import type { Request, Response } from "express";
import {
  exchangeCodeForTokens,
  getGoogleAuthRedirect,
  verifyGoogleIdToken,
} from "../services/google.service.js";
import User from "../models/user.model.js";
import { SessionModel } from "../models/session.model.js";
import { generateToken } from "../utils/jwt.util.js";
import { TokenType } from "../utils/enum.util.js";
import { accessTokenCookieOptions, refreshTokenCookieOptions } from "../utils/cookie.js";
import { FRONTEND_URL } from "../constants/env.js";

export const continueWithGoogle = (req: Request, res: Response) => {
  const url = getGoogleAuthRedirect(req);
  res.redirect(url);
};

export const googleCallback = async (req: Request, res: Response) => {
  const { code, state } = req.query;

  if (!code || !state) {
    return res.status(400).send("Missing parameters");
  }

  if (state !== req.session.oauthState) {
    return res.status(401).send("Invalid state");
  }

  delete req.session.oauthState;

  const tokens = await exchangeCodeForTokens(code as string);

  const payload = await verifyGoogleIdToken(
    tokens.id_token,
    req.session.oauthNonce as string
  );

  delete req.session.oauthNonce;

  const { sub: googleId, email, name, email_verified } = payload;

  if (!email_verified) {
    throw new Error("Email not verified");
  }

  let user = await User.findOne({
    $or: [{ googleId }, ...(email ? [{ email }] : [])],
  });

  if (!user) {
    user = await User.create({
      ...(name && { name }),
      ...(email && { email }),
      googleId,
      authProvider: "google",
    });
  }

  if (user.authProvider === "local" && !user.googleId) {
    user.googleId = googleId;
    user.authProvider = "google";
    await user.save();
  }

  const session = await SessionModel.create({
    userId: user._id
  })

  const refreshToken = generateToken({
    sessionId: session._id.toString()
  }, {
    expiresIn: '30d'
  }, TokenType.REFRESH_TOKEN)

  const accessToken = generateToken({
    userId: user._id.toString(),
    sessionId: session._id.toString(),
    email: user.email,
    role: user.role,
  }, {
    expiresIn: '15m'
  });

  res.cookie("refresh_token", refreshToken, refreshTokenCookieOptions);
  res.cookie("access_token", accessToken, accessTokenCookieOptions);

  res.redirect(FRONTEND_URL);
};
