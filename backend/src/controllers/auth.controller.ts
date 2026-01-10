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
import {accessTokenCookieOptions, refreshTokenCookieOptions} from "../utils/cookie.js"
import { SessionModel, THIRTY_DAYS_IN_MS } from "../models/session.model.js";
import { TokenType } from "../utils/enum.util.js";

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

  const sessionId = req.user?.sessionId;
  const session = await SessionModel.findByIdAndDelete(sessionId);
  
  res.clearCookie("access_token", accessTokenCookieOptions);
  res.clearCookie("refresh_token", refreshTokenCookieOptions);

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

export const getAccessToken = async (req: Request, res: Response) => {
  try {
    const sessionId = req.session?.sessionId;

    const session = await SessionModel.findById(sessionId);

    if(!session){
      return res.status(404).json({
        message: 'session has expired.'
      })
    }

    const sessionNeedRefresh = (session.expiresAt.getTime() - Date.now() <= 24*60*60*1000);

    if(sessionNeedRefresh){
      session.expiresAt = new Date(Date.now() + THIRTY_DAYS_IN_MS);
      await session.save();

      const refreshToken = generateToken({
        sessionId: session._id.toString()
      }, {
        expiresIn: '30d'
      }, TokenType.REFRESH_TOKEN);

      res.cookie("refresh_token", refreshToken, refreshTokenCookieOptions);
    }

    const user = await User.findById(session.userId);

    if(!user){
      return res.status(404).json({
        message: "user with this session does not exist."
      })
    }

    const accessToken = generateToken({
      userId: user._id.toString(),
      sessionId: session._id.toString(),
      email: user.email,
      role: user.role,
    }, {
      expiresIn: '15m'
    });

    res.cookie("access_token", accessToken, accessTokenCookieOptions);

    return res.status(200).json({
      message: "access token refreshed successfully."
    })

  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};


