// registration controller
//the user data will be recieved in body
//body will be verified using zod against schema
//then an account will be create 
//a jwt token will be signed
//the token will be then put in cookies and sent to frontend

//login controller
//the user credentials will be recieved
//zod validation will be done
//verification of user will be done
//a new access token will be signed
//the token will be then sent to frontend

import type { Request, Response } from "express";
import User from "../models/user.model.js";
import { generateToken } from "../utils/jwt.util.js";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";
import {authCookieOptions} from "../utils/cookie.js"

export const register = async (req: Request, res: Response) => {
  try {
    const validatedData = registerSchema.parse(req.body);

    const { name, email, password } = validatedData;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    res.cookie("access_token", token, authCookieOptions);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
    });

  } catch (error: any) {
    // Zod validation error
    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        errors: error.errors,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const validatedData = loginSchema.parse(req.body);

    const { email, password } = validatedData;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    res.cookie("access_token", token, authCookieOptions);

    return res.status(200).json({
      success: true,
      message: "Login successful",
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        errors: error.errors,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie("access_token", authCookieOptions);

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};
