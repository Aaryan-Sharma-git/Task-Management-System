import { Schema, model } from "mongoose";
import type { ISession } from "../interfaces/db.interface.js";

export const THIRTY_DAYS_IN_MS = 30 * 24 * 60 * 60 * 1000;

const sessionSchema = new Schema<ISession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + THIRTY_DAYS_IN_MS),
    },
  },
  {
    timestamps: true
  }
);

sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const SessionModel = model<ISession>("Session", sessionSchema);
