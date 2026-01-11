import axios from "axios";
import crypto from "crypto";
import querystring from "querystring";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URL } from "../constants/env.js";
import { GOOGLE_AUTHORIZATION_ENDPOINT, GOOGLE_TOKEN_ENDPOINT } from "../constants/oAuth.js";
import { oAuthClient } from "../config/oAuth.config.js";

function generateState(): string {
  return crypto.randomBytes(30).toString("hex");
}

function generateNonce(): string {
  return crypto.randomBytes(16).toString("hex");
}

export function getGoogleAuthRedirect(req: any) {
  const state = generateState();
  const nonce = generateNonce();

  req.session.oauthState = state;
  req.session.oauthNonce = nonce;

  const params = {
    response_type: "code",
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: GOOGLE_REDIRECT_URL,
    scope: "openid email profile",
    state,
    nonce,
  };

  const authUrl =
    `${GOOGLE_AUTHORIZATION_ENDPOINT}?` +
    querystring.stringify(params);

  return authUrl;
}

export async function exchangeCodeForTokens(code: string) {
  const body = new URLSearchParams({
    code,
    client_id: GOOGLE_CLIENT_ID,
    client_secret: GOOGLE_CLIENT_SECRET,
    redirect_uri: GOOGLE_REDIRECT_URL,
    grant_type: "authorization_code",
  });

  const response = await axios.post(
    GOOGLE_TOKEN_ENDPOINT,
    body.toString(),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return response.data;
}

export async function verifyGoogleIdToken(
  idToken: string,
  expectedNonce: string
) {
  const ticket = await oAuthClient.verifyIdToken({
    idToken,
    audience: GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  if (!payload) throw new Error("Invalid ID token");

  if (payload.nonce !== expectedNonce) {
    throw new Error("Invalid nonce");
  }

  return payload;
}

