import { OAuth2Client } from "google-auth-library";
import { GOOGLE_CLIENT_ID } from "../constants/env.js";

export const oAuthClient = new OAuth2Client(GOOGLE_CLIENT_ID);