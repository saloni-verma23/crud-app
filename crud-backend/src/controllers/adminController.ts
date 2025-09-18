import { Request, Response } from "express";
import bcrypt from "bcrypt";
import pool from "../config/db";
import { generateToken } from "../utils/jwt";
import { sendResponse } from "../utils/response";

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

    sendResponse(res, true, "Login successful", token, 200);
  } catch (err: any) {
    console.error(err);
    sendResponse(res, false, "Server Error", null, 500);
  }
};
