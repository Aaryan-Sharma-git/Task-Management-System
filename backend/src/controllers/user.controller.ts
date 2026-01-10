import type { Request, Response } from "express";
import User from "../models/user.model.js";


export const getCurrentUser = async (
  req: Request,
  res: Response
) => {
  const userId = req.user!.userId;

  const user = await User.findById(userId).select(
    "-password -__v"
  );

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  res.status(200).json({
    success: true,
    user,
  });
};

export const getAllUsers = async (
  req: Request,
  res: Response
) => {
  try {
    // Optional: only admin can fetch all users
    if (req.user!.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const users = await User.find()
      .select("_id name email role")
      .sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};
