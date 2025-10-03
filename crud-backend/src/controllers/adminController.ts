import { Request, Response } from "express";
import bcrypt from "bcrypt";
import pool from "../config/db";
import { generateToken } from "../utils/jwt";
import { sendResponse } from "../utils/response";
import { AuthRequest } from "../middlewares/authMiddleware";
import { encryptToken } from "../services/cryptoService";

export const adminLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return sendResponse(
      res,
      false,
      "Email and password are required",
      null,
      400
    );
  }

  try {
    const result = await pool.query("SELECT * FROM admins WHERE email = $1", [
      email,
    ]);

    const admin = result.rows[0];
    if (!admin) {
      return sendResponse(res, false, "Email Not Found", null, 401);
    }

    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      return sendResponse(res, false, "Invalid Password", null, 401);
    }

    const token = generateToken(admin.id, admin.email);
    console.log(token);
    const encryptedToken = encryptToken(token);

    res.cookie("token", encryptedToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 24 * 60 * 60 * 1000,
    });

    sendResponse(res, true, "Login successful", null, 200);
  } catch (err: any) {
    console.error(err);
    sendResponse(res, false, "Server Error", null, 500);
  }
};

export const createAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password, phone } = req.body;

    if (!email || !password || !phone) {
      return sendResponse(
        res,
        false,
        "Email, password and phone are required",
        null,
        400
      );
    }

    if (phone !== process.env.JWT_SECRET) {
      return sendResponse(res, false, "Invalid secret key", null, 403);
    }

    const existing = await pool.query<{ id: number }>(
      "SELECT id FROM admins WHERE email = $1",
      [email]
    );

    if (existing.rows.length > 0) {
      return sendResponse(res, false, "Admin email already exists", null, 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO admins (email, password_hash) VALUES ($1, $2)",
      [email, hashedPassword]
    );

    return sendResponse(res, true, "New admin created", { email }, 201);
  } catch (err: Error | unknown) {
    console.error("Create admin error:", err);

    return sendResponse(
      res,
      false,
      "Error creating admin: server error",
      err,
      500
    );
  }
};

export const fetchMe = (req: AuthRequest, res: Response) => {
  if (!req.admin) {
    return sendResponse(res, false, "Not authenticated", null, 401);
  }

  const { adminId, email, role, permissions } = req.admin;

  return sendResponse(res, true, "Admin fetched successfully", {
    adminId,
    email,
    role,
    permissions,
  });
};

export const logoutAdmin = (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  return sendResponse(res, true, "Logged out successfully", null, 200);
};
